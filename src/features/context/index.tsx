import React, { ReactElement } from 'react';
import useDebug from 'hooks/useDebug';

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
      <div
        className="drag-handle"
        style={{
          marginRight: '-1px',
          position: 'absolute',
          bottom: '0',
          right: '0',
          cursor: 'grab',
          height: '0.7rem',
          width: '0.7rem',
          backgroundColor: 'black',
        }}
      ></div>
    </div>
  );
};

export default Context;
