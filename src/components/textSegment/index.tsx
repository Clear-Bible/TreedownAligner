import React, { ReactElement, useState } from 'react';
import { useRecoilState } from 'recoil';

import { currentFocus } from 'state/atoms';

interface TextSegmentProps {
  id: string;
  text: string;
}

const defaultStyle = { cursor: 'pointer' };
const focusedStyle = {
  ...defaultStyle,
  textDecoration: 'underline',
};

export const TextSegmentComponent = (props: TextSegmentProps): ReactElement => {
  console.log('render');

  const { id } = props;

  const [currentFocusState, setCurrentFocus] = useRecoilState(currentFocus);

  const isFocused = currentFocusState?.id === props.id;

  const computedStyle = isFocused ? focusedStyle : defaultStyle;

  return (
    <React.Fragment>
      <span> </span>
      <span
        style={computedStyle}
        onMouseEnter={() => {
          setCurrentFocus({ id });
        }}
        onMouseLeave={() => {
            setCurrentFocus({id: null});
        }}
      >
        {props.text}
      </span>
      <span> </span>
    </React.Fragment>
  );
};

export default TextSegmentComponent;
