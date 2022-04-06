import { createSlice, PayloadAction, Draft } from '@reduxjs/toolkit';

import {
  Word,
  Alignment,
  Link,
  InProgressLink,
  CorpusRole,
  Corpus,
  CorpusViewType,
  SyntaxType,
} from 'structs';

import removeSegmentFromLink from 'helpers/removeSegmentFromLink';
import generateLinkId from 'helpers/generateLinkId';
import syntaxMapper from 'features/treedown/syntaxMapper';

export enum AlignmentMode {
  CleanSlate = 'cleanSlate', // Default mode
  Select = 'select', // An existing link has been selected
  Edit = 'edit', // Editing a new or existing link
}

export interface AlignmentState {
  alignments: Alignment[];
  inProgressLink: InProgressLink | null;
  mode: AlignmentMode;
  corpora: Corpus[];
}

export const initialState: AlignmentState = {
  alignments: [],
  corpora: [],
  inProgressLink: null,
  mode: AlignmentMode.CleanSlate,
};

const remapSyntax = (state: Draft<AlignmentState>, alignmentIndex: number) => {
  const sourceCorpusId = state.alignments[alignmentIndex].source;
  const targetCorpusId = state.alignments[alignmentIndex].target;
  const sourceCorpusIndex = state.corpora.findIndex((corpus: Corpus) => {
    return corpus.id === sourceCorpusId;
  });
  const targetCorpusIndex = state.corpora.findIndex((corpus: Corpus) => {
    return corpus.id === targetCorpusId;
  });

  if (
    state.corpora[sourceCorpusIndex]?.syntax?._syntaxType === SyntaxType.Mapped
  ) {
    const oldSyntax = state.corpora[sourceCorpusIndex].syntax;

    if (oldSyntax) {
      state.corpora[sourceCorpusIndex].syntax = syntaxMapper(
        oldSyntax,
        state.alignments[alignmentIndex]
      );
    }
  }

  if (
    state.corpora[targetCorpusIndex]?.syntax?._syntaxType === SyntaxType.Mapped
  ) {
    const oldSyntax = state.corpora[targetCorpusIndex].syntax;

    if (oldSyntax) {
      state.corpora[targetCorpusIndex].syntax = syntaxMapper(
        oldSyntax,
        state.alignments[alignmentIndex]
      );
    }
  }
};

const alignmentSlice = createSlice({
  name: 'alignment',
  initialState,
  reducers: {
    loadAlignments: (state, action: PayloadAction<Alignment[]>) => {
      //const alignments = action.payload.concat([]);
      state.alignments = action.payload;

      for (const alignment of state.alignments) {
        alignment.links = alignment.links.map((link: Link, index: number) => {
          return {
            ...link,
            _id: `${alignment.source}-${alignment.target}-${index}`,
          };
        });
      }
      //state.alignments = alignments;
    },

    loadCorpora: (state, action: PayloadAction<Corpus[]>) => {
      state.corpora = action.payload.map((corpus: Corpus) => {
        const viewType = corpus.viewType
          ? corpus.viewType
          : CorpusViewType.Paragraph;

        let syntax = corpus.syntax;
        if (syntax && syntax._syntaxType === SyntaxType.Mapped) {
          const alignment = state.alignments.find((alignment: Alignment) => {
            // This is waiting to break.
            // TODO: relate an alignment to mapped syntax
            // TODO: know which side of the related alignment to use
            return alignment.source === 'nvi' && alignment.target === 'sbl';
          });
          if (alignment) {
            syntax = syntaxMapper(syntax, alignment);
          }
        }

        return { ...corpus, viewType };
      });
    },

    toggleCorpusView: (state, action: PayloadAction<string>) => {
      const corpusIndex = state.corpora.findIndex(
        (corpus) => corpus.id === action.payload
      );
      const oldViewType = state.corpora[corpusIndex].viewType;
      const newViewType =
        oldViewType === CorpusViewType.Paragraph
          ? CorpusViewType.Treedown
          : CorpusViewType.Paragraph;

      state.corpora[corpusIndex].viewType = newViewType;
    },

    toggleTextSegment: (state, action: PayloadAction<Word>) => {
      if (state.inProgressLink) {
        // There is already an in progress link.
        state.mode = AlignmentMode.Edit;

        const alreadyToggled =
          state.inProgressLink.sources.includes(action.payload.id) ||
          state.inProgressLink.targets.includes(action.payload.id);

        if (alreadyToggled) {
          // remove segment from link
          state.inProgressLink = removeSegmentFromLink(
            action.payload,
            state.inProgressLink
          );

          if (
            !(
              state.inProgressLink.sources.length > 0 ||
              state.inProgressLink.targets.length > 0
            )
          ) {
            // if nothing is selected, clear the link
            state.inProgressLink = null;
            state.mode = AlignmentMode.CleanSlate;
          }
        } else {
          // add segment to link
          if (action.payload.role === CorpusRole.Source) {
            state.inProgressLink.sources.push(action.payload.id);
          }

          if (action.payload.role === CorpusRole.Target) {
            state.inProgressLink.targets.push(action.payload.id);
          }
        }
      } else {
        // No in progress link.
        // Either create, or load existing link to edit.
        const alignment = state.alignments.find(
          (alignment) => alignment.target === action.payload.corpusId
        );

        if (!alignment) {
          throw new Error('Could not determine alignment pair for link.');
        }

        const existingLink = alignment.links.find((link: Link) => {
          return (
            link.sources.includes(action.payload.id) ||
            link.targets.includes(action.payload.id)
          );
        });

        if (existingLink) {
          // Load the existing link
          state.inProgressLink = {
            _id: existingLink._id,
            source: alignment.source,
            target: alignment.target,
            sources: existingLink.sources,
            targets: existingLink.targets,
          };
          state.mode = AlignmentMode.Select;
        } else {
          // Create new link
          // assume it's a target segment for now

          const newSources = [];
          const newTargets = [];

          if (action.payload.role === CorpusRole.Source) {
            newSources.push(action.payload.id);
          }

          if (action.payload.role === CorpusRole.Target) {
            newTargets.push(action.payload.id);
          }

          state.inProgressLink = {
            _id: `${alignment.source}-${alignment.target}-${generateLinkId(
              alignment.links
            )}`,
            source: alignment.source,
            target: alignment.target,
            sources: newSources,
            targets: newTargets,
          };
          state.mode = AlignmentMode.Edit;
        }
      }
    },

    resetTextSegments: (state) => {
      state.inProgressLink = null;
      state.mode = AlignmentMode.CleanSlate;
    },

    createLink: (state) => {
      if (state.inProgressLink) {
        const alignment = state.alignments.find((alignment: Alignment) => {
          return (
            alignment.source === state.inProgressLink?.source &&
            alignment.target === state.inProgressLink?.target
          );
        });

        if (!alignment) {
          throw new Error(
            `Could find alignment to update with link: ${state.inProgressLink}`
          );
        }

        let updated = false;
        for (const link of alignment.links) {
          if (link._id === state.inProgressLink._id) {
            link.sources = state.inProgressLink.sources;
            link.targets = state.inProgressLink.targets;
            updated = true;
          }
        }

        if (!updated) {
          alignment.links.push({
            sources: state.inProgressLink.sources,
            targets: state.inProgressLink.targets,
          });
        }

        state.inProgressLink = null;
        state.mode = AlignmentMode.CleanSlate;
        remapSyntax(state, state.alignments.indexOf(alignment));
      }
    },
    deleteLink: (state) => {
      const inProgressLink = state.inProgressLink;

      if (inProgressLink) {
        const alignmentIndex = state.alignments.findIndex(
          (alignment: Alignment) => {
            return (
              alignment.source === inProgressLink.source &&
              alignment.target === inProgressLink.target
            );
          }
        );

        if (Number.isFinite(alignmentIndex)) {
          const linkToDeleteIndex = state.alignments[
            alignmentIndex
          ].links.findIndex((link: Link) => {
            return link._id === inProgressLink._id;
          });

          if (Number.isFinite(linkToDeleteIndex)) {
            state.alignments[alignmentIndex].links.splice(linkToDeleteIndex, 1);
            state.inProgressLink = null;
            state.mode = AlignmentMode.CleanSlate;
            remapSyntax(state, alignmentIndex);
          }
        }
      }
    },
  },
});

export const {
  loadAlignments,
  loadCorpora,
  toggleCorpusView,
  toggleTextSegment,
  resetTextSegments,
  createLink,
  deleteLink,
} = alignmentSlice.actions;

export default alignmentSlice.reducer;
