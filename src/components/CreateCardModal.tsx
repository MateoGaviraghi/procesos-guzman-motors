import { useState } from 'react'
import type { ColumnStatus, Responsible } from '../lib/types'
import { ClearBtn } from './ClearBtn'
import { DatePickerField } from './DatePickerField'
import { formatDate } from '../lib/dateUtils'

interface Props {
  column: ColumnStatus
  onSave: (data: { name: string; phone: string; product: string; responsible: Responsible; contact_date: string | null; note: string }) => void
  onClose: () => void
}

const columnColor: Record<ColumnStatus, string> = {
  contactar: '#3b82f6',
  cotizar: '#f59e0b',
  seguimiento: '#10b981',
  remate: '#f43f5e',
}


export function CreateCardModal({ column, onSave, onClose }: Props) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [product, setProduct] = useState('')
  const [responsible, setResponsible] = useState<Responsible>('')
  const [contactDate, setContactDate] = useState<string | null>(null)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [note, setNote] = useState('')

  const color = columnColor[column]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    onSave({
      name: name.trim(),
      phone: phone.trim(),
      product: product.trim(),
      responsible,
      contact_date: contactDate,
      note: note.trim(),
    })
  }

  const inputClass = `w-full bg-white/10 border border-white/15 rounded-lg px-4 py-3.5 pr-10 text-[18px]
    text-white placeholder:text-white/30 focus:border-blue-400 focus:bg-white/15
    focus:outline-none transition-all`

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-[#1a1a2e] text-white rounded-2xl shadow-2xl w-full max-w-xl modal-enter overflow-hidden"
        onClick={e => e.stopPropagation()}>

        {/* Barra de color arriba */}
        <div className="h-[4px]" style={{ backgroundColor: color }} />

        {/* Header */}
        <div className="px-7 pt-5 pb-3">
          <h2 className="text-[22px] font-bold text-white">
            Nueva tarjeta <span className="text-white/40 font-normal">— {column}</span>
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-7 pb-6">
          {/* Nombre grande */}
          <div className="mb-5">
            <label className="block text-[14px] font-semibold text-white/50 mb-2 uppercase tracking-wider">Nombre</label>
            <div className="relative">
              <input type="text" value={name} onChange={e => setName(e.target.value)}
                className="w-full bg-white/10 border-2 border-white/20 rounded-lg px-4 py-4 pr-10 text-[20px]
                           text-white placeholder:text-white/30 focus:border-blue-400 focus:bg-white/15
                           focus:outline-none transition-all"
                placeholder="Nombre del cliente" autoFocus />
              {name && <ClearBtn dark onConfirm={() => setName('')} />}
            </div>
          </div>

          {/* Telefono + Producto */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-[14px] font-semibold text-white/50 mb-2 uppercase tracking-wider">Telefono</label>
              <div className="relative">
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                  className={inputClass} placeholder="Numero" />
                {phone && <ClearBtn dark onConfirm={() => setPhone('')} />}
              </div>
            </div>
            <div>
              <label className="block text-[14px] font-semibold text-white/50 mb-2 uppercase tracking-wider">Producto</label>
              <div className="relative">
                <input type="text" value={product} onChange={e => setProduct(e.target.value)}
                  className={inputClass} placeholder="Camion, remolque..." />
                {product && <ClearBtn dark onConfirm={() => setProduct('')} />}
              </div>
            </div>
          </div>

          {/* Responsable + Fecha */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-[14px] font-semibold text-white/50 mb-2 uppercase tracking-wider">Responsable</label>
              <div className="flex gap-2">
                {(['Hector', 'Victor'] as Responsible[]).map(r => (
                  <button key={r} type="button" onClick={() => setResponsible(responsible === r ? '' : r)}
                    className={`flex-1 py-3.5 rounded-lg text-[16px] font-semibold transition-all duration-150
                      ${responsible === r
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-white/10 text-white/70 hover:bg-white/15 hover:text-white border border-white/15'}`}>
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-[14px] font-semibold text-white/50 mb-2 uppercase tracking-wider">
                Fecha contacto
              </label>
              <button type="button" onClick={() => setShowDatePicker(true)}
                className={`w-full bg-white/10 border border-white/15 rounded-lg px-4 py-3.5 text-[18px] text-left
                           hover:bg-white/15 transition-all
                           ${contactDate ? 'text-white' : 'text-white/30'}`}>
                {contactDate ? formatDate(contactDate) : 'Seleccionar fecha'}
              </button>
              {showDatePicker && (
                <DatePickerField
                  value={contactDate}
                  onChange={date => { setContactDate(date); setShowDatePicker(false) }}
                  onClose={() => setShowDatePicker(false)}
                />
              )}
            </div>
          </div>

          {/* Nota */}
          <div className="mb-5">
            <label className="block text-[14px] font-semibold text-white/50 mb-2 uppercase tracking-wider">
              Nota <span className="normal-case tracking-normal text-white/30">(opcional)</span>
            </label>
            <div className="relative">
              <textarea value={note} onChange={e => setNote(e.target.value)} rows={2}
                className={`${inputClass} resize-none`} placeholder="Nota interna..." />
              {note && <ClearBtn dark onConfirm={() => setNote('')} />}
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-3">
            <button type="button" onClick={onClose}
              className="flex-1 py-3.5 rounded-lg bg-white/10 text-white/70 font-semibold text-[17px]
                         hover:bg-white/15 hover:text-white transition-all">
              Cancelar
            </button>
            <button type="submit" disabled={!name.trim()}
              className="flex-1 py-3.5 rounded-lg bg-blue-600 text-white font-semibold text-[17px]
                         hover:bg-blue-500 transition-all active:scale-[0.98] shadow-md disabled:opacity-30">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
