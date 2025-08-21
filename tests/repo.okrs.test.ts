import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as okrRepo from '../lib/repo/okrs.repo'

vi.mock('../lib/db', () => ({ db: {
	insert: vi.fn(() => ({ values: vi.fn().mockReturnThis(), returning: vi.fn(()=> ([{ id: 7 }]) ) })),
	select: vi.fn(() => ({ from: vi.fn(()=> ({ where: vi.fn(()=> ([{ target: 100, current: 60 }, { target: 50, current: 50 }]) ) })) })),
	update: vi.fn(() => ({ set: vi.fn().mockReturnThis(), where: vi.fn().mockReturnThis() }))
} }))

describe('okrs.repo', () => {
	beforeEach(()=> vi.clearAllMocks())
	it('createOKR returns id', async () => {
		const r = await okrRepo.createOKR({ userId:'demo', title:'Grow revenue'})
		expect(r.id).toBe(7)
	})
	it('progress sums current/target', async () => {
		const p = await okrRepo.progress(1)
		expect(p.percent).toBe(73) // (60+50)/(100+50)=110/150=73.33
	})
}) 