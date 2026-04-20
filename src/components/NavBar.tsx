interface Props {
  view: 'main' | 'agenda' | 'ventas' | 'bajas'
  onViewChange: (view: 'main' | 'agenda' | 'ventas' | 'bajas') => void
  agendaCount: number
  ventasCount: number
  bajasCount: number
}

export function NavBar({ view, onViewChange, agendaCount, ventasCount, bajasCount }: Props) {
  const tabs: { id: Props['view']; label: string; shortLabel: string; count?: number }[] = [
    { id: 'main', label: 'Pizarron', shortLabel: 'Pizarron' },
    { id: 'agenda', label: 'Agenda', shortLabel: 'Agenda', count: agendaCount || undefined },
    { id: 'ventas', label: 'Ventas', shortLabel: 'Ventas', count: ventasCount || undefined },
    { id: 'bajas', label: 'Dados de baja', shortLabel: 'Bajas', count: bajasCount || undefined },
  ]

  return (
    <nav className="flex items-center justify-between bg-slate-900 px-3 sm:px-6 py-2 sm:py-2.5 shrink-0 shadow-lg gap-2">
      <h1 className="text-[18px] sm:text-[24px] font-bold text-white tracking-tight whitespace-nowrap">
        Guzman Motors
      </h1>
      <div className="flex gap-0.5 sm:gap-1 bg-slate-800 rounded-lg p-0.5 sm:p-1 overflow-x-auto shrink">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => onViewChange(tab.id)}
            className={`px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-md font-semibold text-[12px] sm:text-[14px] transition-all duration-150 flex items-center gap-1 sm:gap-2 whitespace-nowrap
              ${view === tab.id
                ? 'bg-white text-slate-900 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}>
            <span className="hidden sm:inline">{tab.label}</span>
            <span className="sm:hidden">{tab.shortLabel}</span>
            {tab.count && tab.count > 0 && (
              <span className={`min-w-[18px] sm:min-w-[20px] h-[18px] sm:h-[20px] px-1 rounded-full text-[10px] sm:text-[11px] font-bold flex items-center justify-center
                ${view === tab.id ? 'bg-slate-200 text-slate-700' : 'bg-red-500 text-white'}`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>
    </nav>
  )
}
