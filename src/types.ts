export interface ChallengeEvent {
  id: string;
  title: string;
  description: string;
  icon: string;
  isTeamEvent: boolean;
}

export interface Speaker {
  name: string;
  role: string;
  discipline: string;
  imageUrl: string;
}

export interface AgendaItem {
  time: string;
  hourLabel: string;
  title: string;
  description: string;
}
