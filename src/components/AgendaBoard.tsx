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
    <div className="flex h-full overflow-x-auto border-t-2 border-black">
      {months.map(month => {
        const monthCards = getMonthCards(month)
        const monthLabel = formatMonthYear(month)

        return (
          <div
            key={month.toISOString()}
            className="flex flex-col min-w-[220px] w-[220px] shrink-0 h-full border-r-2 border-black last:border-r-0"
          >
            <div className="px-4 py-3 bg-white border-b-2 border-black">
              <h2 className="text-[20px] font-black text-black capitalize">
                {monthLabel}
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto px-3 py-2 column-scroll bg-white">
              {monthCards.length === 0 && (
                <p className="text-[14px] text-gray-400 text-center py-8">—</p>
              )}
              {monthCards.map(card => (
                <div
                  key={card.id}
                  onClick={() => onCardClick(card)}
                  className="bg-white border border-black rounded px-3 py-2.5 mb-2 cursor-pointer
                             hover:shadow-md transition-shadow"
                >
                  <p className="text-[16px] font-bold text-black truncate">{card.name}</p>
                  <p className="text-[14px] text-black truncate">{card.product}</p>
                  <p className="text-[13px] text-black font-semibold text-right mt-0.5">
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
