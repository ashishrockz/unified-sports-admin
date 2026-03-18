export interface Room {
  _id: string;
  name: string;
  sportTypeId: any;
  creator: any;
  status: 'waiting' | 'toss_pending' | 'active' | 'completed' | 'abandoned';
  matchType?: string;
  players: any[];
  toss: any;
  matchId?: string;
  maxPlayers: number;
  minPlayers: number;
  teamAName?: string;
  teamBName?: string;
  createdAt: string;
  updatedAt: string;
}
