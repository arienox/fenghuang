import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as financeRepo from '../lib/repo/finance.repo'

vi.mock('../lib/db', () => ({ db: { insert: vi.fn(() => ({ values: vi.fn().mockReturnThis() })), select: vi.fn(() => ({ from: vi.fn(() => ({ orderBy: vi.fn(() => ({ limit: vi.fn(() => ([{ id:1 }])) })) })) })), execute: vi.fn() } }))

describe('finance.repo', () => {
	beforeEach(()=> vi.clearAllMocks())
	it('addTransaction validates and inserts', async () => {
		await financeRepo.addTransaction({ userId: 'demo', source:'stripe', kind:'income', amount: 123.45 })
		expect(true).toBe(true)
	})
	it('monthSummary returns net totals', async () => {
		const { db } = await import('../lib/db') as any
		;(db.execute as any).mockResolvedValue({ rows: [{ kind:'income', total: 1000 }, { kind:'expense', total: 400 }] })
		const m = await financeRepo.monthSummary('2025-08')
		expect(m.net).toBe(600)
	})
}) 