interface Props {
  onConfirm: () => void
  dark?: boolean
}

export function ClearBtn({ onConfirm, dark = false }: Props) {
  return (
    <button type="button" onClick={(e) => { e.stopPropagation(); onConfirm() }}
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
  )
}
