import { createSlice, PayloadAction, Draft, current } from '@reduxjs/toolkit';

import {
  Word,
  Alignment,
  Link,
  InProgressLink,
  Corpus,
  CorpusViewType,
  SyntaxType,
} from 'structs';

import removeSegmentFromLink from 'helpers/removeSegmentFromLink';
import singularizeAlignmentPolarityField from 'helpers/singularizeAlignmentPolarityField';
import generateLinkId from 'helpers/generateLinkId';
import syntaxMapper from 'features/treedown/syntaxMapper';

export enum AlignmentMode {
  CleanSlate = 'cleanSlate', // Default mode
  Select = 'select', // An existing link has been selected
  Edit = 'edit', // Editing a new or existing link
  PartialEdit = 'partialEdit', // Only one 'side' has been selected
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

const createNextLinkId = (alignment: Alignment) => {
  return `${alignment.source}-${alignment.target}-${generateLinkId(
    alignment.links
  )}`;
};

const findPrimaryAlignmentBySecondary = (
  alignments: Alignment[],
  secondaryAlignment: Alignment
) => {
  if (secondaryAlignment.polarity.type === 'secondary') {
    let mappedSecondaryCorpusId: string;
    if (secondaryAlignment.polarity.mappedSide === 'sources') {
      mappedSecondaryCorpusId = secondaryAlignment['source'];
    }
    if (secondaryAlignment.polarity.mappedSide === 'targets') {
      mappedSecondaryCorpusId = secondaryAlignment['target'];
    }
    return alignments.find((alignment) => {
      if (alignment.polarity.type === 'primary') {
        const nonSyntaxSide = singularizeAlignmentPolarityField(
          alignment.polarity,
          'nonSyntaxSide'
        );
        return alignment[nonSyntaxSide] === mappedSecondaryCorpusId;
      }
      return false;
    });
  } else {
    throw new Error(
      'Attempted to find a primary alignment for the wrong polarity.'
    );
  }
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

  const sourceCorpusSyntaxType =
    state.corpora[sourceCorpusIndex]?.syntax?._syntaxType;
  const targetCorpusSyntaxType =
    state.corpora[targetCorpusIndex]?.syntax?._syntaxType;

  if (state.alignments[alignmentIndex].polarity.type === 'primary') {
    if (sourceCorpusSyntaxType === SyntaxType.Mapped) {
      const oldSyntax = state.corpora[sourceCorpusIndex].syntax;

      if (oldSyntax) {
        state.corpora[sourceCorpusIndex].syntax = syntaxMapper(
          oldSyntax,
          state.alignments[alignmentIndex]
        );
      }
    }

    if (targetCorpusSyntaxType === SyntaxType.Mapped) {
      const oldSyntax = state.corpora[targetCorpusIndex].syntax;

      if (oldSyntax) {
        state.corpora[targetCorpusIndex].syntax = syntaxMapper(
          oldSyntax,
          state.alignments[alignmentIndex]
        );
      }
    }
  }

  if (state.alignments[alignmentIndex].polarity.type === 'secondary') {
    if (sourceCorpusSyntaxType === SyntaxType.MappedSecondary) {
      const secondaryAlignment = state.alignments[alignmentIndex];
      const oldSyntax = state.corpora[sourceCorpusIndex].syntax;
      if (oldSyntax && secondaryAlignment) {
        const primaryAlignment = findPrimaryAlignmentBySecondary(
          state.alignments,
          secondaryAlignment
        );

        if (primaryAlignment) {
          state.corpora[sourceCorpusIndex].syntax = syntaxMapper(
            oldSyntax,
            primaryAlignment,
            secondaryAlignment
          );
        }
      }
    }

    if (targetCorpusSyntaxType === SyntaxType.MappedSecondary) {
      const secondaryAlignment = state.alignments[alignmentIndex];
      const oldSyntax = state.corpora[targetCorpusIndex].syntax;
      if (oldSyntax && secondaryAlignment) {
        const primaryAlignment = findPrimaryAlignmentBySecondary(
          state.alignments,
          secondaryAlignment
        );

        if (primaryAlignment) {
          state.corpora[targetCorpusIndex].syntax = syntaxMapper(
            oldSyntax,
            primaryAlignment,
            secondaryAlignment
          );
        }
      }
    }
  }
};

const alignmentSlice = createSlice({
  name: 'alignment',
  initialState,
  reducers: {
    loadAlignments: (state, action: PayloadAction<Alignment[]>) => {
      state.alignments = action.payload.map((alignment) => {
        return {
          ...alignment,
          links: alignment.links.map((link, index) => {
            return {
              ...link,
              _id: `${alignment.source}-${alignment.target}-${index}`,
            };
          }),
        };
      });
    },

    loadCorpora: (state, action: PayloadAction<Corpus[]>) => {
      state.corpora = action.payload.map((corpus: Corpus) => {
        const viewType = corpus.viewType
          ? corpus.viewType
          : CorpusViewType.Paragraph;

        let syntax = corpus.syntax;
        if (syntax && syntax._syntaxType === SyntaxType.Mapped) {
          const alignment = state.alignments.find((alignment: Alignment) => {
            if (alignment.polarity.type === 'primary') {
              const nonSyntaxSide = singularizeAlignmentPolarityField(
                alignment.polarity,
                'nonSyntaxSide'
              );
              return alignment[nonSyntaxSide] === corpus.id;
            }
            return false;
          });
          if (alignment) {
            syntax = syntaxMapper(syntax, alignment);
          }
        } else if (
          syntax &&
          syntax._syntaxType === SyntaxType.MappedSecondary
        ) {
          const secondaryAlignment = state.alignments.find((alignment) => {
            const sourceCorpus = action.payload.find((corpus) => {
              return corpus.id === alignment.source;
            });
            const targetCorpus = action.payload.find((corpus) => {
              return corpus.id === alignment.target;
            });

            if (alignment.source === corpus.id) {
              return targetCorpus?.syntax?._syntaxType === SyntaxType.Mapped;
            }

            if (alignment.target === corpus.id) {
              return sourceCorpus?.syntax?._syntaxType === SyntaxType.Mapped;
            }

            return false;
          });

          if (!secondaryAlignment) {
            throw new Error(
              `Error determining the secondary alignment data for Corpus: ${corpus.id}`
            );
          }

          if (
            secondaryAlignment &&
            secondaryAlignment.polarity.type === 'secondary'
          ) {
            const mappedSide = singularizeAlignmentPolarityField(
              secondaryAlignment.polarity,
              'mappedSide'
            );
            const primaryAlignment = state.alignments.find((alignment) => {
              if (alignment.polarity.type === 'primary') {
                const nonSyntaxSide = singularizeAlignmentPolarityField(
                  alignment.polarity,
                  'nonSyntaxSide'
                );
                return (
                  alignment[nonSyntaxSide] === secondaryAlignment[mappedSide]
                );
              }
              return false;
            });

            if (!primaryAlignment) {
              throw new Error(
                `Error determining the primary alignment data for Corpus: ${corpus.id}`
              );
            }

            syntax = syntaxMapper(syntax, primaryAlignment, secondaryAlignment);
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
      if (state.inProgressLink?._id === '?') {
        // There is a partial in-progress link.

        if (state.inProgressLink.source === action.payload.corpusId) {
          state.inProgressLink.source = action.payload.corpusId;
          state.inProgressLink.sources.push(action.payload.id);
        }

        if (state.inProgressLink.target === action.payload.corpusId) {
          state.inProgressLink.target = action.payload.corpusId;
          state.inProgressLink.targets.push(action.payload.id);
        }

        if (
          state.inProgressLink.sources.length !== 0 &&
          state.inProgressLink.targets.length !== 0
        ) {
          state.mode = AlignmentMode.Edit;
          const relatedAlignment = state.alignments.find((alignment) => {
            return (
              alignment.source === state.inProgressLink?.source &&
              alignment.target === state.inProgressLink?.target
            );
          });

          if (!relatedAlignment) {
            throw new Error(
              `Unable to find alignment for proposed link: ${current(
                state.inProgressLink
              )}`
            );
          }
          state.inProgressLink._id = createNextLinkId(relatedAlignment);
        } else if (
          state.inProgressLink.sources.length === 0 ||
          state.inProgressLink.targets.length === 0
        ) {
          state.mode = AlignmentMode.PartialEdit;
        }
        return;
      }

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
          if (action.payload.corpusId === state.inProgressLink.source) {
            state.inProgressLink.sources.push(action.payload.id);
          }

          if (action.payload.corpusId === state.inProgressLink.target) {
            state.inProgressLink.targets.push(action.payload.id);
          }
        }
      } else {
        // No in progress link.
        // Either create, or load existing link to edit.
        const newInProgressLink = {
          _id: '?',
          source: '?',
          target: '?',
          sources: [] as string[],
          targets: [] as string[],
        };

        const potentialAlignments = state.alignments.filter(
          (alignment) =>
            alignment.target === action.payload.corpusId ||
            alignment.source === action.payload.corpusId
        );

        if (potentialAlignments.length === 0) {
          // No alignments found for text segment.
          throw new Error(
            `No alignment found for selected text segment: ${action.payload.id}, ${action.payload.corpusId}`
          );
        }

        if (potentialAlignments.length === 1) {
          // Single alignmnent for text segment found.
          const alignment = potentialAlignments[0];

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
            return;
          }

          if (!existingLink) {
            // Initialize partial edit mode.

            newInProgressLink._id = createNextLinkId(alignment);
            newInProgressLink.source = alignment.source;
            newInProgressLink.target = alignment.target;

            if (action.payload.corpusId === alignment.source) {
              newInProgressLink.sources.push(action.payload.id);
            }

            if (action.payload.corpusId === alignment.target) {
              newInProgressLink.targets.push(action.payload.id);
            }
            state.inProgressLink = newInProgressLink;
            state.mode = AlignmentMode.Edit;
            return;
          }
        }

        if (potentialAlignments.length > 1) {
          // Multiple potential alignments for text segment.
          // Punt?
          //
          // Both sides are not known.
          // Enter partial edit mode.
          alert(
            'The feature "DISAMBIGUATE POTENTIAL ALIGNMENTS" has not been implemented yet. Please contact support.'
          );
          throw new Error(
            'DISAMBIGUATE POTENTIAL ALIGNMENTS? Not implemented yet.'
          );
          // state.inProgressLink = {
          //   _id: '?',
          //   source: '',
          //   target: '',
          //   sources: [],
          //   targets: [],
          // };
          // state.mode = AlignmentMode.PartialEdit;
          // return;
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
            _id: state.inProgressLink._id,
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
