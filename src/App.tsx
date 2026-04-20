import { useState, useCallback } from 'react'
import type { Card, ColumnStatus, Responsible, PdfAttachment } from './lib/types'
import { isMoreThanOneMonth } from './lib/dateUtils'
import { useCards } from './hooks/useCards'
import { NavBar } from './components/NavBar'
import { Board } from './components/Board'
import { AgendaBoard } from './components/AgendaBoard'
import { VentasBoard } from './components/VentasBoard'
import { BajasBoard } from './components/BajasBoard'
import { CreateCardModal } from './components/CreateCardModal'
import { CardModal } from './components/CardModal'
import { QuoteDateModal } from './components/QuoteDateModal'

export default function App() {
  const { cards, loading, addCard, updateCard, deleteCard, moveCard, uploadPdf } = useCards()

  const [view, setView] = useState<'main' | 'agenda' | 'ventas' | 'bajas'>('main')
  const [createColumn, setCreateColumn] = useState<ColumnStatus | null>(null)
  const [editCard, setEditCard] = useState<Card | null>(null)
  const [quotePending, setQuotePending] = useState<{ cardId: string; newIndex: number } | null>(null)

  const agendaCount = cards.filter(c => c.contact_date && isMoreThanOneMonth(c.contact_date) && c.column_status !== 'vendido' && c.column_status !== 'baja').length
  const ventasCount = cards.filter(c => c.column_status === 'vendido').length
  const bajasCount = cards.filter(c => c.column_status === 'baja').length

  const handleAddClick = useCallback((column: ColumnStatus) => { setCreateColumn(column) }, [])

  const handleCreateSave = useCallback(async (data: {
    name: string; phone: string; product: string[]; responsible: Responsible; contact_date: string | null; note: string
  }) => {
    if (!createColumn) return
    const targetColumn = data.contact_date && isMoreThanOneMonth(data.contact_date) ? 'contactar' : createColumn
    await addCard({ ...data, column_status: targetColumn, quote_date: null, pdf_url: [] })
    setCreateColumn(null)
  }, [createColumn, addCard])

  const handleCardClick = useCallback((card: Card) => { setEditCard(card) }, [])

  const handleEditSave = useCallback(async (updates: Partial<Card>) => {
    if (!editCard) return
    await updateCard(editCard.id, updates)
    // Si cambio de estado (vendido/baja/devolver), cerrar modal
    if (updates.column_status) { setEditCard(null); return }
    setEditCard(prev => prev ? { ...prev, ...updates } : null)
  }, [editCard, updateCard])

  const handleEditDelete = useCallback(async () => {
    if (!editCard) return
    await deleteCard(editCard.id)
    setEditCard(null)
  }, [editCard, deleteCard])

  const handleDragToSeguimiento = useCallback((cardId: string, newIndex: number) => {
    setQuotePending({ cardId, newIndex })
  }, [])

  const handleQuoteDate = useCallback(async (date: string) => {
    if (!quotePending) return
    await updateCard(quotePending.cardId, { quote_date: date })
    await moveCard(quotePending.cardId, 'seguimiento', quotePending.newIndex)
    setQuotePending(null)
  }, [quotePending, updateCard, moveCard])

  const handleQuotePdf = useCallback(async (file: File) => {
    if (!quotePending) return
    const att = await uploadPdf(quotePending.cardId, file)
    const today = new Date().toISOString().substring(0, 10)
    const card = cards.find(c => c.id === quotePending.cardId)
    const currentPdfs = card?.pdf_url || []
    await updateCard(quotePending.cardId, { quote_date: today, pdf_url: att ? [...currentPdfs, att] : currentPdfs })
    await moveCard(quotePending.cardId, 'seguimiento', quotePending.newIndex)
    setQuotePending(null)
  }, [quotePending, updateCard, moveCard, uploadPdf, cards])

  const handlePdfDrop = useCallback(async (cardId: string, file: File) => {
    const att = await uploadPdf(cardId, file)
    if (att) {
      const card = cards.find(c => c.id === cardId)
      if (card) {
        const newPdfs = [...(card.pdf_url || []), att]
        const today = new Date().toISOString().substring(0, 10)
        await updateCard(cardId, { pdf_url: newPdfs, quote_date: card.quote_date || today })
      }
    }
  }, [cards, uploadPdf, updateCard])

  const handleUploadPdf = useCallback(async (cardId: string, file: File): Promise<PdfAttachment | null> => {
    return uploadPdf(cardId, file)
  }, [uploadPdf])

  const pendingCard = quotePending ? cards.find(c => c.id === quotePending.cardId) : null

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-50">
        <p className="text-xl text-slate-400 font-medium">Cargando...</p>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-slate-50">
      <NavBar view={view} onViewChange={setView} agendaCount={agendaCount} ventasCount={ventasCount} bajasCount={bajasCount} />

      <div className="flex-1 overflow-hidden">
        {view === 'main' && (
          <Board cards={cards} onCardClick={handleCardClick} onAddClick={handleAddClick}
            onMoveCard={moveCard} onDragToSeguimiento={handleDragToSeguimiento}
            onQuickUpdate={(id, updates) => updateCard(id, updates)} onPdfDrop={handlePdfDrop}
            onMoveToColumn={(id, col) => {
              const c = cards.find(x => x.id === id)
              if (c?.column_status === 'cotizar' && col === 'seguimiento') {
                setQuotePending({ cardId: id, newIndex: 0 })
              } else {
                moveCard(id, col, 0)
              }
            }} />
        )}
        {view === 'agenda' && <AgendaBoard cards={cards} onCardClick={handleCardClick} />}
        {view === 'ventas' && <VentasBoard cards={cards} onCardClick={handleCardClick} />}
        {view === 'bajas' && <BajasBoard cards={cards} onCardClick={handleCardClick} />}
      </div>

      {createColumn && (
        <CreateCardModal column={createColumn} onSave={handleCreateSave} onClose={() => setCreateColumn(null)} />
      )}

      {editCard && (
        <CardModal card={editCard} onSave={handleEditSave} onDelete={handleEditDelete}
          onClose={() => setEditCard(null)} onUploadPdf={handleUploadPdf} />
      )}

      {quotePending && pendingCard && (
        <QuoteDateModal cardName={pendingCard.name} onConfirmDate={handleQuoteDate}
          onConfirmPdf={handleQuotePdf} onCancel={() => setQuotePending(null)} />
      )}
    </div>
  )
}
