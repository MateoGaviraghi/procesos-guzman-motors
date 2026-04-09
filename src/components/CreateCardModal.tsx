import { useState } from 'react'
import type { ColumnStatus, Responsible } from '../lib/types'
import { ClearBtn } from './ClearBtn'
import { DatePickerField } from './DatePickerField'
import { formatDate } from '../lib/dateUtils'

interface Props {
  column: ColumnStatus
  onSave: (data: { name: string; phone: string; product: string[]; responsible: Responsible; contact_date: string | null; note: string }) => void
  onClose: () => void
}

const columnColor: Record<string, string> = {
  contactar: '#3b82f6', cotizar: '#f59e0b', seguimiento: '#10b981', remate: '#f43f5e',
}

export function CreateCardModal({ column, onSave, onClose }: Props) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [products, setProducts] = useState<string[]>([''])
  const [responsible, setResponsible] = useState<Responsible>('')
  const [contactDate, setContactDate] = useState('')
  const [note, setNote] = useState('')
  const [showDatePicker, setShowDatePicker] = useState(false)

  const color = columnColor[column] || '#3b82f6'

  const handleSubmit = () => {
    if (!name.trim()) return
    onSave({
      name: name.trim(),
      phone: phone.trim(),
      product: products.filter(p => p.trim()),
      responsible,
      contact_date: contactDate || null,
      note: note.trim(),
    })
  }

  const handleProductChange = (idx: number, val: string) => {
    const next = [...products]; next[idx] = val; setProducts(next)
  }

  const inputClass = `w-full bg-white/10 border border-white/15 rounded-lg px-4 py-3 pr-10 text-[18px]
    text-white placeholder:text-white/30 focus:border-blue-400 focus:bg-white/15 focus:outline-none transition-all`

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/25" onClick={onClose} />
      <div className="relative w-full max-w-[45vw] h-full bg-[#1a1a2e] text-white
                      shadow-[-8px_0_30px_rgba(0,0,0,0.3)] overflow-y-auto flex flex-col animate-[slideIn_0.2s_ease-out]"
        onClick={e => e.stopPropagation()}>

        <div className="h-1 shrink-0" style={{ backgroundColor: color }} />

        {/* Header */}
        <div className="flex items-center justify-between px-7 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="text-[14px] font-semibold px-3 py-1 rounded-md"
              style={{ backgroundColor: color + '20', color }}>Nueva tarjeta</span>
            <span className="text-[14px] text-white/40 capitalize">{column}</span>
          </div>
          <button onClick={onClose} title="Cerrar"
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-all">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Nombre */}
        <div className="px-7 pt-6 pb-2">
          <input type="text" value={name} onChange={e => setName(e.target.value)}
            placeholder="Nombre del cliente" autoFocus
            className="w-full text-[26px] font-bold text-white bg-transparent border-0 border-b-2 border-white/20
                       focus:border-b-blue-400 focus:outline-none px-0 py-1 transition-all placeholder:text-white/30" />
        </div>

        <div className="px-7 py-4 flex-1 space-y-4">

          {/* Responsable */}
          <div>
            <label className="block text-[15px] font-bold text-white mb-2 uppercase tracking-wider">Responsable</label>
            <div className="flex gap-2">
              {([{ value: 'Hector' as Responsible, label: 'Hector' }, { value: 'Victor' as Responsible, label: 'Victor' }, { value: '' as Responsible, label: 'Sin asignar' }]).map(r => (
                <button key={r.label} type="button" onClick={() => setResponsible(r.value)}
                  className={`px-5 py-3 rounded-lg text-[16px] font-semibold transition-all duration-150
                    ${responsible === r.value ? 'bg-blue-600 text-white shadow-md' : 'bg-white/10 text-white/70 hover:bg-white/15 hover:text-white'}`}>
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Telefono */}
          <div>
            <label className="block text-[15px] font-bold text-white mb-2 uppercase tracking-wider">Telefono</label>
            <div className="relative">
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                className={inputClass} placeholder="Numero de telefono" />
              {phone && <ClearBtn onConfirm={() => setPhone('')} dark />}
            </div>
          </div>

          {/* Productos */}
          <div>
            <label className="block text-[15px] font-bold text-white mb-2 uppercase tracking-wider">Productos</label>
            <div className="space-y-2">
              {products.map((p, i) => (
                <div key={i} className="flex gap-2">
                  <input type="text" value={p} onChange={e => handleProductChange(i, e.target.value)}
                    placeholder={`Producto ${i + 1}`}
                    className="flex-1 bg-white/10 border border-white/15 rounded-lg px-4 py-2.5 text-[17px] text-white
                               placeholder:text-white/30 focus:border-blue-400 focus:bg-white/15 focus:outline-none transition-all" />
                  {products.length > 1 && (
                    <button onClick={() => setProducts(products.filter((_, j) => j !== i))} title="Quitar"
                      className="w-10 h-10 flex items-center justify-center rounded-lg text-red-400/60 hover:text-red-400 hover:bg-red-400/15 transition-all">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                    </button>
                  )}
                </div>
              ))}
              <button onClick={() => setProducts([...products, ''])}
                className="text-[15px] text-blue-400 font-semibold hover:text-blue-300 transition-all px-2 py-1">
                + Agregar producto
              </button>
            </div>
          </div>

          {/* Fecha contacto */}
          <div>
            <label className="block text-[15px] font-bold text-white mb-2 uppercase tracking-wider">
              Fecha contacto <span className="normal-case tracking-normal text-white/30">(opcional)</span>
            </label>
            <div className="relative">
              <button type="button" onClick={() => setShowDatePicker(true)}
                className="w-full bg-white/10 border border-white/15 rounded-lg px-4 py-3 text-[16px] text-left transition-all hover:bg-white/15">
                <span className={contactDate ? 'text-white' : 'text-white/30'}>{contactDate ? formatDate(contactDate) : 'dd/mm/aaaa'}</span>
              </button>
              {contactDate && <ClearBtn onConfirm={() => setContactDate('')} dark />}
              {showDatePicker && (
                <DatePickerField value={contactDate || null}
                  onChange={d => { setContactDate(d || ''); setShowDatePicker(false) }}
                  onClose={() => setShowDatePicker(false)} />
              )}
            </div>
          </div>

          {/* Nota */}
          <div>
            <label className="block text-[15px] font-bold text-white mb-2 uppercase tracking-wider">
              Nota <span className="normal-case tracking-normal text-white/30">(opcional)</span>
            </label>
            <textarea value={note} onChange={e => setNote(e.target.value)} rows={2}
              className="w-full bg-white/10 border border-white/15 rounded-lg px-4 py-3 text-[17px]
                text-white placeholder:text-white/30 focus:border-blue-400 focus:bg-white/15 focus:outline-none transition-all resize-none"
              placeholder="Nota interna..." />
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-[#1a1a2e] border-t border-white/10 px-7 py-4 shrink-0">
          <div className="flex gap-3">
            <button onClick={onClose}
              className="flex-1 py-3.5 rounded-lg bg-white/10 text-white/70 font-semibold text-[17px] hover:bg-white/15 hover:text-white transition-all">
              Cancelar
            </button>
            <button onClick={handleSubmit} disabled={!name.trim()}
              className="flex-1 py-3.5 rounded-lg bg-blue-600 text-white font-semibold text-[17px] hover:bg-blue-500 transition-all active:scale-[0.98] shadow-md disabled:opacity-30">
              Crear tarjeta
            </button>
          </div>
        </div>
      </div>

      <style>{`@keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }`}</style>
    </div>
  )
}
