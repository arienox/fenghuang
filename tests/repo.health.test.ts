import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as healthRepo from '../lib/repo/health.repo'

vi.mock('../lib/db', () => ({ db: {
	select: vi.fn(() => ({ from: vi.fn(()=> ({ where: vi.fn(()=> ([])) })) })),
	insert: vi.fn(() => ({ values: vi.fn().mockReturnThis(), returning: vi.fn(()=> ([{ id: 42 }])) })),
	execute: vi.fn()
} }))

describe('health.repo', () => {
	beforeEach(()=> vi.clearAllMocks())
	it('ensureProteinHabit inserts when missing', async () => {
		const habit = await healthRepo.ensureProteinHabit('demo')
		expect(habit.id).toBe(42)
	})
	it('weekProteinSummary aggregates rows', async () => {
		const { db } = await import('../lib/db') as any
		;(db.execute as any).mockResolvedValue({ rows: [{ day: new Date('2025-08-18'), grams: 120 }] })
		const s = await healthRepo.weekProteinSummary('demo','2025-08-18')
		expect(s[0].grams).toBe(120)
	})
}) 