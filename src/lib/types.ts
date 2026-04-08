export type ColumnStatus = 'contactar' | 'cotizar' | 'seguimiento' | 'remate'

export type Responsible = 'Hector' | 'Victor' | ''

export interface Card {
  id: string
  name: string
  phone: string
  product: string
  responsible: Responsible
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

export const COLUMNS: { id: ColumnStatus; title: string; accent: string; accentBorder: string; headerBg: string; hex: string }[] = [
  { id: 'contactar', title: 'Contactar', accent: 'bg-blue-500', accentBorder: 'border-t-blue-500', headerBg: 'bg-blue-50', hex: '#3b82f6' },
  { id: 'cotizar', title: 'Cotizar', accent: 'bg-amber-500', accentBorder: 'border-t-amber-500', headerBg: 'bg-amber-50', hex: '#f59e0b' },
  { id: 'seguimiento', title: 'Seguimiento', accent: 'bg-emerald-500', accentBorder: 'border-t-emerald-500', headerBg: 'bg-emerald-50', hex: '#10b981' },
  { id: 'remate', title: 'Remate', accent: 'bg-rose-500', accentBorder: 'border-t-rose-500', headerBg: 'bg-rose-50', hex: '#f43f5e' },
]
