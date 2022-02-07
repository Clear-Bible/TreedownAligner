import React, { ReactElement } from 'react';

import useDebug from 'hooks/useDebug';

import { useAppDispatch, useAppSelector } from 'app/hooks';
import {
  hover,
  toggleTextSegment,
} from 'features/textSegment/textSegment.slice';
import { Word, Text } from 'structs';

interface TextSegmentProps {
  id: string;
  textId: string;
  segment: string;
}

const defaultStyle = { cursor: 'pointer' };
const focusedStyle = { textDecoration: 'underline' };
const selectedStyle = { backgroundColor: 'grey' };

const computeStyle = (
  isHovered: boolean,
  isSelected: boolean
): Record<string, string> => {
  let computedStyle = { ...defaultStyle };

  if (isHovered) {
    computedStyle = { ...computedStyle, ...focusedStyle };
  }

  if (isSelected) {
    computedStyle = { ...computedStyle, ...selectedStyle };
  }

  return computedStyle;
};

export const TextSegment = (props: TextSegmentProps): ReactElement => {
  const { id } = props;

  useDebug('TextSegmentComponent');

  const dispatch = useAppDispatch();

  const isHovered = useAppSelector(
    (state) => state.textSegment.hoveredId === id
  );

  const isSelected = Boolean(
    useAppSelector((state) =>
      state.textSegment.selectedTextSegments.find((word: Word) => {
        return word.id === props.id;
      })
    )
  );

  const word = useAppSelector((state) => {
    return state.polyglot.texts
      .find((text: Text) => {
        return text.id === props.textId;
      })
      ?.words.find((word: Word) => {
        return word.id === props.id;
      });
  });

  const computedStyle = computeStyle(isHovered, isSelected);

  return (
    <React.Fragment>
      <span> </span>
      <span
        style={computedStyle}
        onMouseEnter={() => {
          dispatch(hover(props.id));
        }}
        onMouseLeave={() => {
          dispatch(hover(null));
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
