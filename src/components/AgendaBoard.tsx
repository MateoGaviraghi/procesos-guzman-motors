import type { Card as CardType } from '../lib/types'
import { isMoreThanOneMonth, formatMonthYear, getMonthKey, getNextMonths, sortByDate, formatDate } from '../lib/dateUtils'

interface Props {
  cards: CardType[]
  onCardClick: (card: CardType) => void
}

export function AgendaBoard({ cards, onCardClick }: Props) {
  const agendaCards = cards.filter(c => c.contact_date && isMoreThanOneMonth(c.contact_date))
  const months = getNextMonths(12)

  const getMonthCards = (monthDate: Date) => {
    const key = monthDate.toISOString().substring(0, 7)
    return agendaCards
      .filter(c => getMonthKey(c.contact_date!) === key)
      .sort((a, b) => sortByDate(a.contact_date, b.contact_date))
  }

  return (
    <div className="flex h-full overflow-x-auto">
      {months.map(month => {
        const monthCards = getMonthCards(month)
        const monthLabel = formatMonthYear(month)
        const hasCards = monthCards.length > 0

        return (
          <div
            key={month.toISOString()}
            className="flex flex-col min-w-[230px] w-[230px] shrink-0 h-full border-r border-slate-300 last:border-r-0 border-t-[3px] border-t-violet-500"
          >
            <div className="px-4 py-3 bg-violet-50 border-b border-slate-300 flex items-center gap-2.5">
              <h2 className="text-[18px] font-bold text-slate-800 capitalize">{monthLabel}</h2>
              {hasCards && (
                <span className="text-[12px] font-bold text-white bg-violet-500 min-w-[22px] h-[22px] rounded-full flex items-center justify-center">
                  {monthCards.length}
                </span>
              )}
            </div>
            <div className="flex-1 overflow-y-auto px-2.5 py-2.5 column-scroll bg-slate-100/80">
              {!hasCards && (
                <p className="text-[14px] text-slate-400 text-center py-8">—</p>
              )}
              {monthCards.map(card => (
                <div
                  key={card.id}
                  onClick={() => onCardClick(card)}
                  className="bg-white rounded-lg border border-slate-300 border-l-[4px] border-l-violet-400
                             shadow-[0_1px_3px_rgba(0,0,0,0.1)] px-4 py-3 mb-2 cursor-pointer
                             hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] hover:translate-y-[-1px] transition-all duration-150"
                >
                  <p className="text-[16px] font-bold text-slate-900 truncate">{card.name}</p>
                  <p className="text-[14px] text-slate-500 truncate mt-0.5">{card.product}</p>
                  <p className="text-[14px] text-slate-500 font-semibold text-right mt-1">
                    {formatDate(card.contact_date)}
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
