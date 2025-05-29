export function isMissedDay(lastActive?: string): boolean {
    if (!lastActive) return false;
    const now = new Date();
    const todayMidnight = new Date(now.setHours(0, 0, 0, 0));
    const last = new Date(lastActive);
    return last < todayMidnight && last < new Date(todayMidnight.getTime() - 24 * 60 * 60 * 1000);
  }
  
  export function canEvolve(stage: string, totalMinutes: number): boolean {
    return (
      (stage === 'egg') ||
      (stage === 'baby' && totalMinutes >= 100) ||
      (stage === 'adolescent' && totalMinutes >= 300)
    );
  }
  
  export function getDailyGoal(stage: string): number {
    return stage === "baby" ? 10 : stage === "adolescent" ? 30 : stage === "mature" ? 60 : 0;
  }  