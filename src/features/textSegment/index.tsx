import React, { ReactElement } from 'react';

import useDebug from 'hooks/useDebug';

import { useAppDispatch, useAppSelector } from 'app/hooks';
import {
  toggleTextSegment,
  toggleAllLinkSegments,
  setAlignmentMode,
  AlignmentMode,
} from 'state/alignment.slice';
import { hover, relatedAlignments } from 'state/textSegmentHover.slice';
import { Alignment, Word, Corpus, Link } from 'structs';

import findRelatedAlignments from 'helpers/findRelatedAlignments';
import findWordById from 'helpers/findWord';

interface TextSegmentProps {
  word: Word;
}

const defaultStyle = { cursor: 'pointer' };
const focusedStyle = { textDecoration: 'underline' };
const selectedStyle = { backgroundColor: 'lightgrey' };
const relatedStyle = { webkitTextStroke: '1px black' };

const computeStyle = (
  isHovered: boolean,
  isSelected: boolean,
  isRelated: boolean
): Record<string, string> => {
  let computedStyle = { ...defaultStyle };

  if (isHovered) {
    computedStyle = { ...computedStyle, ...focusedStyle };
  }

  if (isSelected) {
    computedStyle = { ...computedStyle, ...selectedStyle };
  }

  if (isRelated) {
    computedStyle = { ...computedStyle, ...relatedStyle };
  }

  return computedStyle;
};

const isCleanSlateMode = (mode: AlignmentMode) => {
  return mode === AlignmentMode.CleanSlate;
};

export const TextSegment = (props: TextSegmentProps): ReactElement => {
  const { word } = props;

  useDebug('TextSegmentComponent');

  const dispatch = useAppDispatch();

  const alignments = useAppSelector((state) => {
    return state.alignment.present.alignments;
  });

  const mode = useAppSelector((state) => {
    return state.alignment.present.mode;
  });

  const isHovered = useAppSelector(
    (state) => state.textSegmentHover.hovered?.id === word.id
  );

  const isSelected = Boolean(
    useAppSelector((state) => {
      return state.alignment.present.selectedTextSegments.find((word: Word) => {
        return word.id === props.word.id;
      });
    })
  );

  console.log('isSelected?', isSelected);

  const isRelated = Boolean(
    useAppSelector((state) => {
      if (word) {
        const relatedAlignment = state.textSegmentHover.relatedAlignments.find(
          (alignment: Alignment) => {
            return (
              alignment.source === word.corpusId ||
              alignment.target === word.corpusId
            );
          }
        );

        const relatedLink = relatedAlignment?.links.filter((link: Link) => {
          return (
            link.sources.includes(word.id) || link.targets.includes(word.id)
          );
        });

        return Boolean(relatedLink?.length);
      }
    })
  );

  const link = useAppSelector((state) => {
    let foundLink = null;

    if (word) {
      const possibleAlignments = state.alignment.present.alignments.filter(
        (alignment: Alignment) => {
          return (
            alignment.source === word.corpusId ||
            alignment.target === word.corpusId
          );
        }
      );
      for (const alignment of possibleAlignments) {
        for (const link of alignment.links) {
          if (
            link.sources.includes(word.id) ||
            link.targets.includes(word.id)
          ) {
            foundLink = link;
          }
        }
      }
    }
    return foundLink;
  });

  const isLinked = Boolean(link);

  const corpora = useAppSelector((state) => {
    return state.polyglot.corpora;
  });

  const computedStyle = computeStyle(isHovered, isSelected, isRelated);

  if (!word) {
    return <span>{'ERROR'}</span>;
  }
  return (
    <React.Fragment>
      <span> </span>
      <span
        className="text-segment"
        style={computedStyle}
        onMouseEnter={() => {
          dispatch(hover(word));
          dispatch(relatedAlignments(findRelatedAlignments(alignments, word)));
        }}
        onMouseLeave={() => {
          dispatch(hover(null));
          dispatch(relatedAlignments([]));
        }}
        onClick={() => {
          if (link && isLinked && isCleanSlateMode(mode)) {
            console.log('LINK!', link);
            const sourceWords = link.sources
              .map((source) => findWordById(corpora, source))
              .filter((x): x is Word => x !== null);

            console.log('sourceWords', sourceWords);
            const targetWords = link.targets
              .map((target) => findWordById(corpora, target))
              .filter((x): x is Word => x !== null);

            console.log('targetWords', targetWords, link.targets);
            const words = sourceWords.concat(targetWords);
            console.log('words', words);
            dispatch(toggleAllLinkSegments(words));
            dispatch(setAlignmentMode(AlignmentMode.Edit));
          } else {
            dispatch(toggleTextSegment(word));
          }
        }}
      >
        {props.word.text}
      </span>
      <span> </span>
    </React.Fragment>
  );
};

export default TextSegment;
