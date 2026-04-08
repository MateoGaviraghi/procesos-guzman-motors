import { useState, useCallback } from 'react'
import type { Card, ColumnStatus, Responsible } from '../lib/types'
import { toInputDate, formatDate } from '../lib/dateUtils'
import { ClearBtn } from './ClearBtn'
import { DatePickerField } from './DatePickerField'

interface Props {
  card: Card
  onSave: (updates: Partial<Card>) => void
  onDelete: () => void
  onClose: () => void
}

const columnLabel: Record<ColumnStatus, string> = {
  contactar: 'Contactar',
  cotizar: 'Cotizar',
  seguimiento: 'Seguimiento',
  remate: 'Remate',
}

const columnColor: Record<ColumnStatus, string> = {
  contactar: '#3b82f6',
  cotizar: '#f59e0b',
  seguimiento: '#10b981',
  remate: '#f43f5e',
}

export function CardModal({ card, onSave, onDelete, onClose }: Props) {
  const [name, setName] = useState(card.name)
  const [phone, setPhone] = useState(card.phone)
  const [product, setProduct] = useState(card.product)
  const [responsible, setResponsible] = useState<Responsible>((card.responsible || '') as Responsible)
  const [contactDate, setContactDate] = useState(toInputDate(card.contact_date))
  const [quoteDate, setQuoteDate] = useState(toInputDate(card.quote_date))
  const [note, setNote] = useState(card.note)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [showContactPicker, setShowContactPicker] = useState(false)
  const [showQuotePicker, setShowQuotePicker] = useState(false)
  const color = columnColor[card.column_status]

  const saveField = useCallback((updates: Partial<Card>) => {
    onSave(updates)
  }, [onSave])

  const handleBlur = (field: string, value: string, original: string) => {
    if (value.trim() !== original.trim() && value.trim()) {
      saveField({ [field]: value.trim() })
    }
  }

  const handleResponsibleClick = (r: Responsible) => {
    if (responsible === r) {
      setResponsible('')
      saveField({ responsible: '' })
    } else {
      setResponsible(r)
      saveField({ responsible: r })
    }
  }

  const handleNoteBlur = () => {
    if (note.trim() !== card.note.trim()) {
      saveField({ note: note.trim() })
    }
  }

  const handleDateChange = (field: 'contact_date' | 'quote_date', value: string) => {
    if (field === 'contact_date') setContactDate(value)
    else setQuoteDate(value)
    saveField({ [field]: value || null })
  }

  const inputClass = `w-full bg-white/10 border border-white/15 rounded-lg px-4 py-3 pr-10 text-[18px]
    text-white placeholder:text-white/30 focus:border-blue-400 focus:bg-white/15
    focus:outline-none transition-all`

  const dateInputClass = `w-full bg-white/10 border border-white/15 rounded-lg px-4 py-3 pr-10 text-[16px]
    text-white focus:border-blue-400 focus:bg-white/15 focus:outline-none transition-all scheme-dark`

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/25" onClick={onClose} />

      <div
        className="relative w-full max-w-[45vw] h-full bg-[#1a1a2e] text-white
                   shadow-[-8px_0_30px_rgba(0,0,0,0.3)] overflow-y-auto flex flex-col
                   animate-[slideIn_0.2s_ease-out]"
        onClick={e => e.stopPropagation()}
      >
        <div className="h-1 shrink-0" style={{ backgroundColor: color }} />

        {/* Header */}
        <div className="flex items-center justify-between px-7 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="text-[14px] font-semibold px-3 py-1 rounded-md"
              style={{ backgroundColor: color + '20', color: color }}>
              {columnLabel[card.column_status]}
            </span>
            {card.contact_date && (
              <span className="text-[13px] text-white/40">Creada {formatDate(card.contact_date)}</span>
            )}
          </div>
          <button onClick={onClose} title="Cerrar"
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-all">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Nombre */}
        <div className="px-7 pt-6 pb-2">
          <input type="text" value={name} onChange={e => setName(e.target.value)}
            onBlur={() => handleBlur('name', name, card.name)}
            placeholder="Nombre del cliente"
            aria-label="Nombre del cliente"
            className="w-full text-[26px] font-bold text-white bg-transparent border-0 border-b-2 border-transparent
                       focus:border-b-blue-400 focus:outline-none px-0 py-1 transition-all placeholder:text-white/30" />
        </div>

        {/* Campos */}
        <div className="px-7 py-4 flex-1 space-y-4">

          {/* Responsable */}
          <div>
            <label className="block text-[14px] font-semibold text-white/50 mb-2 uppercase tracking-wider">Responsable</label>
            <div className="flex gap-2">
              {(['Hector', 'Victor'] as Responsible[]).map(r => (
                <button key={r} type="button" title={`Asignar a ${r}`}
                  onClick={() => handleResponsibleClick(r)}
                  className={`px-6 py-3 rounded-lg text-[16px] font-semibold transition-all duration-150
                    ${responsible === r
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-white/10 text-white/70 hover:bg-white/15 hover:text-white'}`}>
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Telefono */}
          <div>
            <label htmlFor="edit-phone" className="block text-[14px] font-semibold text-white/50 mb-2 uppercase tracking-wider">Telefono</label>
            <div className="relative">
              <input id="edit-phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                onBlur={() => handleBlur('phone', phone, card.phone)}
                className={inputClass} placeholder="Numero de telefono" />
              {phone && <ClearBtn onConfirm={() => { setPhone(''); saveField({ phone: '' }) }} dark />}
            </div>
          </div>

          {/* Producto */}
          <div>
            <label htmlFor="edit-product" className="block text-[14px] font-semibold text-white/50 mb-2 uppercase tracking-wider">Producto</label>
            <div className="relative">
              <input id="edit-product" type="text" value={product} onChange={e => setProduct(e.target.value)}
                onBlur={() => handleBlur('product', product, card.product)}
                className={inputClass} placeholder="Camion, remolque..." />
              {product && <ClearBtn onConfirm={() => { setProduct(''); saveField({ product: '' }) }} dark />}
            </div>
          </div>

          {/* Fechas */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[14px] font-semibold text-white/50 mb-2 uppercase tracking-wider">Fecha contacto</label>
              <button type="button" onClick={() => setShowContactPicker(true)}
                className={`w-full bg-white/10 border border-white/15 rounded-lg px-4 py-3 text-[16px] text-left
                           hover:bg-white/15 transition-all
                           ${contactDate ? 'text-white' : 'text-white/30'}`}>
                {contactDate ? formatDate(contactDate) : 'Seleccionar'}
              </button>
              {showContactPicker && (
                <DatePickerField
                  value={contactDate || null}
                  onChange={date => { setContactDate(date || ''); saveField({ contact_date: date }); setShowContactPicker(false) }}
                  onClose={() => setShowContactPicker(false)}
                />
              )}
            </div>
            <div>
              <label className="block text-[14px] font-semibold text-emerald-400 mb-2 uppercase tracking-wider">Cotizacion</label>
              <button type="button" onClick={() => setShowQuotePicker(true)}
                className={`w-full bg-white/10 border border-white/15 rounded-lg px-4 py-3 text-[16px] text-left
                           hover:bg-white/15 transition-all
                           ${quoteDate ? 'text-white' : 'text-white/30'}`}>
                {quoteDate ? formatDate(quoteDate) : 'Seleccionar'}
              </button>
              {showQuotePicker && (
                <DatePickerField
                  value={quoteDate || null}
                  onChange={date => { setQuoteDate(date || ''); saveField({ quote_date: date }); setShowQuotePicker(false) }}
                  onClose={() => setShowQuotePicker(false)}
                />
              )}
            </div>
          </div>

          {/* PDF */}
          {card.pdf_url && (
            <div>
              <label className="block text-[14px] font-semibold text-white/50 mb-2 uppercase tracking-wider">Adjunto</label>
              <a href={card.pdf_url} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[15px] text-orange-400 font-semibold
                           bg-orange-400/10 px-4 py-2.5 rounded-lg border border-orange-400/20
                           hover:bg-orange-400/20 transition-all">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
                Ver PDF cotizacion
              </a>
            </div>
          )}

          {/* Nota */}
          <div>
            <label htmlFor="edit-note" className="block text-[14px] font-semibold text-white/50 mb-2 uppercase tracking-wider">Nota</label>
            <div className="relative">
              <textarea id="edit-note" value={note} onChange={e => setNote(e.target.value)}
                onBlur={handleNoteBlur} rows={3}
                className="w-full bg-white/10 border border-white/15 rounded-lg px-4 py-3 text-[17px]
                           text-white placeholder:text-white/30 focus:border-blue-400 focus:bg-white/15
                           focus:outline-none transition-all resize-none"
                placeholder="Agregar nota interna..." />
              {note && <ClearBtn onConfirm={() => { setNote(''); saveField({ note: '' }) }} dark />}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-[#1a1a2e] border-t border-white/10 px-7 py-4 shrink-0">
          <div className="flex items-center gap-3">
            {!confirmDelete ? (
              <button onClick={() => setConfirmDelete(true)}
                className="text-red-400 font-semibold text-[15px] hover:text-red-300 hover:bg-red-400/10 px-4 py-2.5 rounded-lg transition-all">
                Eliminar tarjeta
              </button>
            ) : (
              <button onClick={onDelete}
                className="bg-red-600 text-white font-semibold text-[15px] px-4 py-2.5 rounded-lg shadow-md animate-pulse">
                Confirmar eliminar
              </button>
            )}
            <div className="flex-1" />
            <button onClick={onClose}
              className="py-3 px-6 rounded-lg bg-white/10 text-white/70 font-semibold text-[16px]
                         hover:bg-white/15 hover:text-white transition-all">
              Cerrar
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  )
}
