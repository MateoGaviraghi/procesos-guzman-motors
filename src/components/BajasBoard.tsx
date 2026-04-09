import type { Card as CardType } from '../lib/types'
import { formatDate, formatMonthYear, getMonthKey, sortByDate } from '../lib/dateUtils'
import { startOfMonth, addMonths } from 'date-fns'

interface Props {
  cards: CardType[]
  onCardClick: (card: CardType) => void
}

export function BajasBoard({ cards, onCardClick }: Props) {
  const bajasCards = cards.filter(c => c.column_status === 'baja')

  const months: Date[] = []
  const now = new Date()
  for (let i = -3; i <= 9; i++) months.push(startOfMonth(addMonths(now, i)))

  const getMonthCards = (monthDate: Date) => {
    const key = monthDate.toISOString().substring(0, 7)
    return bajasCards
      .filter(c => getMonthKey(c.updated_at) === key)
      .sort((a, b) => sortByDate(a.updated_at, b.updated_at))
  }

  return (
    <div className="flex h-full overflow-x-auto">
      {months.map(month => {
        const monthCards = getMonthCards(month)
        const label = formatMonthYear(month)
        return (
          <div key={month.toISOString()}
            className="flex flex-col min-w-[230px] w-[230px] shrink-0 h-full border-r border-slate-300 last:border-r-0 border-t-[3px] border-t-slate-500">
            <div className="px-4 py-3 bg-slate-200 border-b border-slate-300 flex items-center gap-2.5">
              <h2 className="text-[18px] font-bold text-slate-800 capitalize">{label}</h2>
              {monthCards.length > 0 && (
                <span className="text-[12px] font-bold text-white bg-slate-500 min-w-[22px] h-[22px] rounded-full flex items-center justify-center">
                  {monthCards.length}
                </span>
              )}
            </div>
            <div className="flex-1 overflow-y-auto px-2.5 py-2.5 column-scroll bg-slate-100/80">
              {monthCards.length === 0 && <p className="text-[14px] text-slate-400 text-center py-8">—</p>}
              {monthCards.map(card => (
                <div key={card.id} onClick={() => onCardClick(card)}
                  className="bg-white rounded-lg border border-slate-300 border-l-[4px] border-l-slate-400
                             shadow-[0_1px_3px_rgba(0,0,0,0.1)] px-4 py-3 mb-2 cursor-pointer
                             hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] hover:translate-y-[-1px] transition-all duration-150">
                  <p className="text-[16px] font-bold text-slate-900 truncate">{card.name}</p>
                  <p className="text-[14px] text-slate-500 truncate mt-0.5">{(card.product || [])[0] || ''}</p>
                  <p className="text-[14px] text-slate-500 font-semibold text-right mt-1">
                    {formatDate(card.updated_at)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
