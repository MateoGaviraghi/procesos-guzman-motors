import { Draggable } from '@hello-pangea/dnd'
import type { Card as CardType, ColumnStatus } from '../lib/types'
import { formatDate, isExpired } from '../lib/dateUtils'

interface Props {
  card: CardType
  index: number
  accentColor: string
  onClick: () => void
}

const expirableColumns: ColumnStatus[] = ['contactar', 'cotizar']

export function Card({ card, index, accentColor, onClick }: Props) {
  const expired = expirableColumns.includes(card.column_status) && isExpired(card.contact_date)

  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={onClick}
          style={{ ...provided.draggableProps.style, borderLeftColor: expired ? undefined : accentColor }}
          className={`
            rounded-lg px-4 py-3 mb-2 cursor-pointer transition-all duration-150
            border-l-[4px] shadow-[0_1px_3px_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.08)]
            hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:translate-y-[-1px]
            ${expired
              ? 'bg-red-50 border-l-red-500 border border-red-200'
              : 'bg-white border border-slate-300'
            }
            ${snapshot.isDragging ? 'shadow-[0_8px_25px_rgba(0,0,0,0.2)] rotate-[1.5deg] scale-[1.02]' : ''}
          `}
        >
          <div className="flex items-start justify-between gap-2">
            <p className="text-[18px] font-bold text-slate-900 leading-snug truncate flex-1">
              {card.name}
            </p>
            {expired && (
              <span className="text-[11px] font-bold text-white bg-red-500 px-2 py-0.5 rounded-full whitespace-nowrap shrink-0 uppercase tracking-wider">
                Vencida
              </span>
            )}
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-[16px] text-slate-600">{card.phone}</span>
            <div className="flex items-center gap-1.5 shrink-0">
              {card.pdf_url && (
                <span className="text-[11px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-bold border border-orange-200">
                  PDF
                </span>
              )}
              {card.responsible && (
                <span className="text-[12px] bg-slate-800 text-white px-2.5 py-0.5 rounded-full font-semibold">
                  {card.responsible}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-end justify-between mt-1">
            <span className="text-[16px] text-slate-600 truncate">{card.product}</span>
            <span className={`text-[15px] font-semibold shrink-0 ml-3 ${expired ? 'text-red-500' : 'text-slate-500'}`}>
              {card.contact_date ? formatDate(card.contact_date) : ''}
            </span>
          </div>
          {card.quote_date && (
            <p className="text-[14px] text-emerald-600 font-semibold text-right mt-0.5">
              Cotizacion: {formatDate(card.quote_date)}
            </p>
          )}
        </div>
      )}
    </Draggable>
  )
}
