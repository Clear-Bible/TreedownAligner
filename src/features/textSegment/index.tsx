import React, { ReactElement } from 'react';

import useDebug from 'hooks/useDebug';

import { useAppDispatch, useAppSelector } from 'app/hooks';
import { toggleTextSegment } from 'state/alignment.slice';
import { hover, relatedAlignments } from 'state/textSegmentHover.slice';
import { Alignment, Word, Text, Link } from 'structs';
import findRelatedAlignments from 'helpers/findRelatedAlignments';

interface TextSegmentProps {
  id: string;
  textId: string;
  segment: string;
}

const defaultStyle = { cursor: 'pointer' };
const focusedStyle = { textDecoration: 'underline' };
const selectedStyle = { backgroundColor: 'lightgrey' };
const linkedStyle = { webkitTextStroke: '1px black' };

const computeStyle = (
  isHovered: boolean,
  isSelected: boolean,
  isLinked: boolean
): Record<string, string> => {
  let computedStyle = { ...defaultStyle };

  if (isHovered) {
    computedStyle = { ...computedStyle, ...focusedStyle };
  }

  if (isSelected) {
    computedStyle = { ...computedStyle, ...selectedStyle };
  }

  if (isLinked) {
    computedStyle = { ...computedStyle, ...linkedStyle };
  }

  return computedStyle;
};

export const TextSegment = (props: TextSegmentProps): ReactElement => {
  const { id } = props;

  useDebug('TextSegmentComponent');

  const dispatch = useAppDispatch();

  const word = useAppSelector((state) => {
    return state.polyglot.texts
      .find((text: Text) => {
        return text.id === props.textId;
      })
      ?.words.find((word: Word) => {
        return word.id === props.id;
      });
  });

  const alignments = useAppSelector((state) => {
    return state.polyglot.alignments;
  });

  const isHovered = useAppSelector(
    (state) => state.textSegmentHover.hovered?.id === id
  );

  const isSelected = Boolean(
    useAppSelector((state) => {
      return state.alignment.present.selectedTextSegments.find(
        (word: Word) => {
          if (props.id === 'sbl_9') {
            console.log(word.id, props.id, word.id === props.id);
          }
          return word.id === props.id;
        }
      );
    })
  );

  const isLinked = Boolean(
    useAppSelector((state) => {
      if (word) {
        const relatedAlignment = state.textSegmentHover.relatedAlignments.find(
          (alignment: Alignment) => {
            return (
              alignment.source === props.textId ||
              alignment.target === props.textId
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

  const computedStyle = computeStyle(isHovered, isSelected, isLinked);

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
          if (word) {
            dispatch(toggleTextSegment(word));
          }
        }}
      >
        {props.segment}
      </span>
      <span> </span>
    </React.Fragment>
  );
};

export default TextSegment;
