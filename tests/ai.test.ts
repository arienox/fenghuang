import { describe, it, expect } from 'vitest'
import { moneyFirstScore, prioritizeTasks } from '../lib/ai'

describe('moneyFirstScore', () => {
  it('boosts revenue tasks massively', () => {
    const rev = moneyFirstScore({ id:1, importance:1, urgency:1, kind:'revenue', expectedValue:2000, minutes:60 })
    const ops = moneyFirstScore({ id:2, importance:3, urgency:3, kind:'ops', expectedValue:0, minutes:60 })
    expect(rev).toBeGreaterThan(ops)
  })
  it('considers ROI (value/minute)', () => {
    const fast = moneyFirstScore({ id:1, importance:1, urgency:1, kind:'revenue', expectedValue:1000, minutes:30 })
    const slow = moneyFirstScore({ id:2, importance:1, urgency:1, kind:'revenue', expectedValue:1000, minutes:120 })
    expect(fast).toBeGreaterThan(slow)
  })
})

describe('prioritizeTasks', () => {
  it('orders by money-first score', async () => {
    const tasks = [
      { id:1, importance:1, urgency:1, kind:'ops', expectedValue:0, minutes:60 },
      { id:2, importance:2, urgency:2, kind:'revenue', expectedValue:500, minutes:60 },
      { id:3, importance:3, urgency:3, kind:'content', expectedValue:200, minutes:45 }
    ] as any
    const ranked = await prioritizeTasks(tasks)
    expect(ranked[0].id).toBe(2) // revenue wins
  })
})
