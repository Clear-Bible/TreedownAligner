import React, { ReactElement } from 'react';

import TextSegment from 'features/textSegment';

interface TextProps {
  text: string;
  name: string;
}

export const Text = (props: TextProps): ReactElement => {
  const segments = props.text.split(' ');

  return (
    <div>
      <div style={{ textAlign: 'right', padding: '0.5rem' }}>{props.name}</div>
      <p
        style={{
          paddingTop: '0.5rem',
          paddingBottom: '0.5rem',
          paddingLeft: '0.7rem',
          paddingRight: '0.7rem',
        }}
      >
        {segments.map((segment: string, index: number): ReactElement => {
          const id = `${props.name}_${index}`;
          return <TextSegment key={id} id={id} segment={segment} />;
        })}
      </p>
    </div>
  );
};

export default Text;
