# TreedownAligner

TreedownAligner is a react component library. Its components enable users to view and modify alignments between texts with the aid source language syntax via Treedown.

[View Demo](https://treedown-aligner.netlify.app).

TreedownAligner is a react component written in Typesript using Redux for state management.
Included is a `<Workbench />` component that wraps TreedownAligner for local development and testing.

## Consuming Application Quickstart

- Install: `npm install treedown-aligner`
- Import: `import TreedownAligner from 'treedown-aligner';`
- Render: `() => { return <TreedownAligner /> }` (see below for proper usage)

### Note: expected peer dependencies

The following peer dependencies are required:

- `react`
- `react-dom`

The component currently supports react v18.x.

## Local development Quickstart

- Install dependencies: `yarn`
- Run local server: `yarn start` (starts local CRA server with component wrapper in a UI workbench)
- Build: `yarn build`

## Basic Usage

After install, import the react component:

```js
import TreedownEditor from 'treedown-aligner';
```

In your render function, include the component with some props:

```js
<TreedownEditor
  theme="day"
  corpora={[<...>]}
  alignments={<...>}
  alignmentUpdated={(newAlignmentData) => {
    // persist alignment data here
  }}
/>
```

## Properties and Options

### `theme`

`string: 'day' | 'night'`

specifies which css theme is used.

### `corpora`

`Corpus[]`

_Corpora_ is the plural form of corpus. A corpus is one body of text that the user will interact with when using this component. Up to 4 corpus entities can be supplied.

A `Corpus` looks like:

```ts
interface Corpus {
  id: string;
  name: string;
  fullName: string;
  language: string;
  role: CorpusRole;
  type: CorpusType;

  words: Word[];
  fullText?: string;
  viewType?: CorpusViewType;
  syntax?: SyntaxRoot;
}
```

- `id: string` unique identifier for the corpus
- `name: string` short name, like `NIV`
- `fullName` long name, like `New International Version`
- `language` language code via [ISO 639-3](https://iso639-3.sil.org/code_tables/639/data)
- [wip] `role: 'source' | 'target`
- [wip] `type: 'primary | 'translation'`
- `words: Word[]` object representing a word in the corpus. See [`Word`](#word) below.
- `fullText?: string` _optional_ - full unsegmented text of the corpus
- `syntax?: SyntaxRoot` a syntactic parsing of the corpus. See [`SyntaxRoot`](#syntax-root) below.

#### `Word`

`Word` is an object representing a word in a corpus. In English, words are surrounded by whitespace, but in other languages not neccesarily.

A `Word` looks like:

```ts
export interface Word {
  id: string;
  corpusId: string;
  role: CorpusRole;

  text: string;
  position: number;
}
```

- `id: string` unique indetifier. used to correlate with [`Alignment`](#alignments) data
- `corpusId: string` unique identifier of the corpus the words belongs to
- [wip] `role: 'source' | 'target'`
- `text: string` content of the word
- `position: number` sequential position of the word in the corpus

#### `SyntaxRoot`

In some use cases, one of the supplied corpora can have syntax data. In this case, "Syntax data" is a tree-like structure denoting words, word groups, and their relationships to other. The component current supports a json representation of [Lowfat Syntax XML](https://github.com/Clear-Bible/macula-greek/tree/main/Nestle1904/lowfat).

`Note`: The component could recieve lowfat xml in string form and then internally convert to json structure. This may be preferable.

### `alignments`

`Alignment[]`

An `Alignment` is a set of data the describes the relationship between two corpora. The component enables users to view and modify alignment data. It also uses alignment data to generate syntactic views in [treedown](http://jonathanrobie.biblicalhumanities.org/blog/2017/05/12/lowfat-treebanks-visualizing/) notation.

```ts
interface Alignment {
  source: string;
  target: string;
  polarity: AlignmentPolarity;
  links: Link[];
}
```

- `source: string` id of the source corpus
- `target: string` id of the target corpus
- `polarity: AlignmentPolarity` describes the directionality of the alignment see [`AlignmentPolarity`](#alignment-polarity) below.
- `links: Link[]` relationship entities between the two corpora. see [`Links`](#links)

#### Alignment Polarity

WORK IN PROGRESS

```ts
asdf;
```

#### Links

`Link[]`

A `Link` is a single instance of alignment data. It describes the relationship between the words of two corpora. The strings on either side of the link are IDs of words that were cpecified in the provided `Corpus[]`. There can be one or many words on either side of a `Link`.

```ts
export interface Link {
  _id?: string;
  sources: string[];
  targets: string[];
}
```

- [wip] `_id?: string` unqiue indentifier for the link. probably should just generate internally
- `sources: string[]` array of Word IDs on the source side of the link
- `targets: string[]` array of Word IDs on the target side of the link

### `alignmentUpdated`

This is function provided by the consuming application that is called when a user saves alignment data. At the time of invocation, the current alignment state is passed to the function which can be used to display, send, or persist the user's alignment data.
