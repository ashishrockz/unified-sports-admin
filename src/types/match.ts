export interface Match {
  _id: string;
  roomId: string;
  sportTypeId: string;
  sport: string;
  teamA: { name: string; players: string[]; captain?: string };
  teamB: { name: string; players: string[]; captain?: string };
  toss: { winnerTeam: string; choice: string };
  status: 'not_started' | 'active' | 'innings_break' | 'set_break' | 'completed' | 'abandoned';
  currentInnings?: number;
  result: { winner?: string; margin?: string; description?: string; completedAt?: string };
  config: any;
  createdAt: string;
  updatedAt: string;
}
