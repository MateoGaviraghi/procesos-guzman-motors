import { Droppable } from '@hello-pangea/dnd'
import type { Card as CardType } from '../lib/types'
import { Card } from './Card'

interface Props {
  id: string
  title: string
  accent: string
  accentBorder: string
  headerBg: string
  hex: string
  cards: CardType[]
  onCardClick: (card: CardType) => void
  onAddClick: () => void
  onQuickUpdate: (id: string, updates: Partial<CardType>) => void
  onPdfDrop: (cardId: string, file: File) => void
  onMoveToColumn: (cardId: string, column: import('../lib/types').ColumnStatus) => void
}

export function Column({ id, title, accent, accentBorder, headerBg, hex, cards, onCardClick, onAddClick, onQuickUpdate, onPdfDrop, onMoveToColumn }: Props) {
  return (
    <div className={`flex flex-col min-w-0 flex-1 h-full border-r border-slate-300 last:border-r-0 border-t-[3px] ${accentBorder}`}>
      <div className={`flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 ${headerBg} border-b border-slate-300`}>
        <div className="flex items-center gap-2">
          <h2 className="text-[16px] sm:text-[20px] font-bold text-slate-800">{title}</h2>
          <span className={`text-[12px] sm:text-[13px] font-bold text-white ${accent} min-w-[22px] sm:min-w-[26px] h-[22px] sm:h-[26px] rounded-full flex items-center justify-center`}>
            {cards.length}
          </span>
        </div>
        <button onClick={onAddClick}
          className="bg-slate-800 hover:bg-slate-700 text-white px-3 sm:px-4 py-2 rounded-lg text-[13px] sm:text-[14px] font-semibold transition-all duration-150 active:scale-[0.97] shadow-sm hover:shadow-md">
          + Agregar
        </button>
      </div>
      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <div ref={provided.innerRef} {...provided.droppableProps}
            className={`flex-1 overflow-y-auto px-2 sm:px-2.5 py-2 sm:py-2.5 column-scroll transition-colors duration-200
              ${snapshot.isDraggingOver ? 'bg-blue-50/60' : 'bg-slate-100/80'}`}>
            {cards.map((card, index) => (
              <Card key={card.id} card={card} index={index} accentColor={hex}
                onClick={() => onCardClick(card)} onQuickUpdate={onQuickUpdate} onPdfDrop={onPdfDrop} onMoveToColumn={onMoveToColumn} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  )
}
