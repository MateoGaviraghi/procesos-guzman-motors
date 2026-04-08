import { Droppable } from '@hello-pangea/dnd'
import type { Card as CardType } from '../lib/types'
import { Card } from './Card'

interface Props {
  id: string
  title: string
  cards: CardType[]
  onCardClick: (card: CardType) => void
  onAddClick: () => void
}

export function Column({ id, title, cards, onCardClick, onAddClick }: Props) {
  return (
    <div className="flex flex-col min-w-0 flex-1 h-full border-r-2 border-black last:border-r-0">
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b-2 border-black">
        <h2 className="text-[28px] font-black text-black">
          {title}
        </h2>
        <button
          onClick={onAddClick}
          className="bg-[#1e3a5f] hover:bg-[#16304f] text-white px-5 py-3 rounded-lg
                     text-[15px] font-bold transition-colors whitespace-nowrap"
        >
          agregar tarjeta
        </button>
      </div>

      {/* Area de tarjetas: fondo blanco */}
      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`
              flex-1 overflow-y-auto px-3 py-2 column-scroll transition-colors duration-200
              ${snapshot.isDraggingOver ? 'bg-blue-50 ring-2 ring-inset ring-blue-300' : 'bg-white'}
            `}
          >
            {cards.map((card, index) => (
              <Card
                key={card.id}
                card={card}
                index={index}
                onClick={() => onCardClick(card)}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  )
}
