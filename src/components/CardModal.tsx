import { useState, useCallback } from 'react'
import type { Card, ColumnStatus, Responsible } from '../lib/types'
import { toInputDate, formatDate } from '../lib/dateUtils'
import { ClearBtn } from './ClearBtn'
import { ConfirmAlert } from './ConfirmAlert'

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

  // Confirmacion generica
  const [confirmMsg, setConfirmMsg] = useState('')
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null)

  const color = columnColor[card.column_status]

  const saveField = useCallback((updates: Partial<Card>) => {
    onSave(updates)
  }, [onSave])

  // Auto-save al salir del campo si cambio
  const handleBlur = (field: string, value: string, original: string) => {
    if (value.trim() !== original.trim() && value.trim()) {
      saveField({ [field]: value.trim() })
    }
  }

  // Responsable con confirmacion
  const handleResponsibleClick = (r: Responsible) => {
    if (responsible === r) {
      // Deseleccionar
      setConfirmMsg(`Quitar a ${r} como responsable?`)
      setConfirmAction(() => () => {
        setResponsible('')
        saveField({ responsible: '' })
      })
    } else if (responsible && responsible !== r) {
      // Cambiar de uno a otro
      setConfirmMsg(`Cambiar responsable de ${responsible} a ${r}?`)
      setConfirmAction(() => () => {
        setResponsible(r)
        saveField({ responsible: r })
      })
    } else {
      // Asignar nuevo (sin confirmacion)
      setResponsible(r)
      saveField({ responsible: r })
    }
  }

  // Nota con confirmacion al salir
  const handleNoteBlur = () => {
    if (note.trim() !== card.note.trim()) {
      setConfirmMsg('Guardar los cambios en la nota?')
      setConfirmAction(() => () => {
        saveField({ note: note.trim() })
      })
    }
  }

  // Fechas auto-save
  const handleDateChange = (field: 'contact_date' | 'quote_date', value: string) => {
    if (field === 'contact_date') setContactDate(value)
    else setQuoteDate(value)
    saveField({ [field]: value || null })
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/25" onClick={onClose} />

      <div
        className="relative w-full max-w-[45vw] h-full bg-[#1a1a2e] text-white
                   shadow-[-8px_0_30px_rgba(0,0,0,0.3)] overflow-y-auto flex flex-col
                   animate-[slideIn_0.2s_ease-out]"
        onClick={e => e.stopPropagation()}
      >
        <div className="h-[4px] shrink-0" style={{ backgroundColor: color }} />

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
          <button onClick={onClose}
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
                <button key={r} type="button" onClick={() => handleResponsibleClick(r)}
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
            <label className="block text-[14px] font-semibold text-white/50 mb-2 uppercase tracking-wider">Telefono</label>
            <div className="relative">
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                onBlur={() => handleBlur('phone', phone, card.phone)}
                className="w-full bg-white/10 border border-white/15 rounded-lg px-4 py-3 pr-10 text-[18px]
                           text-white placeholder:text-white/30 focus:border-blue-400 focus:bg-white/15
                           focus:outline-none transition-all"
                placeholder="Numero de telefono" />
              {phone && <ClearBtn onConfirm={() => { setPhone(''); saveField({ phone: '' }) }} dark />}
            </div>
          </div>

          {/* Producto */}
          <div>
            <label className="block text-[14px] font-semibold text-white/50 mb-2 uppercase tracking-wider">Producto</label>
            <div className="relative">
              <input type="text" value={product} onChange={e => setProduct(e.target.value)}
                onBlur={() => handleBlur('product', product, card.product)}
                className="w-full bg-white/10 border border-white/15 rounded-lg px-4 py-3 pr-10 text-[18px]
                           text-white placeholder:text-white/30 focus:border-blue-400 focus:bg-white/15
                           focus:outline-none transition-all"
                placeholder="Camion, remolque..." />
              {product && <ClearBtn onConfirm={() => { setProduct(''); saveField({ product: '' }) }} dark />}
            </div>
          </div>

          {/* Fechas */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[14px] font-semibold text-white/50 mb-2 uppercase tracking-wider">Fecha contacto</label>
              <div className="relative">
                <input type="date" value={contactDate}
                  onChange={e => handleDateChange('contact_date', e.target.value)}
                  className="w-full bg-white/10 border border-white/15 rounded-lg px-4 py-3 pr-10 text-[16px]
                             text-white focus:border-blue-400 focus:bg-white/15 focus:outline-none transition-all
                             [color-scheme:dark]" />
                {contactDate && <ClearBtn onConfirm={() => { setContactDate(''); saveField({ contact_date: null }) }} dark />}
              </div>
            </div>
            <div>
              <label className="block text-[14px] font-semibold text-emerald-400 mb-2 uppercase tracking-wider">Cotizacion</label>
              <div className="relative">
                <input type="date" value={quoteDate}
                  onChange={e => handleDateChange('quote_date', e.target.value)}
                  className="w-full bg-white/10 border border-white/15 rounded-lg px-4 py-3 pr-10 text-[16px]
                             text-white focus:border-emerald-400 focus:bg-white/15 focus:outline-none transition-all
                             [color-scheme:dark]" />
                {quoteDate && <ClearBtn onConfirm={() => { setQuoteDate(''); saveField({ quote_date: null }) }} dark />}
              </div>
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
            <label className="block text-[14px] font-semibold text-white/50 mb-2 uppercase tracking-wider">Nota</label>
            <div className="relative">
              <textarea value={note} onChange={e => setNote(e.target.value)}
                onBlur={handleNoteBlur}
                rows={3}
                className="w-full bg-white/10 border border-white/15 rounded-lg px-4 py-3 text-[17px]
                           text-white placeholder:text-white/30 focus:border-blue-400 focus:bg-white/15
                           focus:outline-none transition-all resize-none"
                placeholder="Agregar nota interna..." />
              {note && <ClearBtn onConfirm={() => { setNote(''); saveField({ note: '' }) }} dark />}
            </div>
          </div>
        </div>

        {/* Footer - solo Eliminar y Cerrar */}
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

      {/* Alert de confirmacion */}
      {confirmMsg && confirmAction && (
        <ConfirmAlert
          message={confirmMsg}
          dark
          onConfirm={() => { confirmAction(); setConfirmMsg(''); setConfirmAction(null) }}
          onCancel={() => { setConfirmMsg(''); setConfirmAction(null) }}
        />
      )}

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  )
}
