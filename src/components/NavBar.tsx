interface Props {
  view: 'main' | 'agenda'
  onViewChange: (view: 'main' | 'agenda') => void
  agendaCount: number
}

export function NavBar({ view, onViewChange, agendaCount }: Props) {
  return (
    <nav className="flex items-center justify-between bg-slate-900 px-6 py-2.5 shrink-0 shadow-lg">
      <h1 className="text-[24px] font-bold text-white tracking-tight">
        Guzman Motors
      </h1>

      <div className="flex gap-1 bg-slate-800 rounded-lg p-1">
        <button
          onClick={() => onViewChange('main')}
          className={`px-5 py-2 rounded-md font-semibold text-[15px] transition-all duration-150
            ${view === 'main'
              ? 'bg-white text-slate-900 shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}
        >
          Pizarron
        </button>
        <button
          onClick={() => onViewChange('agenda')}
          className={`px-5 py-2 rounded-md font-semibold text-[15px] transition-all duration-150 flex items-center gap-2
            ${view === 'agenda'
              ? 'bg-white text-slate-900 shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}
        >
          Agenda
          {agendaCount > 0 && (
            <span className="min-w-[22px] h-[22px] px-1.5 rounded-full text-[12px] font-bold bg-red-500 text-white flex items-center justify-center">
              {agendaCount}
            </span>
          )}
        </button>
      </div>
    </nav>
  )
}
