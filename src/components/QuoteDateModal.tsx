import { useState } from 'react'

interface Props {
  cardName: string
  onConfirmDate: (date: string) => void
  onConfirmPdf: (file: File) => void
  onCancel: () => void
}

export function QuoteDateModal({ cardName, onConfirmDate, onConfirmPdf, onCancel }: Props) {
  const [mode, setMode] = useState<'choose' | 'date' | 'pdf'>('choose')
  const [date, setDate] = useState(new Date().toISOString().substring(0, 10))

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) onConfirmPdf(file)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onCancel}>
      <div className="bg-[#1a1a2e] text-white rounded-2xl shadow-2xl w-full max-w-md modal-enter overflow-hidden"
        onClick={e => e.stopPropagation()}>

        {/* Barra verde arriba */}
        <div className="h-[4px] bg-emerald-500" />

        {/* Header */}
        <div className="px-7 pt-5 pb-4">
          <h2 className="text-[20px] font-bold text-white mb-1">Pasar a Seguimiento</h2>
          <p className="text-[16px] text-white/50">
            <span className="font-semibold text-white/80">{cardName}</span> — Fecha de cotizacion requerida
          </p>
        </div>

        <div className="px-7 pb-6">
          {mode === 'choose' && (
            <div className="space-y-3">
              <button onClick={() => setMode('date')}
                className="w-full py-4 px-5 rounded-xl bg-white/10 border border-white/15 text-left
                           hover:bg-white/15 hover:border-emerald-400/40 transition-all duration-150 group">
                <span className="text-[17px] font-semibold text-white group-hover:text-emerald-300 transition-colors">
                  Anotar fecha de cotizacion
                </span>
                <span className="block text-[14px] text-white/40 mt-0.5">Escribir la fecha manualmente</span>
              </button>
              <button onClick={() => setMode('pdf')}
                className="w-full py-4 px-5 rounded-xl bg-white/10 border border-white/15 text-left
                           hover:bg-white/15 hover:border-orange-400/40 transition-all duration-150 group">
                <span className="text-[17px] font-semibold text-white group-hover:text-orange-300 transition-colors">
                  Cargar PDF de cotizacion
                </span>
                <span className="block text-[14px] text-white/40 mt-0.5">Subir archivo, la fecha se anota hoy</span>
              </button>
              <button onClick={onCancel}
                className="w-full py-3 text-[15px] text-white/40 font-medium hover:text-white/70 transition-colors mt-2">
                Cancelar
              </button>
            </div>
          )}

          {mode === 'date' && (
            <div className="space-y-4">
              <div>
                <label className="block text-[14px] font-semibold text-white/50 mb-2 uppercase tracking-wider">Fecha de cotizacion</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} autoFocus
                  className="w-full bg-white/10 border border-white/15 rounded-lg px-4 py-3 text-[18px]
                             text-white focus:border-emerald-400 focus:bg-white/15 focus:outline-none transition-all
                             [color-scheme:dark]" />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setMode('choose')}
                  className="flex-1 py-3 rounded-lg bg-white/10 text-white/70 font-semibold text-[16px]
                             hover:bg-white/15 hover:text-white transition-all">
                  Atras
                </button>
                <button onClick={() => date && onConfirmDate(date)} disabled={!date}
                  className="flex-1 py-3 rounded-lg bg-emerald-600 text-white font-semibold text-[16px]
                             hover:bg-emerald-500 transition-all active:scale-[0.98] shadow-md disabled:opacity-30">
                  Confirmar
                </button>
              </div>
            </div>
          )}

          {mode === 'pdf' && (
            <div className="space-y-4">
              <div>
                <label className="block text-[14px] font-semibold text-white/50 mb-2 uppercase tracking-wider">Seleccionar PDF</label>
                <input type="file" accept=".pdf" onChange={handleFileChange}
                  className="w-full bg-white/10 border border-white/15 rounded-lg px-4 py-3 text-[15px] text-white
                             file:mr-3 file:py-1.5 file:px-4 file:rounded-md file:border-0
                             file:bg-orange-500 file:text-white file:font-semibold file:cursor-pointer
                             hover:file:bg-orange-400 transition-all" />
                <p className="text-[13px] text-white/40 mt-2">La fecha se anota como hoy automaticamente.</p>
              </div>
              <button onClick={() => setMode('choose')}
                className="w-full py-3 rounded-lg bg-white/10 text-white/70 font-semibold text-[16px]
                           hover:bg-white/15 hover:text-white transition-all">
                Atras
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
