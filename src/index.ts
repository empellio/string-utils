/*
  @empellio/string-utils
  Lightweight, dependency-free string utilities for Node.js and TypeScript
*/

export type SlugifyOptions = {
  lower?: boolean
  separator?: string
  preserveChars?: string | RegExp
  trim?: boolean
}

/** Remove diacritics/accents using Unicode normalization. */
export function stripDiacritics(input: string): string {
  return input.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

/** Escape special regex characters so the string can be used inside a RegExp. */
export function escapeRegex(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, r => `\\${r}`)
}

/** Escape HTML entities. */
export function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/** Unescape HTML entities. */
export function unescapeHtml(input: string): string {
  return input
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
}

/** Remove HTML tags (basic; not an HTML parser). */
export function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, '')
}

/**
 * Convert text to a URL-friendly slug.
 * - removes diacritics, lowercases (optional), replaces non-alphanumerics with a separator
 */
export function slugify(input: string, options: SlugifyOptions = {}): string {
  const {
    lower = true,
    separator = '-',
    preserveChars = '',
    trim = true,
  } = options

  const preserved = typeof preserveChars === 'string' ? preserveChars : ''
  const preserveRe = typeof preserveChars === 'string' ? new RegExp(`[${escapeRegex(preserved)}]`, 'g') : preserveChars

  const clean = stripDiacritics(input)
    .replace(preserveRe || /$(?=.)/, (m: string) => m)
    .replace(/[^\p{L}\p{N}]+/gu, separator)
    .replace(new RegExp(`${escapeRegex(separator)}{2,}`, 'g'), separator)

  let result = trim ? clean.replace(new RegExp(`^${escapeRegex(separator)}|${escapeRegex(separator)}$`, 'g'), '') : clean
  if (lower) result = result.toLowerCase()
  return result
}

export type TitleCaseOptions = {
  locale?: string | string[]
  smallWords?: string[]
  forceUpper?: string[]
}

const DEFAULT_SMALL_WORDS = new Set([
  'a','an','and','as','at','but','by','for','in','of','on','or','the','to','nor','per','vs','via'
])

/** Title-case with handling of small words and boundaries. */
export function toTitleCase(input: string, options: TitleCaseOptions = {}): string {
  const { locale = 'en', smallWords = [], forceUpper = [] } = options
  const small = new Set([...DEFAULT_SMALL_WORDS, ...smallWords.map(w => w.toLowerCase())])
  const force = new Set(forceUpper.map(w => w.toUpperCase()))

  return input
    .split(/(\s+|[-–—/:;!?"'()\[\]])/)
    .map((token, idx, arr) => {
      // separators stay as-is
      if (/^\s+$/.test(token) || /[-–—/:;!?"'()\[\]]/.test(token)) return token
      const upperToken = token.toUpperCase()
      if (force.has(upperToken)) return upperToken

      const isFirst = idx === 0
      const isLast = idx === arr.length - 1
      const lowerToken = token.toLowerCase()

      if (!isFirst && !isLast && small.has(lowerToken)) return lowerToken

      // handle hyphenated words
      return lowerToken
        .split('-')
        .map(part => part.charAt(0).toLocaleUpperCase(locale) + part.slice(1))
        .join('-')
    })
    .join('')
}

export type SanitizeFilenameOptions = {
  replacement?: string
  maxLength?: number
}

/** Sanitize a string for safe use as a filename (cross-platform friendly). */
export function sanitizeFilename(input: string, options: SanitizeFilenameOptions = {}): string {
  const { replacement = '-', maxLength = 255 } = options
  let name = stripDiacritics(input)
  name = name.replace(/[\\/:*?"<>|\0]/g, replacement)
  name = name.replace(/[\s]+/g, ' ')
  name = name.replace(/\.+$/g, '') // trailing dots
  name = name.trim()
  if (name.length === 0) name = 'untitled'
  if (name.length > maxLength) name = name.slice(0, maxLength)
  return name
}

/** True if string is empty or consists only of whitespace. */
export function isBlank(input: string): boolean {
  return /^\s*$/.test(input)
}

/** Truncate by characters; optionally keep whole words. */
export function truncate(input: string, maxLength: number, options: { ellipsis?: string; keepWords?: boolean } = {}): string {
  const { ellipsis = '…', keepWords = false } = options
  if (input.length <= maxLength) return input
  if (maxLength <= ellipsis.length) return ellipsis.slice(0, maxLength)
  let cut = maxLength - ellipsis.length
  if (keepWords) {
    const slice = input.slice(0, cut)
    const lastSpace = slice.lastIndexOf(' ')
    if (lastSpace > 0) cut = lastSpace
  }
  return input.slice(0, cut) + ellipsis
}

/** Truncate the middle with an ellipsis. */
export function truncateMiddle(input: string, maxLength: number, ellipsis = '…'): string {
  if (input.length <= maxLength) return input
  if (maxLength <= ellipsis.length) return ellipsis.slice(0, maxLength)
  const keep = maxLength - ellipsis.length
  const start = Math.ceil(keep / 2)
  const end = input.length - Math.floor(keep / 2)
  return input.slice(0, start) + ellipsis + input.slice(end)
}

/** Create a human-readable list using Intl.ListFormat when available. */
export function humanizeList(items: Array<string | number>, options: { locale?: string | string[]; type?: 'conjunction' | 'disjunction' | 'unit' } = {}): string {
  const { locale = 'en', type = 'conjunction' } = options
  // @ts-ignore - Runtime feature detection
  if (typeof (Intl as any).ListFormat === 'function') {
    // @ts-ignore
    const lf = new (Intl as any).ListFormat(locale, { type })
    return lf.format(items as any)
  }
  const arr = items.map(String)
  if (arr.length <= 1) return arr.join('')
  if (type === 'disjunction') return arr.slice(0, -1).join(', ') + ' or ' + arr[arr.length - 1]
  return arr.slice(0, -1).join(', ') + ' and ' + arr[arr.length - 1]
}

/** Levenshtein edit distance (memory efficient). */
export function levenshtein(a: string, b: string): number {
  if (a === b) return 0
  if (a.length === 0) return b.length
  if (b.length === 0) return a.length
  if (a.length > b.length) [a, b] = [b, a]

  const prev = new Array(a.length + 1)
  for (let i = 0; i <= a.length; i++) prev[i] = i

  for (let j = 1; j <= b.length; j++) {
    let prevDiag = prev[0]
    prev[0] = j
    for (let i = 1; i <= a.length; i++) {
      const temp = prev[i]
      const cost = a.charCodeAt(i - 1) === b.charCodeAt(j - 1) ? 0 : 1
      prev[i] = Math.min(
        prev[i] + 1,      // deletion
        prev[i - 1] + 1,  // insertion
        prevDiag + cost   // substitution
      )
      prevDiag = temp
    }
  }
  return prev[a.length]
}

/** Similarity score in [0,1] based on normalized Levenshtein distance. */
export function similarity(a: string, b: string): number {
  const maxLen = Math.max(a.length, b.length)
  if (maxLen === 0) return 1
  return 1 - levenshtein(a, b) / maxLen
}

/** Count user-perceived characters using Intl.Segmenter when available. */
export function countGraphemes(input: string): number {
  // @ts-ignore - feature detect
  if (typeof (Intl as any).Segmenter === 'function') {
    // @ts-ignore
    const seg = new (Intl as any).Segmenter(undefined, { granularity: 'grapheme' })
    // @ts-ignore
    return Array.from(seg.segment(input)).length
  }
  return Array.from(input).length
}

/** Reverse user-perceived characters (keeps surrogate pairs and combining marks intact). */
export function reverseGraphemes(input: string): string {
  // @ts-ignore - feature detect
  if (typeof (Intl as any).Segmenter === 'function') {
    // @ts-ignore
    const seg = new (Intl as any).Segmenter(undefined, { granularity: 'grapheme' })
    // @ts-ignore
    return Array.from(seg.segment(input), (s: any) => s.segment).reverse().join('')
  }
  return Array.from(input).reverse().join('')
}

export function startsWithAny(input: string, prefixes: string[]): boolean {
  for (const p of prefixes) if (input.startsWith(p)) return true
  return false
}

export function endsWithAny(input: string, suffixes: string[]): boolean {
  for (const s of suffixes) if (input.endsWith(s)) return true
  return false
}

export function containsAny(input: string, needles: string[]): boolean {
  for (const n of needles) if (input.includes(n)) return true
  return false
}

/** A fast replaceAll that works in environments without String.prototype.replaceAll. */
export function replaceAllFast(input: string, search: string | RegExp, replacement: string): string {
  if (typeof search === 'string') {
    if (search === '') return input
    return input.split(search).join(replacement)
  }
  const re = search.global ? search : new RegExp(search.source, search.flags + 'g')
  return input.replace(re, replacement)
}

// Word splitting helper used by case converters
function splitWordsCore(input: string): string[] {
  const withoutApostrophes = input.replace(/[’']/g, '')
  const spaced = withoutApostrophes
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
  if (!spaced) return []
  return spaced.split(/\s+/)
}

export function toCamelCase(input: string): string {
  const words = splitWordsCore(input.toLowerCase())
  if (words.length === 0) return ''
  return words[0] + words.slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')
}

export function toPascalCase(input: string): string {
  const words = splitWordsCore(input.toLowerCase())
  return words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')
}

export function toSnakeCase(input: string): string {
  const words = splitWordsCore(input)
  return words.map(w => stripDiacritics(w).toLowerCase()).join('_')
}

export function toKebabCase(input: string): string {
  const words = splitWordsCore(input)
  return words.map(w => stripDiacritics(w).toLowerCase()).join('-')
}

export function capitalize(input: string): string {
  if (!input) return ''
  return input.charAt(0).toUpperCase() + input.slice(1)
}

export function decapitalize(input: string): string {
  if (!input) return ''
  return input.charAt(0).toLowerCase() + input.slice(1)
}

export function normalizeWhitespace(input: string, options: { preserveNewlines?: boolean } = {}): string {
  const { preserveNewlines = false } = options
  if (preserveNewlines) {
    const normalized = input.replace(/\r\n?|\u2028|\u2029/g, '\n')
    return normalized.replace(/[ \t\f\v]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim()
  }
  return input.replace(/\s+/g, ' ').trim()
}

/** Strip ANSI escape codes. */
export function stripAnsi(input: string): string {
  const pattern =
    /[\u001B\u009B][[\]()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g
  return input.replace(pattern, '')
}

/** Return the English ordinal for a number (e.g., 1 -> 1st). */
export function ordinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return `${n}${s[(v - 20) % 10] || s[v] || s[0]}`
}

/** Ensure a prefix exists. */
export function ensurePrefix(input: string, prefix: string): string {
  return input.startsWith(prefix) ? input : prefix + input
}

/** Ensure a suffix exists. */
export function ensureSuffix(input: string, suffix: string): string {
  return input.endsWith(suffix) ? input : input + suffix
}

// Additional utilities

/** Return array of words parsed from the string (diacritics-aware). */
export function words(input: string): string[] {
  return splitWordsCore(input)
}

/** Convert to sentence case (capitalize first letter, rest lowercased). */
export function toSentenceCase(input: string): string {
  const normalized = normalizeWhitespace(input)
  if (!normalized) return ''
  return normalized.charAt(0).toUpperCase() + normalized.slice(1).toLowerCase()
}

/** CONSTANT_CASE */
export function toConstantCase(input: string): string {
  const w = splitWordsCore(input)
  return w.map(x => stripDiacritics(x).toUpperCase()).join('_')
}

export type WordWrapOptions = {
  width?: number
  breakLongWords?: boolean
  indent?: string
  newline?: string
}

/**
 * Wrap text to a given width.
 */
export function wordWrap(input: string, options: WordWrapOptions = {}): string {
  const { width = 80, breakLongWords = false, indent = '', newline = '\n' } = options
  if (width <= 0) return indent + input
  const out: string[] = []
  const lines = String(input).split(/\r\n?|\n/)
  for (const line of lines) {
    let current = ''
    const tokens = line.split(/(\s+)/)
    for (const token of tokens) {
      if (token === '') continue
      if (current.length + token.length <= width || current.length === 0) {
        current += token
        continue
      }
      // token does not fit
      if (!/\s+/.test(token)) {
        // word
        if (breakLongWords && token.length > width) {
          const spaceLeft = width - current.length
          if (spaceLeft > 0) {
            current += token.slice(0, spaceLeft)
            out.push(indent + current)
            current = ''
            const rest = token.slice(spaceLeft)
            for (let i = 0; i < rest.length; i += width) {
              const chunk = rest.slice(i, i + width)
              if (chunk.length === width) out.push(indent + chunk)
              else current = chunk
            }
          } else {
            for (let i = 0; i < token.length; i += width) {
              const chunk = token.slice(i, i + width)
              if (chunk.length === width) out.push(indent + chunk)
              else current = chunk
            }
          }
        } else {
          out.push(indent + current.trimEnd())
          current = token
        }
      } else {
        // whitespace token longer than width -> force line break
        out.push(indent + current.trimEnd())
        current = ''
      }
    }
    out.push(indent + current.trimEnd())
  }
  return out.join(newline)
}

/** Remove common indentation from multiline string. */
export function dedent(input: string, options: { trim?: boolean } = {}): string {
  const { trim = true } = options
  let str = String(input)
  if (trim) str = str.replace(/^\n+|\n+$/g, '')
  const lines = str.split(/\n/)
  let minIndent: number | null = null
  for (const l of lines) {
    if (!l.trim()) continue
    const m = l.match(/^\s*/)
    const indent = m ? m[0].length : 0
    minIndent = minIndent === null ? indent : Math.min(minIndent, indent)
  }
  if (!minIndent) return str
  return lines.map(l => (l.startsWith(' '.repeat(minIndent!)) ? l.slice(minIndent!) : l)).join('\n')
}

export type MaskOptions = {
  showStart?: number
  showEnd?: number
  maskChar?: string
}

/** Mask a string except for the first/last N characters. */
export function mask(input: string, options: MaskOptions = {}): string {
  const { showStart = 0, showEnd = 4, maskChar = '•' } = options
  const s = String(input)
  const start = s.slice(0, Math.max(0, showStart))
  const end = s.slice(Math.max(0, s.length - Math.max(0, showEnd)))
  const maskedLength = Math.max(0, s.length - start.length - end.length)
  return start + maskChar.repeat(maskedLength) + end
}

/** Center pad a string to a given width. */
export function center(input: string, width: number, padChar = ' '): string {
  const s = String(input)
  if (s.length >= width) return s
  const total = width - s.length
  const left = Math.floor(total / 2)
  const right = total - left
  return padChar.repeat(left) + s + padChar.repeat(right)
}

export type FixedLengthOptions = {
  padChar?: string
  truncateDirection?: 'end' | 'start' | 'middle'
}

/** Ensure string is exactly length N by padding or truncating. */
export function toFixedLength(input: string, length: number, options: FixedLengthOptions = {}): string {
  const { padChar = ' ', truncateDirection = 'end' } = options
  const s = String(input)
  if (s.length === length) return s
  if (s.length < length) return s + padChar.repeat(length - s.length)
  // truncate
  if (truncateDirection === 'start') return s.slice(s.length - length)
  if (truncateDirection === 'middle') {
    const keep = length
    const half = Math.floor(keep / 2)
    return s.slice(0, half) + s.slice(s.length - (keep - half))
  }
  return s.slice(0, length)
}

/** Extract initials from text (default: two letters). */
export function initials(input: string, maxLetters = 2): string {
  const w = splitWordsCore(input)
  const letters = w.filter(Boolean).map(x => x[0]).slice(0, maxLetters)
  return letters.join('').toUpperCase()
}

// Base64 helpers (Node and browser)
function hasBuffer(): boolean {
  try { return typeof Buffer !== 'undefined' && typeof Buffer.from === 'function' } catch { return false }
}

export function base64Encode(input: string): string {
  if (hasBuffer()) return Buffer.from(input, 'utf-8').toString('base64')
  // browser fallback
  // @ts-ignore
  if (typeof btoa === 'function') return btoa(unescape(encodeURIComponent(input)))
  throw new Error('Base64 encode not supported in this environment')
}

export function base64Decode(b64: string): string {
  if (hasBuffer()) return Buffer.from(b64, 'base64').toString('utf-8')
  // @ts-ignore
  if (typeof atob === 'function') return decodeURIComponent(escape(atob(b64)))
  throw new Error('Base64 decode not supported in this environment')
}

export function base64UrlEncode(input: string): string {
  return base64Encode(input).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

export function base64UrlDecode(b64url: string): string {
  let b64 = b64url.replace(/-/g, '+').replace(/_/g, '/')
  const pad = b64.length % 4
  if (pad) b64 += '='.repeat(4 - pad)
  return base64Decode(b64)
}

// Validators (simple and pragmatic)
export function isEmail(input: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
  return re.test(input)
}

export function isUUID(input: string): boolean {
  const re = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return re.test(input)
}

export function isURL(input: string): boolean {
  try { new URL(input); return true } catch { return false }
}

export function isHexColor(input: string): boolean {
  return /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{4}|[0-9a-fA-F]{8})$/.test(input)
}

/** Get substring between two markers. Returns null if not found. */
export function between(input: string, start: string, end: string, fromIndex = 0): string | null {
  const i = input.indexOf(start, fromIndex)
  if (i === -1) return null
  const j = input.indexOf(end, i + start.length)
  if (j === -1) return null
  return input.slice(i + start.length, j)
}

/** Get all non-overlapping substrings between two markers. */
export function betweenAll(input: string, start: string, end: string): string[] {
  const out: string[] = []
  let idx = 0
  while (idx < input.length) {
    const val = between(input, start, end, idx)
    if (val == null) break
    const startIdx = input.indexOf(start, idx)
    const endIdx = input.indexOf(end, startIdx + start.length)
    out.push(val)
    idx = endIdx + end.length
  }
  return out
}

/** Remove punctuation characters (Unicode-aware). */
export function removePunctuation(input: string): string {
  try { return input.replace(/\p{P}+/gu, '') } catch {
    return input.replace(/[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]+/g, '')
  }
}

export type TemplateOptions = {
  start?: string
  end?: string
  strict?: boolean // if true, replace missing keys with '' instead of leaving placeholders
}

/** Simple template interpolation: "Hello {name}" */
export function template(input: string, vars: Record<string, unknown>, options: TemplateOptions = {}): string {
  const { start = '{', end = '}', strict = false } = options
  if (!input) return ''
  const re = new RegExp(`${escapeRegex(start)}(.*?)${escapeRegex(end)}`, 'g')
  return input.replace(re, (_, key: string) => {
    const k = key.trim()
    if (Object.prototype.hasOwnProperty.call(vars, k)) {
      const v = vars[k]
      return v == null ? '' : String(v)
    }
    return strict ? '' : `${start}${key}${end}`
  })
}

export const version = '0.1.0'
