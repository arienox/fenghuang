import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as tasksRepo from '../lib/repo/tasks.repo'

vi.mock('../lib/db', () => {
	return {
		db: {
			select: vi.fn(() => ({ from: vi.fn().mockReturnThis(), where: vi.fn().mockReturnThis(), orderBy: vi.fn().mockReturnThis(), limit: vi.fn().mockReturnThis() })),
			insert: vi.fn(() => ({ values: vi.fn().mockReturnThis(), returning: vi.fn(() => [{ id: 1 }]) })),
			update: vi.fn(() => ({ set: vi.fn().mockReturnThis(), where: vi.fn().mockReturnThis() })),
			execute: vi.fn(),
		}
	}
})

describe('tasks.repo', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})
	it('createTask validates and inserts', async () => {
		const res = await tasksRepo.createTask({ userId:'demo', title:'T', kind:'revenue', expectedValue: 1000, minutes: 30, importance: 3, urgency: 2, lane: 'now' })
		expect(res.id).toBe(1)
	})
	it('planMoneyFirst respects limit and returns ids', async () => {
		const { db } = await import('../lib/db') as any
		;(db.select as any).mockReturnValue({ from: ()=>({ where: ()=>({ orderBy: ()=>({ limit: ()=> [{ id: 3 }, { id: 2 }, { id:1 }] }) }) }) })
		;(db.execute as any).mockResolvedValue({})
		const result = await tasksRepo.planMoneyFirst({ limit: 2 })
		expect(result.picked.length).toBe(2)
	})
	it('toggleDone throws on missing id', async () => {
		const { db } = await import('../lib/db') as any
		;(db.execute as any).mockResolvedValue({ rowCount: 0 })
		await expect(tasksRepo.toggleDone(999)).rejects.toThrow()
	})
}) 