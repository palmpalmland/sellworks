export interface ProductContent {
  title: string;
  bullets: string[];
  description: string;
  videoUrl: string;
  images: string[];
}

export type AppState = 'idle' | 'loading' | 'results';
