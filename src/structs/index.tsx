// Determines how a corpus might
// be interacted with.
export enum CorpusRole {
  Source = 'source',
  Target = 'target',
}

export enum SyntaxType {
  Source = 'source',
  Mapped = 'mapped',
}

export enum CorpusViewType {
  Paragraph = 'paragraph',
  Treedown = 'treedown',
}

export enum TreedownType {
  Source = 'source',
  Mapped = 'mapped',
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
  syntax?: SyntaxRoot;
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

export interface SyntaxContent {
  elementType: string;
  class?: string;

  n?: string;
  osisId?: string;
  lemma?: string;
  strong?: string;
  gloss?: string;
  text?: string;
  rule?: string;
  role?: string;

  head?: string;
  discontinuous?: string;
  person?: string;
  number?: string;
  gender?: string;
  case?: string;
  tense?: string;
  voice?: string;
  mood?: string;
  articular?: string;
  det?: string;
  type?: string;

  alignedWordIds?: string[];
}

export interface SyntaxNode {
  content: SyntaxContent;
  children: SyntaxNode[];
}

export interface SyntaxRoot extends SyntaxNode {
  _syntaxType: SyntaxType;
}
