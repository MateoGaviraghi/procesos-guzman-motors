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
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-black text-black mb-1">PASAR A SEGUIMIENTO</h2>
        <p className="text-[16px] text-black mb-5">
          <span className="font-bold">{cardName}</span> — Se necesita fecha de cotizacion.
        </p>

        {mode === 'choose' && (
          <div className="space-y-3">
            <button onClick={() => setMode('date')}
              className="w-full py-4 px-5 rounded-lg border-2 border-emerald-500 bg-emerald-50
                         text-left hover:bg-emerald-100 transition-colors">
              <span className="text-[16px] font-bold text-black">Anotar fecha de cotizacion</span>
              <span className="block text-[14px] text-gray-600 mt-0.5">Escribir la fecha manualmente</span>
            </button>
            <button onClick={() => setMode('pdf')}
              className="w-full py-4 px-5 rounded-lg border-2 border-red-400 bg-red-50
                         text-left hover:bg-red-100 transition-colors">
              <span className="text-[16px] font-bold text-black">Cargar PDF de cotizacion</span>
              <span className="block text-[14px] text-gray-600 mt-0.5">Subir archivo, la fecha se anota hoy</span>
            </button>
            <button onClick={onCancel}
              className="w-full py-3 rounded-lg border-2 border-gray-300 text-black font-bold text-[15px] hover:bg-gray-100 mt-1">
              Cancelar
            </button>
          </div>
        )}

        {mode === 'date' && (
          <div className="space-y-4">
            <div>
              <label className="block text-[14px] font-bold text-black mb-1">Fecha de cotizacion</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} autoFocus
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-[16px] text-black focus:border-emerald-500 focus:outline-none" />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setMode('choose')}
                className="flex-1 py-3 rounded-lg border-2 border-gray-300 text-black font-bold text-[15px] hover:bg-gray-100">
                Atras
              </button>
              <button onClick={() => date && onConfirmDate(date)} disabled={!date}
                className="flex-1 py-3 rounded-lg bg-emerald-600 text-white font-bold text-[15px]
                           hover:bg-emerald-700 disabled:opacity-30">
                CONFIRMAR
              </button>
            </div>
          </div>
        )}

        {mode === 'pdf' && (
          <div className="space-y-4">
            <input type="file" accept=".pdf" onChange={handleFileChange}
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-[15px]
                         file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0
                         file:bg-red-100 file:text-red-700 file:font-bold file:cursor-pointer
                         hover:file:bg-red-200" />
            <p className="text-[14px] text-gray-500">La fecha se anota como hoy automaticamente.</p>
            <button onClick={() => setMode('choose')}
              className="w-full py-3 rounded-lg border-2 border-gray-300 text-black font-bold text-[15px] hover:bg-gray-100">
              Atras
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
