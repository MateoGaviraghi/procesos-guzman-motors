import { Draggable } from '@hello-pangea/dnd'
import type { Card as CardType, ColumnStatus } from '../lib/types'
import { formatDate, isExpired } from '../lib/dateUtils'

interface Props {
  card: CardType
  index: number
  onClick: () => void
}

const expirableColumns: ColumnStatus[] = ['contactar', 'cotizar']

export function Card({ card, index, onClick }: Props) {
  const expired = expirableColumns.includes(card.column_status) && isExpired(card.contact_date)

  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={onClick}
          className={`
            bg-white border border-black rounded px-4 py-3 mb-2 cursor-pointer
            hover:shadow-md transition-shadow
            ${expired ? 'border-red-500 border-2 bg-red-50' : ''}
            ${snapshot.isDragging ? 'shadow-lg' : ''}
          `}
        >
          <div className="flex items-start justify-between gap-2">
            <p className="text-[19px] font-bold text-black leading-tight truncate flex-1">
              {card.name}
            </p>
            {expired && (
              <span className="text-[13px] font-black text-red-600 bg-red-100 px-2 py-1 rounded whitespace-nowrap shrink-0">
                VENCIDA
              </span>
            )}
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-[17px] text-black">{card.phone}</span>
            {card.pdf_url && (
              <span className="text-[12px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-bold">PDF</span>
            )}
          </div>
          <div className="flex items-end justify-between mt-1">
            <span className="text-[17px] text-black truncate">{card.product}</span>
            <span className={`text-[16px] font-semibold shrink-0 ml-2 ${expired ? 'text-red-600' : 'text-black'}`}>
              {card.contact_date ? formatDate(card.contact_date) : ''}
            </span>
          </div>
          {card.quote_date && (
            <p className="text-[15px] text-emerald-700 font-bold text-right">
              Cotizacion: {formatDate(card.quote_date)}
            </p>
          )}
        </div>
      )}
    </Draggable>
  )
}
