export function calcStreak(dates: Date[]): number{
	if(dates.length===0) return 0
	const days = new Set(dates.map(d=> d.toISOString().slice(0,10)))
	let streak = 0
	let cursor = new Date()
	for(;;){
		const key = cursor.toISOString().slice(0,10)
		if(days.has(key)){
			streak += 1
			cursor.setDate(cursor.getDate()-1)
		}else{
			break
		}
	}
	return streak
} 