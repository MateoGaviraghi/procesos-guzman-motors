import { useState, useRef, useEffect } from 'react'
import { format, parseISO, getDaysInMonth, addMonths, subMonths } from 'date-fns'
import { es } from 'date-fns/locale'

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
  const ref = useRef<HTMLDivElement>(null)

  // Cerrar al clickear fuera
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose])

  const daysInMonth = getDaysInMonth(new Date(viewYear, viewMonth))
  const firstDay = new Date(viewYear, viewMonth, 1).getDay()
  const startOffset = firstDay === 0 ? 6 : firstDay - 1 // Lunes = 0

  const handleDayClick = (day: number) => {
    const m = String(viewMonth + 1).padStart(2, '0')
    const d = String(day).padStart(2, '0')
    const dateStr = `${viewYear}-${m}-${d}`
    onChange(dateStr)
    onClose()
  }

  const handleInputConfirm = () => {
    // Parsear dd/mm/yyyy
    const parts = inputText.split('/')
    if (parts.length === 3) {
      const d = parseInt(parts[0], 10)
      const m = parseInt(parts[1], 10)
      const y = parseInt(parts[2], 10)
      if (d >= 1 && d <= 31 && m >= 1 && m <= 12 && y >= 2020 && y <= 2099) {
        const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`
        onChange(dateStr)
        onClose()
        return
      }
    }
  }

  const handleClear = () => {
    onChange(null)
    onClose()
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

  const handleToday = () => {
    const t = new Date()
    const m = String(t.getMonth() + 1).padStart(2, '0')
    const d = String(t.getDate()).padStart(2, '0')
    onChange(`${t.getFullYear()}-${m}-${d}`)
    onClose()
  }

  const selectedDay = value ? parseISO(value) : null
  const isSelected = (day: number) => {
    if (!selectedDay) return false
    return selectedDay.getFullYear() === viewYear && selectedDay.getMonth() === viewMonth && selectedDay.getDate() === day
  }
  const isToday = (day: number) => {
    return today.getFullYear() === viewYear && today.getMonth() === viewMonth && today.getDate() === day
  }

  return (
    <div ref={ref} onClick={e => e.stopPropagation()}
      className="absolute z-50 top-full mt-1 right-0 bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.2)] border border-slate-200 w-[320px] overflow-hidden">

      {/* Input manual */}
      <div className="flex items-center gap-2 px-3 pt-3 pb-2">
        <input
          type="text"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleInputConfirm() }}
          placeholder="dd/mm/aaaa"
          className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-[16px] text-slate-900
                     focus:border-blue-400 focus:outline-none placeholder:text-slate-400"
        />
        <button onClick={handleInputConfirm} title="Confirmar fecha"
          className="w-9 h-9 flex items-center justify-center rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-all text-[16px] font-bold shrink-0">
          ✓
        </button>
      </div>

      {/* Nav mes/año */}
      <div className="flex items-center justify-between px-3 py-2">
        <button onClick={prevMonth}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600 text-[18px] font-bold">
          ‹
        </button>
        <span className="text-[16px] font-bold text-slate-800">
          {MONTHS[viewMonth]} {viewYear}
        </span>
        <button onClick={nextMonth}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600 text-[18px] font-bold">
          ›
        </button>
      </div>

      {/* Dias de la semana */}
      <div className="grid grid-cols-7 px-3">
        {WEEKDAYS.map(d => (
          <div key={d} className="text-center text-[13px] font-semibold text-slate-400 py-1">{d}</div>
        ))}
      </div>

      {/* Dias */}
      <div className="grid grid-cols-7 px-3 pb-2">
        {Array.from({ length: startOffset }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1
          return (
            <button key={day} onClick={() => handleDayClick(day)}
              className={`w-9 h-9 mx-auto flex items-center justify-center rounded-lg text-[15px] font-medium transition-all
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
      <div className="flex items-center justify-between px-3 py-2 border-t border-slate-100 bg-slate-50">
        <button onClick={handleClear}
          className="text-[14px] text-red-500 font-semibold hover:text-red-600 transition-all px-2 py-1 rounded hover:bg-red-50">
          Borrar fecha
        </button>
        <button onClick={handleToday}
          className="text-[14px] text-blue-600 font-semibold hover:text-blue-700 transition-all px-2 py-1 rounded hover:bg-blue-50">
          Hoy
        </button>
        <button onClick={onClose}
          className="text-[14px] text-slate-500 font-semibold hover:text-slate-700 transition-all px-2 py-1 rounded hover:bg-slate-100">
          Cancelar
        </button>
      </div>
    </div>
  )
}
