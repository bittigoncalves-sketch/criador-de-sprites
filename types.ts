
export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  sources?: GroundingSource[];
}

export interface GroundingSource {
    uri: string;
    title: string;
}

export interface Sprite {
    id: string;
    url: string;
}
