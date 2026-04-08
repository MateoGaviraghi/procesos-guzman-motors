import { useState } from 'react'
import type { ColumnStatus } from '../lib/types'

interface Props {
  column: ColumnStatus
  onSave: (data: { name: string; phone: string; product: string; contact_date: string | null; note: string }) => void
  onClose: () => void
}

export function CreateCardModal({ column, onSave, onClose }: Props) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [product, setProduct] = useState('')
  const [contactDate, setContactDate] = useState('')
  const [note, setNote] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    onSave({
      name: name.trim(),
      phone: phone.trim(),
      product: product.trim(),
      contact_date: contactDate || null,
      note: note.trim(),
    })
  }

  const inputClass = `w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-[19px] text-black
    focus:border-blue-500 focus:outline-none placeholder:text-gray-400`

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-black text-black mb-4 uppercase">
          Nueva tarjeta — {column}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-[16px] font-bold text-black mb-1">Nombre</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)}
              className={`${inputClass} border-black`}
              placeholder="Nombre del cliente" autoFocus />
          </div>

          <div>
            <label className="block text-[16px] font-bold text-black mb-1">Telefono</label>
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
              className={inputClass} placeholder="Numero de telefono" />
          </div>

          <div>
            <label className="block text-[16px] font-bold text-black mb-1">Producto</label>
            <input type="text" value={product} onChange={e => setProduct(e.target.value)}
              className={inputClass} placeholder="Camion, remolque, etc." />
          </div>

          <div>
            <label className="block text-[16px] font-bold text-black mb-1">
              Fecha de contacto <span className="text-[13px] font-normal text-gray-400">(opcional)</span>
            </label>
            <input type="date" value={contactDate} onChange={e => setContactDate(e.target.value)}
              className={inputClass} />
          </div>

          <div>
            <label className="block text-[16px] font-bold text-black mb-1">
              Nota <span className="text-[13px] font-normal text-gray-400">(opcional)</span>
            </label>
            <textarea value={note} onChange={e => setNote(e.target.value)} rows={2}
              className={`${inputClass} resize-none`} placeholder="Nota interna..." />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-3.5 rounded-lg border-2 border-black text-black font-bold text-[17px] hover:bg-gray-100">
              Cancelar
            </button>
            <button type="submit" disabled={!name.trim()}
              className="flex-1 py-3.5 rounded-lg bg-[#1e3a5f] text-white font-bold text-[17px]
                         hover:bg-[#16304f] disabled:opacity-30">
              GUARDAR
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
