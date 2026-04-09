interface Props {
  view: 'main' | 'agenda' | 'ventas' | 'bajas'
  onViewChange: (view: 'main' | 'agenda' | 'ventas' | 'bajas') => void
  agendaCount: number
  ventasCount: number
  bajasCount: number
}

export function NavBar({ view, onViewChange, agendaCount, ventasCount, bajasCount }: Props) {
  const tabs: { id: Props['view']; label: string; count?: number }[] = [
    { id: 'main', label: 'Pizarron' },
    { id: 'agenda', label: 'Agenda', count: agendaCount || undefined },
    { id: 'ventas', label: 'Ventas', count: ventasCount || undefined },
    { id: 'bajas', label: 'Dados de baja', count: bajasCount || undefined },
  ]

  return (
    <nav className="flex items-center justify-between bg-slate-900 px-6 py-2.5 shrink-0 shadow-lg">
      <h1 className="text-[24px] font-bold text-white tracking-tight">
        Guzman Motors
      </h1>
      <div className="flex gap-1 bg-slate-800 rounded-lg p-1">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => onViewChange(tab.id)}
            className={`px-4 py-2 rounded-md font-semibold text-[14px] transition-all duration-150 flex items-center gap-2
              ${view === tab.id
                ? 'bg-white text-slate-900 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}>
            {tab.label}
            {tab.count && tab.count > 0 && (
              <span className={`min-w-[20px] h-[20px] px-1 rounded-full text-[11px] font-bold flex items-center justify-center
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
