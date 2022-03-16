// Determines how a corpus might
// be interacted with.
export enum CorpusRole {
  Source = 'source',
  Target = 'target',
}

export enum CorpusViewType {
  Paragraph = 'paragraph',
  Treedown = 'treedown',
}

// Linkable sub-unit of corpus
export interface Word {
  id: string;
  corpusId: string;
  role: CorpusRole;

  text: string;
  position: number;
}

// A body of text.
export interface Corpus {
  id: string;
  name: string;
  fullName: string;
  language: string;
  role: CorpusRole;

  words: Word[];
  fullText?: string;
  viewType?: CorpusViewType;
  syntax?: SyntaxNode;
}

// An instance of alignment
export interface Link {
  _id?: string;
  sources: string[];
  targets: string[];
}

// Extension of Link, use in tracking
// state of 'inProgress' links.
export interface InProgressLink extends Link {
  source: string;
  target: string;
}

// Collection of textual pairs
export interface Alignment {
  source: string;
  target: string;
  links: Link[];
}

export interface SyntaxNode {
  type: string;
  start: number;
  end: number;
  text: string;
  children: SyntaxNode[];
}
