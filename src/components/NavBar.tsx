interface Props {
  view: 'main' | 'agenda'
  onViewChange: (view: 'main' | 'agenda') => void
  agendaCount: number
}

export function NavBar({ view, onViewChange, agendaCount }: Props) {
  return (
    <nav className="flex items-center justify-between bg-[#1e3a5f] px-6 py-3 shrink-0">
      <h1 className="text-2xl font-black text-white tracking-wide">
        GUZMAN MOTORS
      </h1>
      <div className="flex gap-2">
        <button
          onClick={() => onViewChange('main')}
          className={`px-6 py-2.5 rounded-lg font-bold text-[15px] transition-colors border-2
            ${view === 'main'
              ? 'bg-white text-[#1e3a5f] border-white'
              : 'bg-transparent text-white border-white/40 hover:border-white'}`}
        >
          PIZARRON
        </button>
        <button
          onClick={() => onViewChange('agenda')}
          className={`px-6 py-2.5 rounded-lg font-bold text-[15px] transition-colors border-2 flex items-center gap-2
            ${view === 'agenda'
              ? 'bg-white text-[#1e3a5f] border-white'
              : 'bg-transparent text-white border-white/40 hover:border-white'}`}
        >
          AGENDA
          {agendaCount > 0 && (
            <span className="min-w-[24px] h-6 px-1.5 rounded-full text-[12px] font-black bg-red-500 text-white flex items-center justify-center">
              {agendaCount}
            </span>
          )}
        </button>
      </div>
    </nav>
  )
}
