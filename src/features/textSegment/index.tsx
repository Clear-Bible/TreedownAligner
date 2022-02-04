import React, { ReactElement } from 'react';

import useDebug from 'hooks/useDebug';

import { useAppDispatch, useAppSelector } from 'app/hooks';
import {
  hover,
  toggleTextSegment,
} from 'features/textSegment/textSegment.slice';

interface TextSegmentProps {
  segment: string;
  id: string;
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

  const isSelected = useAppSelector((state) =>
    state.textSegment.selectedTextSegments.includes(props.id)
  );

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
          dispatch(toggleTextSegment(props.id));
        }}
      >
        {props.segment}
      </span>
      <span> </span>
    </React.Fragment>
  );
};

export default TextSegment;
