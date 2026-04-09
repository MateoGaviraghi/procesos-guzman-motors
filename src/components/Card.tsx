import { useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Draggable } from '@hello-pangea/dnd'
import type { Card as CardType, ColumnStatus, Responsible, PdfAttachment } from '../lib/types'
import { formatDate, isExpired } from '../lib/dateUtils'
import { DatePickerField } from './DatePickerField'

interface Props {
  card: CardType
  index: number
  accentColor: string
  onClick: () => void
  onQuickUpdate: (id: string, updates: Partial<CardType>) => void
  onPdfDrop: (cardId: string, file: File) => void
}

const expirableColumns: ColumnStatus[] = ['contactar', 'cotizar']

export function Card({ card, index, accentColor, onClick, onQuickUpdate, onPdfDrop }: Props) {
  const expired = expirableColumns.includes(card.column_status) && isExpired(card.contact_date)
  const [editingDate, setEditingDate] = useState(false)
  const [editingQuoteDate, setEditingQuoteDate] = useState(false)
  const [showResponsibleMenu, setShowResponsibleMenu] = useState(false)
  const [showPdfMenu, setShowPdfMenu] = useState(false)
  const [isDroppingPdf, setIsDroppingPdf] = useState(false)
  const dragCount = useRef(0)

  const products = card.product || []
  const pdfs = card.pdf_url || []
  const firstProduct = products[0] || ''
  const extraProducts = products.length > 1 ? ` (+${products.length - 1})` : ''

  const handleDragEnter = (e: React.DragEvent) => {
    if (e.dataTransfer.types.includes('Files')) { e.preventDefault(); e.stopPropagation(); dragCount.current++; setIsDroppingPdf(true) }
  }
  const handleDragOver = (e: React.DragEvent) => {
    if (e.dataTransfer.types.includes('Files')) { e.preventDefault(); e.stopPropagation() }
  }
  const handleDragLeave = () => { dragCount.current--; if (dragCount.current <= 0) { dragCount.current = 0; setIsDroppingPdf(false) } }
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation(); dragCount.current = 0; setIsDroppingPdf(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type === 'application/pdf') onPdfDrop(card.id, file)
  }

  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={onClick}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{ ...provided.draggableProps.style, borderLeftColor: expired ? undefined : accentColor }}
          className={`
            relative rounded-lg px-4 py-3 mb-2 cursor-pointer transition-all duration-150
            border-l-[4px] shadow-[0_1px_3px_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.08)]
            hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:translate-y-[-1px]
            ${expired ? 'bg-red-50 border-l-red-500 border border-red-200'
              : isDroppingPdf ? 'bg-blue-50 border border-blue-400 ring-2 ring-blue-300'
              : 'bg-white border border-slate-300'}
            ${snapshot.isDragging ? 'shadow-[0_8px_25px_rgba(0,0,0,0.2)] rotate-[1.5deg] scale-[1.02]' : ''}
          `}
        >
          {isDroppingPdf && (
            <div className="absolute inset-0 flex items-center justify-center bg-blue-100/80 rounded-lg z-10">
              <span className="text-[14px] font-bold text-blue-600">Soltar PDF aqui</span>
            </div>
          )}

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
              {pdfs.length === 1 && (
                <a href={pdfs[0].url} target="_blank" rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                  className="text-[11px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-bold border border-orange-200 hover:bg-orange-200 transition-all">
                  PDF
                </a>
              )}
              {pdfs.length > 1 && (
                <div className="relative">
                  <button onClick={e => { e.stopPropagation(); setShowPdfMenu(!showPdfMenu) }}
                    className="text-[11px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-bold border border-orange-200 hover:bg-orange-200 transition-all">
                    {pdfs.length} PDFs
                  </button>
                  {showPdfMenu && createPortal(
                    <>
                      <div className="fixed inset-0" style={{ zIndex: 9998 }} onClick={e => { e.stopPropagation(); setShowPdfMenu(false) }} />
                      <div style={{ zIndex: 9999, position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
                        className="bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.25)] border border-slate-200 py-2 w-[280px]"
                        onClick={e => e.stopPropagation()}>
                        <p className="px-4 py-1.5 text-[13px] font-semibold text-slate-400 uppercase tracking-wider">Archivos PDF</p>
                        {pdfs.map((pdf, i) => (
                          <a key={i} href={pdf.url} target="_blank" rel="noopener noreferrer"
                            onClick={e => { e.stopPropagation(); setShowPdfMenu(false) }}
                            className="flex items-center gap-2 px-4 py-2.5 text-[16px] text-slate-700 hover:bg-slate-50 transition-all">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-orange-500 shrink-0">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
                            </svg>
                            <span className="truncate">{pdf.name}</span>
                          </a>
                        ))}
                      </div>
                    </>,
                    document.body
                  )}
                </div>
              )}
              {/* Responsable dropdown */}
              <div className="relative">
                <button onClick={e => { e.stopPropagation(); setShowResponsibleMenu(!showResponsibleMenu) }}
                  title="Cambiar responsable"
                  className={`text-[12px] px-2.5 py-0.5 rounded-full font-semibold transition-all
                    ${card.responsible ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-slate-200 text-slate-500 hover:bg-slate-300'}`}>
                  {card.responsible || 'Sin asignar'}
                </button>
                {showResponsibleMenu && createPortal(
                  <>
                    <div className="fixed inset-0" style={{ zIndex: 9998 }} onClick={e => { e.stopPropagation(); setShowResponsibleMenu(false) }} />
                    <div style={{ zIndex: 9999, position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
                      className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.25)] border border-slate-200 w-[280px] overflow-hidden"
                      onClick={e => e.stopPropagation()}>
                      <p className="px-5 pt-4 pb-2 text-[15px] font-bold text-slate-800">Elegir responsable</p>
                      <div className="px-3 pb-3 space-y-1.5">
                        {([{ value: 'Hector' as Responsible, label: 'Hector', color: 'bg-blue-600' },
                           { value: 'Victor' as Responsible, label: 'Victor', color: 'bg-amber-500' },
                           { value: '' as Responsible, label: 'Sin asignar', color: 'bg-slate-400' }]).map(r => (
                          <button key={r.label} onClick={e => {
                            e.stopPropagation()
                            onQuickUpdate(card.id, { responsible: r.value })
                            setShowResponsibleMenu(false)
                          }}
                            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-[18px] font-semibold transition-all
                              ${card.responsible === r.value
                                ? `${r.color} text-white shadow-md`
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                            {r.label}
                            {card.responsible === r.value && <span className="ml-auto text-[20px]">✓</span>}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>,
                  document.body
                )}
              </div>
            </div>
          </div>

          {/* Row 3: Producto + Fecha contacto */}
          <div className="flex items-end justify-between mt-1 relative">
            <span className="text-[16px] text-slate-600 truncate">
              {firstProduct}{extraProducts}
            </span>
            <button onClick={e => { e.stopPropagation(); setEditingDate(true) }} title="Cambiar fecha"
              className={`text-[15px] font-semibold shrink-0 ml-3 hover:underline transition-all
                ${expired ? 'text-red-500' : card.contact_date ? 'text-slate-500' : 'text-slate-400 italic'}`}>
              {card.contact_date ? formatDate(card.contact_date) : 'Sin fecha'}
            </button>
            {editingDate && (
              <DatePickerField
                value={card.contact_date}
                onChange={date => { onQuickUpdate(card.id, { contact_date: date }); setEditingDate(false) }}
                onClose={() => setEditingDate(false)}
              />
            )}
          </div>

          {/* Row 4: Cotizacion - solo en seguimiento y remate */}
          {(card.column_status === 'seguimiento' || card.column_status === 'remate') && (
            <div className="flex justify-end mt-0.5 relative">
              <button onClick={e => { e.stopPropagation(); setEditingQuoteDate(true) }} title="Cambiar fecha cotizacion"
                className={`text-[14px] font-semibold hover:underline transition-all
                  ${card.quote_date ? 'text-emerald-600' : 'text-emerald-400/60 italic'}`}>
                {card.quote_date ? `Cotizacion: ${formatDate(card.quote_date)}` : '+ Cotizacion'}
              </button>
              {editingQuoteDate && (
                <DatePickerField
                  value={card.quote_date}
                  onChange={date => { onQuickUpdate(card.id, { quote_date: date }); setEditingQuoteDate(false) }}
                  onClose={() => setEditingQuoteDate(false)}
                />
              )}
            </div>
          )}
        </div>
      )}
    </Draggable>
  )
}
