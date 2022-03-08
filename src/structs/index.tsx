export interface Word {
  id: string;
  text: string;
  position: number;
}

export interface Text {
  id: string;
  name: string;
  language: string;

  words: Word[];
  fullText?: string;
}

export interface Link {
  sources: string[];
  targets: string[];
}

export interface Alignment {
  source: string;
  target: string;
  links: Link[];
}
