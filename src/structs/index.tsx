export enum SyntaxType {
  // Has syntax data.
  Source = 'source',
  // Mapped to a corpus with syntax data.
  Mapped = 'mapped',
  // Mapped to a corpus that is mapped to a corpus with syntax data.
  MappedSecondary = 'mappedSecondary',
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

  text: string;
  position: number;
}

export interface CorpusViewport {
  corpusId: string | null;
}

// A body of text.
export interface Corpus {
  id: string;
  name: string;
  fullName: string;
  language: string;

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

export type AlignmentSide = 'sources' | 'targets';

export interface AlignmentPolarityBase {
  type: 'primary' | 'secondary';
}

export interface PrimaryAlignmentPolarity extends AlignmentPolarityBase {
  type: 'primary';
  syntaxSide: AlignmentSide;
  nonSyntaxSide: AlignmentSide;
}

export interface SecondaryAlignmentPolarity extends AlignmentPolarityBase {
  type: 'secondary';
  mappedSide: AlignmentSide;
  nonMappedSide: AlignmentSide;
}

export type AlignmentPolarity =
  | PrimaryAlignmentPolarity
  | SecondaryAlignmentPolarity;

export interface Alignment {
  source: string;
  target: string;
  polarity: AlignmentPolarity;
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
