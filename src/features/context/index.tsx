import React, { ReactElement } from 'react';
import useDebug from 'hooks/useDebug';

import DragHandle from 'features/dragHandle';

interface TextProps {
  anteText: string;
  text: string;
  postText: string;
  name: string;
}

export const Context = (props: TextProps): ReactElement => {
  useDebug('ContextComponent');
  return (
    <div>
      <div
        style={{
          textAlign: 'right',
          padding: '0.7rem',
          paddingBottom: '0rem',
        }}
      >
        {props.name}
      </div>
      <p
        style={{
          paddingBottom: '0.5rem',
          paddingLeft: '0.7rem',
          paddingRight: '0.7rem',
        }}
      >
        <span>{props.anteText}</span>
        <span> </span>
        <span style={{ backgroundColor: 'lightgray' }}>{props.text}</span>
        <span> </span>
        <span>{props.postText}</span>
      </p>
      <DragHandle />
    </div>
  );
};

export default Context;
