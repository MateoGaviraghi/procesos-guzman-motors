import { addMonths, isAfter, isBefore, format, parseISO, startOfMonth, startOfDay } from 'date-fns'
import { es } from 'date-fns/locale'

export function isMoreThanOneMonth(dateStr: string | null): boolean {
  if (!dateStr) return false
  const date = parseISO(dateStr)
  const oneMonthFromNow = addMonths(startOfDay(new Date()), 1)
  return isAfter(date, oneMonthFromNow)
}

export function isWithinOneMonth(dateStr: string | null): boolean {
  if (!dateStr) return true
  return !isMoreThanOneMonth(dateStr)
}

export function formatDate(dateStr: string | null): string {
  if (!dateStr) return ''
  const date = parseISO(dateStr)
  return format(date, 'dd/MM/yyyy')
}

export function formatMonthYear(date: Date): string {
  return format(date, 'MMMM yyyy', { locale: es })
}

export function getMonthKey(dateStr: string): string {
  const date = parseISO(dateStr)
  return format(startOfMonth(date), 'yyyy-MM')
}

export function sortByDate(a: string | null, b: string | null): number {
  if (!a && !b) return 0
  if (!a) return 1
  if (!b) return -1
  const dateA = parseISO(a)
  const dateB = parseISO(b)
  if (isBefore(dateA, dateB)) return -1
  if (isAfter(dateA, dateB)) return 1
  return 0
}

export function getNextMonths(count: number): Date[] {
  const months: Date[] = []
  const now = new Date()
  for (let i = 1; i <= count; i++) {
    months.push(startOfMonth(addMonths(now, i)))
  }
  return months
}

export function isExpired(dateStr: string | null): boolean {
  if (!dateStr) return false
  const date = parseISO(dateStr)
  return isBefore(date, startOfDay(new Date()))
}

export function sortByDateWithExpired(a: string | null, b: string | null): number {
  const aExpired = a ? isBefore(parseISO(a), startOfDay(new Date())) : false
  const bExpired = b ? isBefore(parseISO(b), startOfDay(new Date())) : false

  // Vencidas primero
  if (aExpired && !bExpired) return -1
  if (!aExpired && bExpired) return 1

  // Sin fecha al final
  if (!a && !b) return 0
  if (!a) return 1
  if (!b) return -1

  const dateA = parseISO(a)
  const dateB = parseISO(b)
  if (isBefore(dateA, dateB)) return -1
  if (isAfter(dateA, dateB)) return 1
  return 0
}

export function toInputDate(dateStr: string | null): string {
  if (!dateStr) return ''
  return dateStr.substring(0, 10)
}
