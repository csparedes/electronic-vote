import { getDb, candidates } from '../../database'
import { requireAuth, ROLES } from '../../utils/auth'

interface CsvRow {
  fullName: string
  listName: string
  imageUrl?: string
}

interface ParseResult {
  rows: CsvRow[]
  errors: string[]
}

function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    const nextChar = line[i + 1]

    if (inQuotes) {
      if (char === '"' && nextChar === '"') {
        current += '"'
        i++
      } else if (char === '"') {
        inQuotes = false
      } else {
        current += char
      }
    } else {
      if (char === '"') {
        inQuotes = true
      } else if (char === ',') {
        result.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }
  }

  result.push(current.trim())
  return result
}

function parseCSV(csvText: string): ParseResult {
  const normalized = csvText.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
  const lines = normalized.split('\n').map(l => l.trim()).filter(l => l.length > 0)

  if (lines.length < 2) {
    return { rows: [], errors: ['CSV must have a header row and at least one data row'] }
  }

  const headerLine = lines[0]
  if (!headerLine) {
    return { rows: [], errors: ['CSV header is empty'] }
  }

  const headers = parseCSVLine(headerLine).map(h => h.toLowerCase())

  const fullNameIndex = headers.findIndex(h => h === 'fullname' || h === 'full_name')
  const listNameIndex = headers.findIndex(h => h === 'listname' || h === 'list_name')
  const imageUrlIndex = headers.findIndex(h => h === 'imageurl' || h === 'image_url')

  if (fullNameIndex === -1) {
    return { rows: [], errors: ['CSV must have a "fullName" column'] }
  }
  if (listNameIndex === -1) {
    return { rows: [], errors: ['CSV must have a "listName" column'] }
  }

  const rows: CsvRow[] = []
  const errors: string[] = []

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]
    if (!line) continue

    const values = parseCSVLine(line)

    const fullName = fullNameIndex < values.length ? (values[fullNameIndex] ?? '').trim() : ''
    const listName = listNameIndex < values.length ? (values[listNameIndex] ?? '').trim() : ''
    const imageUrl = imageUrlIndex !== -1 && imageUrlIndex < values.length ? (values[imageUrlIndex] ?? '').trim() : ''

    if (!fullName) {
      errors.push(`Row ${i + 1}: missing fullName`)
      continue
    }
    if (!listName) {
      errors.push(`Row ${i + 1}: missing listName`)
      continue
    }

    if (imageUrl && !isValidUrl(imageUrl)) {
      errors.push(`Row ${i + 1}: invalid imageUrl format`)
      continue
    }

    rows.push({
      fullName,
      listName,
      imageUrl: imageUrl || undefined
    })
  }

  return { rows, errors }
}

function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return url.startsWith('/') || url.startsWith('./') || url.startsWith('../')
  }
}

export default defineEventHandler(async (event) => {
  await requireAuth(event, [ROLES.ADMIN, ROLES.DEV])

  const body = await readBody(event)
  const { csv } = body

  if (!csv || typeof csv !== 'string') {
    throw createError({
      statusCode: 400,
      message: 'CSV data is required'
    })
  }

  const parseResult = parseCSV(csv)

  if (parseResult.rows.length === 0) {
    const errorMsg = parseResult.errors.length > 0
      ? parseResult.errors.join('; ')
      : 'No valid candidates found in CSV'
    throw createError({
      statusCode: 400,
      message: errorMsg
    })
  }

  const db = getDb()

  const inserted = await db.insert(candidates).values(
    parseResult.rows.map(row => ({
      fullName: row.fullName,
      listName: row.listName,
      imageUrl: row.imageUrl || null
    }))
  ).returning()

  return {
    message: `${inserted.length} candidates imported successfully`,
    candidates: inserted,
    errors: parseResult.errors
  }
})
