import { useState } from 'react'

interface Props {
  onConfirm: () => void
  dark?: boolean
}

export function ClearBtn({ onConfirm, dark = false }: Props) {
  const [confirming, setConfirming] = useState(false)

  if (confirming) {
    return (
      <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1 z-10">
        <span className={`text-[13px] font-semibold mr-1 ${dark ? 'text-white/60' : 'text-slate-500'}`}>Borrar?</span>
        <button type="button" onClick={() => { onConfirm(); setConfirming(false) }}
          className="text-[13px] font-bold text-white bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-lg transition-all shadow-sm">
          Si
        </button>
        <button type="button" onClick={() => setConfirming(false)}
          className={`text-[13px] font-bold px-3 py-1.5 rounded-lg transition-all
            ${dark ? 'text-white/60 hover:text-white bg-white/10 hover:bg-white/20' : 'text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200'}`}>
          No
        </button>
      </div>
    )
  }

  return (
    <button type="button" onClick={() => setConfirming(true)}
      className={`absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center
                 rounded-lg transition-all
                 ${dark
                   ? 'text-red-400/60 hover:text-red-400 hover:bg-red-400/15 border border-red-400/20 hover:border-red-400/40'
                   : 'text-red-400 hover:text-red-500 hover:bg-red-50 border border-red-200 hover:border-red-300'}`}
      title="Borrar campo">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      </svg>
    </button>
  )
}
