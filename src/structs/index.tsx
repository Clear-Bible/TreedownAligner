export interface Word {
  id: string;
  text: string;
  position: number;
}

export interface Text {
  name: string;
  text: string;
  words: Word[];
}

