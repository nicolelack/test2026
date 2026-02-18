
export enum Sender {
  USER = 'user',
  BOT = 'bot'
}

export interface Message {
  id: string;
  sender: Sender;
  text: string;
  timestamp: Date;
}

export interface Service {
  id: string;
  name: string;
  category: string;
  description: string;
  price: string;
  image: string;
}

export interface FaqQuickLink {
  label: string;
  query: string;
}
