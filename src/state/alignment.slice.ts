import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Word, Alignment, Link, InProgressLink, CorpusRole } from 'structs';

import removeSegmentFromLink from 'helpers/removeSegmentFromLink';
import generateLinkId from 'helpers/generateLinkId';

//export enum AlignmentMode {
//CleanSlate = 'cleanSlate',
//Edit = 'edit',
//}

export interface AlignmentState {
  alignments: Alignment[];
  inProgressLink: InProgressLink | null;
  //mode: AlignmentMode;
}

export const initialState: AlignmentState = {
  alignments: [],
  inProgressLink: null,
  //mode: AlignmentMode.CleanSlate,
};

const alignmentSlice = createSlice({
  name: 'alignment',
  initialState,
  reducers: {
    //setAlignmentMode: (state, action: PayloadAction<AlignmentMode>) => {
    //state.mode = action.payload;
    //},
    loadAlignments: (state, action: PayloadAction<Alignment[]>) => {
      const alignments = action.payload.concat([]);

      for (const alignment of alignments) {
        alignment.links = alignment.links.map((link: Link, index: number) => {
          return {
            ...link,
            _id: `${alignment.source}-${alignment.target}-${index}`,
          };
        });
      }
      state.alignments = alignments;
    },
    toggleTextSegment: (state, action: PayloadAction<Word>) => {
      if (state.inProgressLink) {
        // There is already an in progress link.
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
        }
      }
    },

    toggleAllLinkSegments: (state, action: PayloadAction<Word[]>) => {
      //for (const payloadWord of action.payload) {
      //const alreadySelected = Boolean(
      //state.selectedTextSegments.find((word: Word) => {
      //return word.id === payloadWord.id;
      //})
      //);
      //if (alreadySelected) {
      //state.selectedTextSegments = state.selectedTextSegments.filter(
      //(word) => word.id !== payloadWord.id
      //);
      //} else {
      //state.selectedTextSegments.push(payloadWord);
      //}
      //}
    },
    resetTextSegments: (state) => {
      state.inProgressLink = null;
      //state.mode = AlignmentMode.CleanSlate;
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
        //state.mode = AlignmentMode.CleanSlate;
      }
    },
  },
});

export const {
  //setAlignmentMode,
  loadAlignments,
  toggleTextSegment,
  toggleAllLinkSegments,
  resetTextSegments,
  createLink,
} = alignmentSlice.actions;

export default alignmentSlice.reducer;
