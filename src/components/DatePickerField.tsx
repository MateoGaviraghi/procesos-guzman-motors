import { useState } from 'react'
import { createPortal } from 'react-dom'
import { format, parseISO, getDaysInMonth, addMonths, subMonths } from 'date-fns'

interface Props {
  value: string | null
  onChange: (date: string | null) => void
  onClose: () => void
}

const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]

const WEEKDAYS = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do']

export function DatePickerField({ value, onChange, onClose }: Props) {
  const today = new Date()
  const parsed = value ? parseISO(value) : today
  const [viewYear, setViewYear] = useState(parsed.getFullYear())
  const [viewMonth, setViewMonth] = useState(parsed.getMonth())
  const [inputText, setInputText] = useState(value ? format(parsed, 'dd/MM/yyyy') : '')

  const daysInMonth = getDaysInMonth(new Date(viewYear, viewMonth))
  const firstDay = new Date(viewYear, viewMonth, 1).getDay()
  const startOffset = firstDay === 0 ? 6 : firstDay - 1

  const handleDayClick = (day: number) => {
    const m = String(viewMonth + 1).padStart(2, '0')
    const d = String(day).padStart(2, '0')
    onChange(`${viewYear}-${m}-${d}`)
  }

  const handleInputConfirm = () => {
    const parts = inputText.split('/')
    if (parts.length === 3) {
      const d = parseInt(parts[0], 10)
      const m = parseInt(parts[1], 10)
      const y = parseInt(parts[2], 10)
      if (d >= 1 && d <= 31 && m >= 1 && m <= 12 && y >= 2020 && y <= 2099) {
        onChange(`${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`)
      }
    }
  }

  const prevMonth = () => {
    const d = subMonths(new Date(viewYear, viewMonth, 1), 1)
    setViewYear(d.getFullYear())
    setViewMonth(d.getMonth())
  }

  const nextMonth = () => {
    const d = addMonths(new Date(viewYear, viewMonth, 1), 1)
    setViewYear(d.getFullYear())
    setViewMonth(d.getMonth())
  }

  const selectedDay = value ? parseISO(value) : null
  const isSelected = (day: number) =>
    selectedDay?.getFullYear() === viewYear && selectedDay?.getMonth() === viewMonth && selectedDay?.getDate() === day
  const isToday = (day: number) =>
    today.getFullYear() === viewYear && today.getMonth() === viewMonth && today.getDate() === day

  return createPortal(
    <>
      {/* Overlay que cubre TODO */}
      <div className="fixed inset-0" style={{ zIndex: 9998 }}
        onClick={e => { e.preventDefault(); e.stopPropagation(); onClose() }} />

      {/* Calendario centrado */}
      <div onClick={e => e.stopPropagation()}
        style={{ zIndex: 9999, position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
        className="bg-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.3)] border border-slate-200 w-[calc(100vw-32px)] max-w-[340px] overflow-hidden">

        {/* Input manual */}
        <div className="flex items-center gap-2 px-4 pt-4 pb-2">
          <input
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleInputConfirm() }}
            placeholder="dd/mm/aaaa"
            autoFocus
            className="flex-1 border-2 border-slate-300 rounded-lg px-3 py-2.5 text-[18px] text-slate-900
                       focus:border-blue-400 focus:outline-none placeholder:text-slate-400"
          />
          <button onClick={handleInputConfirm} title="Confirmar fecha"
            className="w-11 h-11 flex items-center justify-center rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-all text-[20px] font-bold shrink-0">
            ✓
          </button>
        </div>

        {/* Nav mes/año */}
        <div className="flex items-center justify-between px-4 py-2">
          <button onClick={prevMonth}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600 text-[22px] font-bold">
            ‹
          </button>
          <span className="text-[18px] font-bold text-slate-800">
            {MONTHS[viewMonth]} {viewYear}
          </span>
          <button onClick={nextMonth}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600 text-[22px] font-bold">
            ›
          </button>
        </div>

        {/* Dias de la semana */}
        <div className="grid grid-cols-7 px-4">
          {WEEKDAYS.map(d => (
            <div key={d} className="text-center text-[15px] font-semibold text-slate-400 py-1">{d}</div>
          ))}
        </div>

        {/* Dias */}
        <div className="grid grid-cols-7 px-4 pb-3">
          {Array.from({ length: startOffset }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1
            return (
              <button key={day} onClick={() => handleDayClick(day)}
                className={`w-10 h-10 mx-auto flex items-center justify-center rounded-lg text-[17px] font-medium transition-all
                  ${isSelected(day)
                    ? 'bg-blue-500 text-white font-bold'
                    : isToday(day)
                      ? 'bg-blue-100 text-blue-700 font-bold'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}>
                {day}
              </button>
            )
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 bg-slate-50">
          <button onClick={() => onChange(null)}
            className="text-[16px] text-red-500 font-semibold hover:text-red-600 px-3 py-2 rounded-lg hover:bg-red-50 transition-all">
            Borrar
          </button>
          <button onClick={() => {
            const t = new Date()
            onChange(`${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,'0')}-${String(t.getDate()).padStart(2,'0')}`)
          }}
            className="text-[16px] text-blue-600 font-semibold hover:text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-50 transition-all">
            Hoy
          </button>
          <button onClick={onClose}
            className="text-[16px] text-slate-500 font-semibold hover:text-slate-700 px-3 py-2 rounded-lg hover:bg-slate-100 transition-all">
            Cancelar
          </button>
        </div>
      </div>
    </>,
    document.body
  )
}
