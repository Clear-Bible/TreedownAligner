import React, { ReactElement, useState } from 'react';

interface TextSegmentProps {
  segment: string;
}

const defaultStyle = { cursor: 'pointer' };
const focusedStyle = {
  ...defaultStyle,
  textDecoration: 'underline',
};

export const TextSegment = (props: TextSegmentProps): ReactElement => {
  const [isHovered, setIsHovered] = useState(false);

  const computedStyle = isHovered ? focusedStyle : defaultStyle;

  return (
    <React.Fragment>
      <span> </span>
      <span
        style={computedStyle}
        onMouseEnter={() => {
          setIsHovered(true);
        }}
        onMouseLeave={() => {
          setIsHovered(false);
        }}
      >
        {props.segment}
      </span>
      <span> </span>
    </React.Fragment>
  );
};

export default TextSegment;
