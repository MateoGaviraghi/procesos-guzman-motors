import { useState, useEffect, useCallback } from 'react'
import type { Card, ColumnStatus, CardInsert } from '../lib/types'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

const LOCAL_KEY = 'guzman-motors-cards'

function generateId(): string {
  return crypto.randomUUID()
}

function loadLocal(): Card[] {
  try {
    const raw = localStorage.getItem(LOCAL_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveLocal(cards: Card[]) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(cards))
}

export function useCards() {
  const [cards, setCards] = useState<Card[]>([])
  const [loading, setLoading] = useState(true)
  const useSupabase = isSupabaseConfigured

  const fetchCards = useCallback(async () => {
    if (useSupabase) {
      const { data } = await supabase.from('cards').select('*').order('position', { ascending: true })
      if (data) setCards(data)
    } else {
      setCards(loadLocal())
    }
    setLoading(false)
  }, [useSupabase])

  useEffect(() => {
    fetchCards()
  }, [fetchCards])

  useEffect(() => {
    if (!loading && !useSupabase) {
      saveLocal(cards)
    }
  }, [cards, loading, useSupabase])

  const addCard = useCallback(async (data: Omit<CardInsert, 'position'>) => {
    const now = new Date().toISOString()
    const newCard: Card = {
      ...data,
      id: generateId(),
      position: cards.filter(c => c.column_status === data.column_status).length,
      created_at: now,
      updated_at: now,
    }
    if (useSupabase) {
      const { data: inserted } = await supabase.from('cards').insert(newCard).select().single()
      if (inserted) setCards(prev => [...prev, inserted])
    } else {
      setCards(prev => [...prev, newCard])
    }
    return newCard
  }, [cards, useSupabase])

  const updateCard = useCallback(async (id: string, updates: Partial<Card>) => {
    const updated = { ...updates, updated_at: new Date().toISOString() }
    if (useSupabase) {
      await supabase.from('cards').update(updated).eq('id', id)
    }
    setCards(prev => prev.map(c => c.id === id ? { ...c, ...updated } : c))
  }, [useSupabase])

  const deleteCard = useCallback(async (id: string) => {
    if (useSupabase) {
      await supabase.from('cards').delete().eq('id', id)
    }
    setCards(prev => prev.filter(c => c.id !== id))
  }, [useSupabase])

  const moveCard = useCallback(async (
    cardId: string,
    newColumn: ColumnStatus,
    newIndex: number
  ) => {
    setCards(prev => {
      const card = prev.find(c => c.id === cardId)
      if (!card) return prev

      const others = prev.filter(c => c.id !== cardId)
      const updatedCard = { ...card, column_status: newColumn, updated_at: new Date().toISOString() }

      const columnCards = others
        .filter(c => c.column_status === newColumn)
        .sort((a, b) => a.position - b.position)

      columnCards.splice(newIndex, 0, updatedCard)
      columnCards.forEach((c, i) => { c.position = i })

      const result = [
        ...others.filter(c => c.column_status !== newColumn),
        ...columnCards,
      ]

      if (useSupabase) {
        columnCards.forEach(c => {
          supabase.from('cards').update({
            column_status: c.column_status,
            position: c.position,
            updated_at: c.updated_at,
          }).eq('id', c.id).then(() => {})
        })
      }

      return result
    })
  }, [useSupabase])

  const uploadPdf = useCallback(async (cardId: string, file: File): Promise<string | null> => {
    if (useSupabase) {
      const path = `quotes/${cardId}/${file.name}`
      const { error } = await supabase.storage.from('pdfs').upload(path, file, { upsert: true })
      if (error) return null
      const { data } = supabase.storage.from('pdfs').getPublicUrl(path)
      return data.publicUrl
    }
    return URL.createObjectURL(file)
  }, [useSupabase])

  return { cards, loading, addCard, updateCard, deleteCard, moveCard, uploadPdf }
}
