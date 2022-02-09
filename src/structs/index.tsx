export interface Word {
  id: string;
  text: string;
  position: number;
}

export interface Text {
  id: string;
  name: string;
  text: string;
  words: Word[];
}
