import React, { ReactElement } from 'react';

interface TextProps {
  text: string;
  name: string;
}

export const Text = (props: TextProps): ReactElement => {
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
        {props.text}
      </p>
    </div>
  );
};

export default Text;
