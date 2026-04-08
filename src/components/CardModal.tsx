import { useState } from 'react'
import type { Card, ColumnStatus } from '../lib/types'
import { toInputDate, formatDate } from '../lib/dateUtils'

interface Props {
  card: Card
  onSave: (updates: Partial<Card>) => void
  onDelete: () => void
  onClose: () => void
}

const accentMap: Record<ColumnStatus, string> = {
  contactar: 'bg-blue-600',
  cotizar: 'bg-amber-500',
  seguimiento: 'bg-emerald-600',
  remate: 'bg-red-600',
}

export function CardModal({ card, onSave, onDelete, onClose }: Props) {
  const [name, setName] = useState(card.name)
  const [phone, setPhone] = useState(card.phone)
  const [product, setProduct] = useState(card.product)
  const [contactDate, setContactDate] = useState(toInputDate(card.contact_date))
  const [quoteDate, setQuoteDate] = useState(toInputDate(card.quote_date))
  const [note, setNote] = useState(card.note)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const handleSave = () => {
    onSave({
      name: name.trim() || card.name,
      phone: phone.trim(),
      product: product.trim(),
      contact_date: contactDate || null,
      quote_date: quoteDate || null,
      note: note.trim(),
    })
  }

  const inputClass = `w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-[19px] text-black
    focus:border-blue-500 focus:outline-none`

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[95vh] overflow-y-auto p-6"
        onClick={e => e.stopPropagation()}>

        <div className="flex items-center gap-2.5 mb-4">
          <span className={`w-3.5 h-3.5 rounded-full ${accentMap[card.column_status]}`} />
          <h2 className="text-xl font-black text-black">EDITAR TARJETA</h2>
          <span className="text-[13px] text-gray-500 font-bold uppercase">{card.column_status}</span>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-[16px] font-bold text-black mb-1">Nombre</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)}
              className={`${inputClass} border-black`} />
          </div>

          <div>
            <label className="block text-[16px] font-bold text-black mb-1">Telefono</label>
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
              className={inputClass} />
          </div>

          <div>
            <label className="block text-[16px] font-bold text-black mb-1">Producto</label>
            <input type="text" value={product} onChange={e => setProduct(e.target.value)}
              className={inputClass} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[16px] font-bold text-black mb-1">Fecha contacto</label>
              <input type="date" value={contactDate} onChange={e => setContactDate(e.target.value)}
                className={inputClass} />
            </div>
            <div>
              <label className="block text-[16px] font-bold text-emerald-700 mb-1">Fecha cotizacion</label>
              <input type="date" value={quoteDate} onChange={e => setQuoteDate(e.target.value)}
                className={inputClass} />
            </div>
          </div>

          {card.pdf_url && (
            <a href={card.pdf_url} target="_blank" rel="noopener noreferrer"
               className="inline-block text-[15px] text-red-600 font-bold underline">
              Ver PDF de cotizacion
            </a>
          )}

          <div>
            <label className="block text-[16px] font-bold text-black mb-1">
              Nota <span className="text-[13px] font-normal text-gray-400">(opcional)</span>
            </label>
            <textarea value={note} onChange={e => setNote(e.target.value)} rows={2}
              className={`${inputClass} resize-none`} placeholder="Nota interna..." />
          </div>

          {card.contact_date && (
            <p className="text-[12px] text-gray-400">Creada: {formatDate(card.contact_date)}</p>
          )}

          <div className="flex items-center gap-3 pt-2">
            {!confirmDelete ? (
              <button onClick={() => setConfirmDelete(true)}
                className="py-3.5 px-5 rounded-lg border-2 border-red-500 text-red-600 font-bold text-[16px] hover:bg-red-50">
                ELIMINAR
              </button>
            ) : (
              <button onClick={onDelete}
                className="py-3.5 px-5 rounded-lg bg-red-600 text-white font-bold text-[16px] animate-pulse">
                CONFIRMAR
              </button>
            )}
            <div className="flex-1" />
            <button onClick={onClose}
              className="py-3.5 px-5 rounded-lg border-2 border-black text-black font-bold text-[16px] hover:bg-gray-100">
              Cancelar
            </button>
            <button onClick={handleSave}
              className="py-3.5 px-5 rounded-lg bg-[#1e3a5f] text-white font-bold text-[16px] hover:bg-[#16304f]">
              GUARDAR
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
