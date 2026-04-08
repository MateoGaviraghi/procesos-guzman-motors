import { useState } from 'react'

interface Props {
  onConfirm: () => void
  dark?: boolean
}

export function ClearBtn({ onConfirm, dark = false }: Props) {
  const [confirming, setConfirming] = useState(false)

  return (
    <>
      <button type="button" onClick={() => setConfirming(true)}
        className={`absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center
                   rounded-lg transition-all
                   ${dark
                     ? 'text-red-400/60 hover:text-red-400 hover:bg-red-400/15'
                     : 'text-red-400 hover:text-red-500 hover:bg-red-50'}`}
        title="Borrar campo">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </svg>
      </button>

      {confirming && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[60]"
          onClick={() => setConfirming(false)}>
          <div className={`rounded-xl shadow-2xl px-6 py-5 w-[300px] ${dark ? 'bg-[#242445] text-white' : 'bg-white text-slate-900'}`}
            onClick={e => e.stopPropagation()}>
            <p className="text-[18px] font-bold mb-1">Borrar campo</p>
            <p className={`text-[15px] mb-5 ${dark ? 'text-white/60' : 'text-slate-500'}`}>
              Estas seguro de borrar este dato?
            </p>
            <div className="flex gap-2">
              <button type="button" onClick={() => setConfirming(false)}
                className={`flex-1 py-2.5 rounded-lg font-semibold text-[15px] transition-all
                  ${dark ? 'bg-white/10 text-white/70 hover:bg-white/20' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                Cancelar
              </button>
              <button type="button" onClick={() => { onConfirm(); setConfirming(false) }}
                className="flex-1 py-2.5 rounded-lg bg-red-500 text-white font-semibold text-[15px]
                           hover:bg-red-600 transition-all shadow-sm">
                Borrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
