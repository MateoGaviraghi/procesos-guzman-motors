import { useState, useCallback, useRef } from 'react'
import type { Card, ColumnStatus, Responsible, PdfAttachment } from '../lib/types'
import { KANBAN_STATUSES } from '../lib/types'
import { toInputDate, formatDate } from '../lib/dateUtils'
import { ClearBtn } from './ClearBtn'
import { DatePickerField } from './DatePickerField'

interface Props {
  card: Card
  onSave: (updates: Partial<Card>) => void
  onDelete: () => void
  onClose: () => void
  onUploadPdf: (cardId: string, file: File) => Promise<PdfAttachment | null>
}

const columnLabel: Record<ColumnStatus, string> = {
  contactar: 'Contactar', cotizar: 'Cotizar', seguimiento: 'Seguimiento',
  remate: 'Remate', vendido: 'Vendido', baja: 'Dado de baja',
}
const columnColor: Record<ColumnStatus, string> = {
  contactar: '#3b82f6', cotizar: '#f59e0b', seguimiento: '#10b981',
  remate: '#f43f5e', vendido: '#10b981', baja: '#64748b',
}

export function CardModal({ card, onSave, onDelete, onClose, onUploadPdf }: Props) {
  const [name, setName] = useState(card.name)
  const [phone, setPhone] = useState(card.phone)
  const [products, setProducts] = useState<string[]>(card.product || [])
  const [responsible, setResponsible] = useState<Responsible>((card.responsible || '') as Responsible)
  const [contactDate, setContactDate] = useState(toInputDate(card.contact_date))
  const [quoteDate, setQuoteDate] = useState(toInputDate(card.quote_date))
  const [note, setNote] = useState(card.note)
  const [pdfs, setPdfs] = useState<PdfAttachment[]>(card.pdf_url || [])
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [showContactPicker, setShowContactPicker] = useState(false)
  const [showQuotePicker, setShowQuotePicker] = useState(false)
  const [isDraggingPdf, setIsDraggingPdf] = useState(false)
  const dragCounter = useRef(0)

  const color = columnColor[card.column_status]
  const isKanban = KANBAN_STATUSES.includes(card.column_status)

  const saveField = useCallback((updates: Partial<Card>) => { onSave(updates) }, [onSave])

  const handleBlur = (field: string, value: string, original: string) => {
    if (value.trim() !== original.trim()) saveField({ [field]: value.trim() })
  }

  const handleProductChange = (idx: number, val: string) => {
    const next = [...products]; next[idx] = val; setProducts(next)
  }
  const handleProductBlur = () => { saveField({ product: products.filter(p => p.trim()) }) }
  const addProduct = () => { setProducts([...products, '']) }
  const removeProduct = (idx: number) => {
    const next = products.filter((_, i) => i !== idx)
    setProducts(next); saveField({ product: next.filter(p => p.trim()) })
  }

  const handlePdfUpload = async (file: File) => {
    const att = await onUploadPdf(card.id, file)
    if (att) {
      const next = [...pdfs, att]; setPdfs(next); saveField({ pdf_url: next })
      if (!quoteDate) {
        const today = new Date().toISOString().substring(0, 10)
        setQuoteDate(today); saveField({ quote_date: today })
      }
    }
  }
  const removePdf = (idx: number) => {
    const next = pdfs.filter((_, i) => i !== idx); setPdfs(next); saveField({ pdf_url: next })
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault(); setIsDraggingPdf(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type === 'application/pdf') await handlePdfUpload(file)
  }

  const inputClass = `w-full bg-white/10 border border-white/15 rounded-lg px-4 py-3 pr-10 text-[18px]
    text-white placeholder:text-white/30 focus:border-blue-400 focus:bg-white/15 focus:outline-none transition-all`

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/25" onClick={onClose} />
      <div className="relative w-full max-w-full sm:max-w-[85vw] md:max-w-[60vw] lg:max-w-[45vw] h-full bg-[#1a1a2e] text-white
                      shadow-[-8px_0_30px_rgba(0,0,0,0.3)] overflow-y-auto flex flex-col animate-[slideIn_0.2s_ease-out]"
        onClick={e => e.stopPropagation()}
        onDragEnter={e => { if (e.dataTransfer.types.includes('Files')) { e.preventDefault(); dragCounter.current++; setIsDraggingPdf(true) } }}
        onDragOver={e => { if (e.dataTransfer.types.includes('Files')) e.preventDefault() }}
        onDragLeave={() => { dragCounter.current--; if (dragCounter.current <= 0) { dragCounter.current = 0; setIsDraggingPdf(false) } }}
        onDrop={e => { dragCounter.current = 0; handleDrop(e) }}>

        <div className="h-1 shrink-0" style={{ backgroundColor: color }} />

        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-7 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="text-[14px] font-semibold px-3 py-1 rounded-md"
              style={{ backgroundColor: color + '20', color }}>{columnLabel[card.column_status]}</span>
            {card.contact_date && <span className="text-[13px] text-white/40">Creada {formatDate(card.contact_date)}</span>}
          </div>
          <button onClick={onClose} title="Cerrar"
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-all">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Drop overlay */}
        {isDraggingPdf && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-blue-900/80 rounded-lg">
            <div className="text-center">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" className="mx-auto mb-3">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
              </svg>
              <p className="text-[20px] font-bold text-white">Soltar PDF aqui</p>
            </div>
          </div>
        )}

        {/* Nombre */}
        <div className="px-4 sm:px-7 pt-6 pb-2">
          <input type="text" value={name} onChange={e => setName(e.target.value)}
            onBlur={() => handleBlur('name', name, card.name)} placeholder="Nombre del cliente" aria-label="Nombre"
            className="w-full text-[26px] font-bold text-white bg-transparent border-0 border-b-2 border-transparent
                       focus:border-b-blue-400 focus:outline-none px-0 py-1 transition-all placeholder:text-white/30" />
        </div>

        <div className="px-4 sm:px-7 py-4 flex-1 space-y-4">

          {/* Responsable - 3 opciones */}
          <div>
            <label className="block text-[15px] font-bold text-white mb-2 uppercase tracking-wider">Responsable</label>
            <div className="flex gap-2">
              {([{ value: 'Hector' as Responsible, label: 'Hector' }, { value: 'Victor' as Responsible, label: 'Victor' }, { value: '' as Responsible, label: 'Sin asignar' }]).map(r => (
                <button key={r.label} type="button"
                  onClick={() => { setResponsible(r.value); saveField({ responsible: r.value }) }}
                  className={`px-5 py-3 rounded-lg text-[16px] font-semibold transition-all duration-150
                    ${responsible === r.value ? 'bg-blue-600 text-white shadow-md' : 'bg-white/10 text-white/70 hover:bg-white/15 hover:text-white'}`}>
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Telefono */}
          <div>
            <label htmlFor="edit-phone" className="block text-[15px] font-bold text-white mb-2 uppercase tracking-wider">Telefono</label>
            <div className="relative">
              <input id="edit-phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                onBlur={() => handleBlur('phone', phone, card.phone)} className={inputClass} placeholder="Numero de telefono" />
              {phone && <ClearBtn onConfirm={() => { setPhone(''); saveField({ phone: '' }) }} dark />}
            </div>
          </div>

          {/* Productos - multi */}
          <div>
            <label className="block text-[15px] font-bold text-white mb-2 uppercase tracking-wider">Productos</label>
            <div className="space-y-2">
              {products.map((p, i) => (
                <div key={i} className="flex gap-2">
                  <input type="text" value={p} onChange={e => handleProductChange(i, e.target.value)}
                    onBlur={handleProductBlur} placeholder={`Producto ${i + 1}`}
                    className="flex-1 bg-white/10 border border-white/15 rounded-lg px-4 py-2.5 text-[17px] text-white
                               placeholder:text-white/30 focus:border-blue-400 focus:bg-white/15 focus:outline-none transition-all" />
                  <button onClick={() => removeProduct(i)} title="Quitar producto"
                    className="w-10 h-10 flex items-center justify-center rounded-lg text-red-400/60 hover:text-red-400 hover:bg-red-400/15 transition-all">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                  </button>
                </div>
              ))}
              <button onClick={addProduct}
                className="text-[15px] text-blue-400 font-semibold hover:text-blue-300 transition-all px-2 py-1">
                + Agregar producto
              </button>
            </div>
          </div>

          {/* Fechas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[15px] font-bold text-white mb-2 uppercase tracking-wider">Fecha contacto</label>
              <div className="relative">
                <button type="button" onClick={() => setShowContactPicker(true)}
                  className="w-full bg-white/10 border border-white/15 rounded-lg px-4 py-3 text-[16px] text-left transition-all hover:bg-white/15">
                  <span className={contactDate ? 'text-white' : 'text-white/30'}>{contactDate ? formatDate(contactDate) : 'dd/mm/aaaa'}</span>
                </button>
                {contactDate && <ClearBtn onConfirm={() => { setContactDate(''); saveField({ contact_date: null }) }} dark />}
                {showContactPicker && (
                  <DatePickerField value={contactDate || null}
                    onChange={d => { setContactDate(d || ''); saveField({ contact_date: d }); setShowContactPicker(false) }}
                    onClose={() => setShowContactPicker(false)} />
                )}
              </div>
            </div>
            <div>
              <label className="block text-[14px] font-semibold text-emerald-400 mb-2 uppercase tracking-wider">Fecha de cotizacion</label>
              <div className="relative">
                <button type="button" onClick={() => setShowQuotePicker(true)}
                  className="w-full bg-white/10 border border-white/15 rounded-lg px-4 py-3 text-[16px] text-left transition-all hover:bg-white/15">
                  <span className={quoteDate ? 'text-white' : 'text-white/30'}>{quoteDate ? formatDate(quoteDate) : 'dd/mm/aaaa'}</span>
                </button>
                {quoteDate && <ClearBtn onConfirm={() => { setQuoteDate(''); saveField({ quote_date: null }) }} dark />}
                {showQuotePicker && (
                  <DatePickerField value={quoteDate || null}
                    onChange={d => { setQuoteDate(d || ''); saveField({ quote_date: d }); setShowQuotePicker(false) }}
                    onClose={() => setShowQuotePicker(false)} />
                )}
              </div>
            </div>
          </div>

          {/* PDFs */}
          {pdfs.length > 0 && (
            <div>
              <label className="block text-[15px] font-bold text-white mb-2 uppercase tracking-wider">Archivos PDF</label>
              <div className="space-y-1.5">
                {pdfs.map((pdf, i) => (
                  <div key={i} className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-orange-400 shrink-0">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
                    </svg>
                    <a href={pdf.url} target="_blank" rel="noopener noreferrer"
                      className="text-[15px] text-orange-400 font-medium hover:text-orange-300 truncate flex-1">{pdf.name}</a>
                    <button onClick={() => removePdf(i)}
                      className="text-red-400/60 hover:text-red-400 transition-all shrink-0">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload PDF button */}
          <div>
            <label className="relative cursor-pointer inline-flex items-center gap-2 text-[15px] text-white/60 font-semibold
                              hover:text-white/80 bg-white/5 hover:bg-white/10 px-4 py-2.5 rounded-lg transition-all">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
              Subir PDF
              <input type="file" accept=".pdf" className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={e => { const f = e.target.files?.[0]; if (f) handlePdfUpload(f); e.target.value = '' }} />
            </label>
            <span className="text-[13px] text-white/30 ml-3">o arrastra un PDF al panel</span>
          </div>

          {/* Nota */}
          <div>
            <label htmlFor="edit-note" className="block text-[15px] font-bold text-white mb-2 uppercase tracking-wider">Nota</label>
            <div className="relative">
              <textarea id="edit-note" value={note} onChange={e => setNote(e.target.value)}
                onBlur={() => { if (note.trim() !== card.note.trim()) saveField({ note: note.trim() }) }}
                rows={3} className="w-full bg-white/10 border border-white/15 rounded-lg px-4 py-3 text-[17px]
                  text-white placeholder:text-white/30 focus:border-blue-400 focus:bg-white/15 focus:outline-none transition-all resize-none"
                placeholder="Agregar nota interna..." />
              {note && <ClearBtn onConfirm={() => { setNote(''); saveField({ note: '' }) }} dark />}
            </div>
          </div>

          {/* Vendido / Dar de baja - solo si esta en kanban */}
          {isKanban && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button onClick={() => saveField({ column_status: 'vendido' })}
                className="py-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[18px] transition-all active:scale-[0.98] shadow-md">
                Vendido
              </button>
              <button onClick={() => saveField({ column_status: 'baja' })}
                className="py-4 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-[18px] transition-all active:scale-[0.98] shadow-md">
                Dar de baja
              </button>
            </div>
          )}

          {/* Devolver al pizarron - si esta en vendido/baja */}
          {!isKanban && (
            <button onClick={() => saveField({ column_status: 'contactar' })}
              className="w-full py-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[18px] transition-all active:scale-[0.98] shadow-md">
              Devolver al pizarron
            </button>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-[#1a1a2e] border-t border-white/10 px-4 sm:px-7 py-4 shrink-0">
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
              className="py-3 px-6 rounded-lg bg-white/10 text-white/70 font-semibold text-[16px] hover:bg-white/15 hover:text-white transition-all">
              Cerrar
            </button>
          </div>
        </div>
      </div>

      <style>{`@keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }`}</style>
    </div>
  )
}
