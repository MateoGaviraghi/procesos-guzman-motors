export type ColumnStatus = 'contactar' | 'cotizar' | 'seguimiento' | 'remate'

export interface Card {
  id: string
  name: string
  phone: string
  product: string
  column_status: ColumnStatus
  contact_date: string | null
  quote_date: string | null
  note: string
  pdf_url: string | null
  position: number
  created_at: string
  updated_at: string
}

export type CardInsert = Omit<Card, 'id' | 'created_at' | 'updated_at'>

export const COLUMNS: { id: ColumnStatus; title: string }[] = [
  { id: 'contactar', title: 'contactar' },
  { id: 'cotizar', title: 'cotizar' },
  { id: 'seguimiento', title: 'seguimiento' },
  { id: 'remate', title: 'remate' },
]
