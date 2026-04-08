import { DragDropContext, type DropResult } from '@hello-pangea/dnd'
import type { Card as CardType, ColumnStatus } from '../lib/types'
import { COLUMNS } from '../lib/types'
import { isWithinOneMonth, sortByDate, sortByDateWithExpired } from '../lib/dateUtils'
import { Column } from './Column'

interface Props {
  cards: CardType[]
  onCardClick: (card: CardType) => void
  onAddClick: (column: ColumnStatus) => void
  onMoveCard: (cardId: string, newColumn: ColumnStatus, newIndex: number) => void
  onDragToSeguimiento: (cardId: string, newIndex: number) => void
}

export function Board({ cards, onCardClick, onAddClick, onMoveCard, onDragToSeguimiento }: Props) {
  const mainCards = cards.filter(c => isWithinOneMonth(c.contact_date))

  const getColumnCards = (columnId: ColumnStatus) => {
    const sorter = (columnId === 'contactar' || columnId === 'cotizar')
      ? sortByDateWithExpired : sortByDate
    return mainCards
      .filter(c => c.column_status === columnId)
      .sort((a, b) => sorter(a.contact_date, b.contact_date))
  }

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return
    const { draggableId, source, destination } = result
    const fromColumn = source.droppableId as ColumnStatus
    const toColumn = destination.droppableId as ColumnStatus
    if (fromColumn === toColumn && source.index === destination.index) return
    if (fromColumn === 'cotizar' && toColumn === 'seguimiento') {
      onDragToSeguimiento(draggableId, destination.index)
      return
    }
    onMoveCard(draggableId, toColumn, destination.index)
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex h-full">
        {COLUMNS.map(col => (
          <Column
            key={col.id}
            id={col.id}
            title={col.title}
            accent={col.accent}
            accentBorder={col.accentBorder}
            headerBg={col.headerBg}
            hex={col.hex}
            cards={getColumnCards(col.id)}
            onCardClick={onCardClick}
            onAddClick={() => onAddClick(col.id)}
          />
        ))}
      </div>
    </DragDropContext>
  )
}
