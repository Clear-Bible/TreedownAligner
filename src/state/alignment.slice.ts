import { createSlice, PayloadAction, Draft, current } from '@reduxjs/toolkit';

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
import cachedSyntax from 'features/treedown/cachedSyntax';
import { CorpusType } from 'structs';

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

const remapSyntax = (state: Draft<AlignmentState>, alignmentIndex: number) => {
  console.log('remap');
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
        // console.log('loadCorpus', corpus.id);
        const viewType = corpus.viewType
          ? corpus.viewType
          : CorpusViewType.Paragraph;

        let syntax = corpus.syntax;
        if (syntax && syntax._syntaxType === SyntaxType.Mapped) {
          // console.log('mapped', corpus.id);
          const alignment = state.alignments.find((alignment: Alignment) => {
            const sourceCorpusType = state.corpora.find((corpus) => {
              return corpus.id === alignment.source;
            })?.type;
            const targetCorpusType = state.corpora.find((corpus) => {
              return corpus.id === alignment.target;
            })?.type;

            // TODO should this be looking at fields based on AlignmentPolarity?
            return (
              (sourceCorpusType === CorpusType.Primary &&
                alignment.target === corpus.id) ||
              (targetCorpusType === CorpusType.Primary &&
                alignment.source === corpus.id)
            );
          });
          if (alignment) {
            console.log('MAP primary only', corpus.id);
            syntax = syntaxMapper(syntax, alignment);
          }
        } else if (
          syntax &&
          syntax._syntaxType === SyntaxType.MappedSecondary
        ) {
          // console.log('mappedSecondary', corpus.id);
          const secondaryAlignment = state.alignments.find((alignment) => {
            //console.log('findSecondary', alignment.source, alignment.target);
            //console.log('secondary options', action.payload.length);
            const sourceCorpus = action.payload.find((corpus) => {
              //console.log('findSource', corpus.id);
              return corpus.id === alignment.source;
            });
            const targetCorpus = action.payload.find((corpus) => {
              return corpus.id === alignment.target;
            });

            if (alignment.source === corpus.id) {
              return targetCorpus?.syntax?._syntaxType === SyntaxType.Mapped;
            }

            if (alignment.target === corpus.id) {
              //console.log('check', sourceCorpus);
              return sourceCorpus?.syntax?._syntaxType === SyntaxType.Mapped;
            }

            return false;
          });

          if (!secondaryAlignment) {
            throw new Error(
              `Error determining the secondary alignment data for Corpus: ${corpus.id}`
            );
          }

          if (secondaryAlignment) {
            // console.log(
            //   'secondary',
            //   secondaryAlignment.source,
            //   secondaryAlignment.target
            // );
            const mappedAlignmentCorpus =
              secondaryAlignment.source === corpus.id
                ? secondaryAlignment.target
                : secondaryAlignment.source;

            // console.log(
            //   'findPrimary',
            //   mappedAlignmentCorpus,
            //   state.alignments.length
            // );

            const primaryAlignment = state.alignments.find((alignment) => {
              const sourceCorpusType = action.payload.find((corpus) => {
                return corpus.id === alignment.source;
              })?.type;
              const targetCorpusType = action.payload.find((corpus) => {
                return corpus.id === alignment.target;
              })?.type;

              // console.log(sourceCorpusType, targetCorpusType);
              return (
                (alignment.source === mappedAlignmentCorpus ||
                  alignment.target === mappedAlignmentCorpus) &&
                (sourceCorpusType === CorpusType.Primary ||
                  targetCorpusType === CorpusType.Primary)
              );
            });

            if (!primaryAlignment) {
              throw new Error(
                `Error determining the primary alignment data for Corpus: ${corpus.id}`
              );
            }

            // console.log('primary', primaryAlignment);
            // console.log('secondary', secondaryAlignment);
            console.log('MAP', 'with secondary', `corpus: ${corpus.id}`);
            console.log(
              '-- primary: ',
              `${primaryAlignment.source} => ${primaryAlignment.target}`
            );
            console.log(
              '-- secondary: ',
              `${secondaryAlignment.source} => ${secondaryAlignment.target}`
            );

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
        const emptySide =
          state.inProgressLink.sources.length === 0
            ? CorpusRole.Source
            : CorpusRole.Target;

        const sideInView = action.payload.role;

        if (sideInView === CorpusRole.Source) {
          state.inProgressLink.source = action.payload.corpusId;
          state.inProgressLink.sources.push(action.payload.id);
        }

        if (sideInView === CorpusRole.Target) {
          state.inProgressLink.target = action.payload.corpusId;
          state.inProgressLink.targets.push(action.payload.id);
        }

        if (sideInView === emptySide) {
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
        } else if (sideInView !== emptySide) {
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
          // Both sides are not known.
          // Enter partial edit mode.
          let source = '?';
          let target = '?';
          const sources = [];
          const targets = [];

          if (action.payload.role === CorpusRole.Source) {
            source = action.payload.corpusId;
            sources.push(action.payload.id);
            console.log(source, sources);
          }

          if (action.payload.role === CorpusRole.Target) {
            target = action.payload.corpusId;
            targets.push(action.payload.id);
          }

          state.inProgressLink = {
            _id: '?',
            source,
            target,
            sources,
            targets,
          };

          state.mode = AlignmentMode.PartialEdit;
          return;
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
            //source =
          }

          if (action.payload.role === CorpusRole.Target) {
            newTargets.push(action.payload.id);
          }

          state.inProgressLink = {
            _id: createNextLinkId(alignment),
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
