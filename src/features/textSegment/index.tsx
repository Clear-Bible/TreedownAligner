import React, { ReactElement, useState } from 'react';

import { useAppDispatch, useAppSelector } from 'app/hooks';
import { hover } from 'features/textSegment/textSegment.slice';

interface TextSegmentProps {
  segment: string;
  id: string;
}

const defaultStyle = { cursor: 'pointer' };
const focusedStyle = {
  ...defaultStyle,
  textDecoration: 'underline',
};

export const TextSegment = (props: TextSegmentProps): ReactElement => {
  const { id } = props;

  const dispatch = useAppDispatch();

  const isHovered = useAppSelector(
    (state) => state.textSegment.hoveredId === id
  );

  const computedStyle = isHovered ? focusedStyle : defaultStyle;

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
      >
        {props.segment}
      </span>
      <span> </span>
    </React.Fragment>
  );
};

export default TextSegment;
