import { useState } from 'react'
import { Draggable } from '@hello-pangea/dnd'
import type { Card as CardType, ColumnStatus, Responsible } from '../lib/types'
import { formatDate, isExpired } from '../lib/dateUtils'

interface Props {
  card: CardType
  index: number
  accentColor: string
  onClick: () => void
  onQuickUpdate: (id: string, updates: Partial<CardType>) => void
}

const expirableColumns: ColumnStatus[] = ['contactar', 'cotizar']

export function Card({ card, index, accentColor, onClick, onQuickUpdate }: Props) {
  const expired = expirableColumns.includes(card.column_status) && isExpired(card.contact_date)
  const [editingDate, setEditingDate] = useState(false)
  const [editingQuoteDate, setEditingQuoteDate] = useState(false)

  const toggleResponsible = (e: React.MouseEvent) => {
    e.stopPropagation()
    const next: Responsible = card.responsible === 'Hector' ? 'Victor' : card.responsible === 'Victor' ? 'Hector' : 'Hector'
    onQuickUpdate(card.id, { responsible: next })
  }

  const handleDateClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingDate(true)
  }

  const handleDateBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const val = e.target.value
    if (val && val.length === 10 && val !== (card.contact_date?.substring(0, 10) || '')) {
      onQuickUpdate(card.id, { contact_date: val })
    }
    setEditingDate(false)
  }

  const handleDateKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      (e.target as HTMLInputElement).blur()
    } else if (e.key === 'Escape') {
      setEditingDate(false)
    }
  }

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
          {/* Row 1: Nombre + Vencida */}
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

          {/* Row 2: Telefono + badges */}
          <div className="flex items-center justify-between mt-1">
            <span className="text-[16px] text-slate-600">{card.phone}</span>
            <div className="flex items-center gap-1.5 shrink-0">
              {card.pdf_url && (
                <a href={card.pdf_url} target="_blank" rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                  className="text-[11px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-bold border border-orange-200
                             hover:bg-orange-200 transition-all">
                  Ver PDF
                </a>
              )}
              {/* Responsable clickeable */}
              <button onClick={toggleResponsible} title="Cambiar responsable"
                className={`text-[12px] px-2.5 py-0.5 rounded-full font-semibold transition-all
                  ${card.responsible
                    ? 'bg-slate-800 text-white hover:bg-slate-700'
                    : 'bg-slate-200 text-slate-500 hover:bg-slate-300'}`}>
                {card.responsible || '?'}
              </button>
            </div>
          </div>

          {/* Row 3: Producto + Fecha */}
          <div className="flex items-end justify-between mt-1">
            <span className="text-[16px] text-slate-600 truncate">{card.product}</span>
            {editingDate ? (
              <input
                type="date"
                defaultValue={card.contact_date?.substring(0, 10) || ''}
                onBlur={handleDateBlur}
                onKeyDown={handleDateKeyDown}
                onClick={e => e.stopPropagation()}
                autoFocus
                className="text-[14px] border border-slate-300 rounded px-2 py-1 w-[140px] shrink-0 ml-2
                           focus:border-blue-400 focus:outline-none"
              />
            ) : (
              <button onClick={handleDateClick} title="Cambiar fecha"
                className={`text-[15px] font-semibold shrink-0 ml-3 hover:underline transition-all
                  ${expired ? 'text-red-500' : card.contact_date ? 'text-slate-500' : 'text-slate-400 italic'}`}>
                {card.contact_date ? formatDate(card.contact_date) : 'Sin fecha'}
              </button>
            )}
          </div>

          {/* Row 4: Cotizacion - solo en seguimiento y remate */}
          {(card.column_status === 'seguimiento' || card.column_status === 'remate') && (
            <div className="flex justify-end mt-0.5">
              {editingQuoteDate ? (
                <input
                  type="date"
                  defaultValue={card.quote_date?.substring(0, 10) || ''}
                  onBlur={e => {
                    const val = e.target.value
                    if (val && val.length === 10 && val !== (card.quote_date?.substring(0, 10) || '')) {
                      onQuickUpdate(card.id, { quote_date: val })
                    }
                    setEditingQuoteDate(false)
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter') (e.target as HTMLInputElement).blur()
                    else if (e.key === 'Escape') setEditingQuoteDate(false)
                  }}
                  onClick={e => e.stopPropagation()}
                  autoFocus
                  className="text-[14px] border border-emerald-300 rounded px-2 py-1 w-[140px]
                             focus:border-emerald-400 focus:outline-none"
                />
              ) : (
                <button onClick={e => { e.stopPropagation(); setEditingQuoteDate(true) }} title="Cambiar fecha cotizacion"
                  className={`text-[14px] font-semibold hover:underline transition-all
                    ${card.quote_date ? 'text-emerald-600' : 'text-emerald-400/60 italic'}`}>
                  {card.quote_date ? `Cotizacion: ${formatDate(card.quote_date)}` : '+ Cotizacion'}
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </Draggable>
  )
}
