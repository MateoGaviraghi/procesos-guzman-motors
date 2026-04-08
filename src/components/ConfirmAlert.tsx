interface Props {
  message: string
  onConfirm: () => void
  onCancel: () => void
  dark?: boolean
}

export function ConfirmAlert({ message, onConfirm, onCancel, dark = false }: Props) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[60]"
      onClick={onCancel}>
      <div className={`rounded-xl shadow-2xl px-6 py-5 w-[340px] ${dark ? 'bg-[#242445] text-white' : 'bg-white text-slate-900'}`}
        onClick={e => e.stopPropagation()}>
        <p className="text-[18px] font-bold mb-1">Confirmar cambio</p>
        <p className={`text-[16px] mb-5 ${dark ? 'text-white/60' : 'text-slate-500'}`}>
          {message}
        </p>
        <div className="flex gap-2">
          <button type="button" onClick={onCancel}
            className={`flex-1 py-2.5 rounded-lg font-semibold text-[15px] transition-all
              ${dark ? 'bg-white/10 text-white/70 hover:bg-white/20' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
            Cancelar
          </button>
          <button type="button" onClick={onConfirm}
            className="flex-1 py-2.5 rounded-lg bg-blue-600 text-white font-semibold text-[15px]
                       hover:bg-blue-500 transition-all shadow-sm">
            Confirmar
          </button>
        </div>
      </div>
    </div>
  )
}
