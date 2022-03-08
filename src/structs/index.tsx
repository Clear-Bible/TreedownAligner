// Linkable sub-unit of corpus
export interface Word {
  id: string;
  corpusId: string;
  text: string;
  position: number;
}

// A body of text.
export interface Corpus {
  id: string;
  name: string;
  language: string;

  words: Word[];
  fullText?: string;
}

// An instance of alignment
export interface Link {
  sources: string[];
  targets: string[];
}

// Collection of textual pairs
export interface Alignment {
  source: string;
  target: string;
  links: Link[];
}
