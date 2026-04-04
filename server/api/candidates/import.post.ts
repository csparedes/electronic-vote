import { getDb, candidates } from '../../database'

interface CsvRow {
  fullName: string
  listName: string
  imageUrl?: string
}

function parseCSV(csvText: string): CsvRow[] {
  const lines = csvText.trim().split('\n')
  if (lines.length < 2) {
    return []
  }

  const headerLine = lines[0]
  if (!headerLine) {
    return []
  }

  const headers = headerLine.split(',').map(h => h.trim().toLowerCase())
  const rows: CsvRow[] = []

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]
    if (!line) continue

    const values = line.split(',').map(v => v.trim())
    const row: Record<string, string> = {}

    headers.forEach((header, index) => {
      const value = values[index]
      row[header] = value !== undefined ? value : ''
    })

    const fullName = row.fullname || row.full_name || ''
    const listName = row.listname || row.list_name || ''

    if (fullName) {
      rows.push({
        fullName,
        listName,
        imageUrl: row.imageurl || row.image_url || undefined
      })
    }
  }

  return rows
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { csv } = body

  if (!csv) {
    throw createError({
      statusCode: 400,
      message: 'CSV data is required'
    })
  }

  const rows = parseCSV(csv)

  if (rows.length === 0) {
    throw createError({
      statusCode: 400,
      message: 'No valid candidates found in CSV. Ensure headers are: fullName, listName, imageUrl (optional)'
    })
  }

  const validRows = rows.filter(row => row.fullName && row.listName)

  if (validRows.length === 0) {
    throw createError({
      statusCode: 400,
      message: 'No valid candidates found. Each row needs fullName and listName'
    })
  }

  const db = getDb()

  const inserted = await db.insert(candidates).values(
    validRows.map(row => ({
      fullName: row.fullName,
      listName: row.listName,
      imageUrl: row.imageUrl || null
    }))
  ).returning()

  return {
    message: `${inserted.length} candidates imported successfully`,
    candidates: inserted,
    failed: rows.length - validRows.length
  }
})
