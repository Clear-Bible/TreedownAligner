import React, { ReactElement } from 'react';
import GridLayout from 'react-grid-layout';
import { ActionCreators } from 'redux-undo';

import { useAppDispatch, useAppSelector } from 'app/hooks';
import useDebug from 'hooks/useDebug';
import { resetTextSegments, createLink } from 'state/alignment.slice';

export const ControlPanel = (): ReactElement => {
  useDebug('ControlPanel');
  const dispatch = useAppDispatch();

  const anySegmentsSelected = useAppSelector((state) =>
    Boolean(state.alignment.present.inProgressLink)
  );
  const layout = [
    {
      i: 'a',
      x: 0,
      y: 0,
      w: 24,
      h: 4,
      minW: 24,
      maxW: 24,
      isResizeable: false,
      static: true,
    },
  ];

  return (
    <React.Fragment>
      <GridLayout
        layout={layout}
        cols={24}
        rowHeight={4}
        width={1200}
        maxRows={1}
      >
        <div
          key="a"
          style={{
            border: '1px solid black',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <button
            onClick={() => {
              dispatch(createLink());
            }}
          >
            Link
          </button>
          <button onClick={() => {}}>Unlink</button>
          <button
            disabled={!anySegmentsSelected}
            onClick={() => {
              console.log('dispatch the reset');
              dispatch(resetTextSegments());
            }}
          >
            Reset
          </button>
          <button
            onClick={() => {
              dispatch(ActionCreators.undo());
            }}
          >
            Undo
          </button>

          <button
            onClick={() => {
              dispatch(ActionCreators.redo());
            }}
          >
            Redo
          </button>
        </div>
      </GridLayout>
    </React.Fragment>
  );
};

export default ControlPanel;
