export interface Word {
  id: string;
  text: string;
  position: number;
}

export interface Text {
  id: string;
  name: string;
  text: string;
  language: string;
  words: Word[];
}

export interface Link {
  text1: string[];
  text2: string[];
}

export interface Alignment {
  text1: string;
  text2: string;
  links: Link[];
}
