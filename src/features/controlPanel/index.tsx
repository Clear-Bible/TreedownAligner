import React, { ReactElement } from 'react';
import GridLayout from 'react-grid-layout';
import { ActionCreators } from 'redux-undo';

import { useAppDispatch, useAppSelector } from 'app/hooks';
import useDebug from 'hooks/useDebug';
import {
  resetTextSegments,
  createLink,
  deleteLink,
} from 'state/alignment.slice';

import cssVar from 'styles/cssVar';

export const ControlPanel = (): ReactElement => {
  useDebug('ControlPanel');
  const dispatch = useAppDispatch();

  const anySegmentsSelected = useAppSelector((state) =>
    Boolean(state.alignment.present.inProgressLink)
  );

  const theme = useAppSelector((state) => {
    return state.app.theme;
  });

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
            border: '1px solid',
            borderColor: cssVar('border-color', theme),
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
          <button
            onClick={() => {
              dispatch(deleteLink());
            }}
          >
            Unlink
          </button>
          <button
            disabled={!anySegmentsSelected}
            onClick={() => {
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
