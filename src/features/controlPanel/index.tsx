import React, { ReactElement } from 'react';
import GridLayout from 'react-grid-layout';
import { ActionCreators } from 'redux-undo';
import { Button, ButtonGroup, Tooltip } from '@mui/material';
import {
  AddLink,
  LinkOff,
  RestartAlt,
  Redo,
  Undo,
  Save,
} from '@mui/icons-material';

import { useAppDispatch, useAppSelector } from 'app/hooks';
import useDebug from 'hooks/useDebug';
import {
  resetTextSegments,
  createLink,
  deleteLink,
  AlignmentMode,
} from 'state/alignment.slice';

// import cssVar from 'styles/cssVar';

interface ControlPanelProps {
  alignmentUpdated: Function;
}

export const ControlPanel = (props: ControlPanelProps): ReactElement => {
  useDebug('ControlPanel');
  const dispatch = useAppDispatch();

  const anySegmentsSelected = useAppSelector((state) =>
    Boolean(state.alignment.present.inProgressLink)
  );

  // const theme = useAppSelector((state) => {
  //   return state.app.theme;
  // });

  const mode = useAppSelector((state) => {
    return state.alignment.present.mode;
  });

  const linkHasBothSides = useAppSelector((state) => {
    return (
      Number(state.alignment.present.inProgressLink?.sources.length) > 0 &&
      Number(state.alignment.present.inProgressLink?.targets.length) > 0
    );
  });

  const alignmentState = useAppSelector((state) => {
    return state.alignment.present.alignments;
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
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <ButtonGroup>
            <Tooltip title="Create Link" arrow describeChild>
              <Button
                variant="contained"
                disabled={mode !== AlignmentMode.Edit || !linkHasBothSides}
                onClick={() => {
                  dispatch(createLink());
                }}
              >
                <AddLink />
              </Button>
            </Tooltip>
            <Tooltip title="Delete Link" arrow describeChild>
              <Button
                variant="contained"
                disabled={!(mode === AlignmentMode.Select)}
                onClick={() => {
                  dispatch(deleteLink());
                }}
              >
                <LinkOff />
              </Button>
            </Tooltip>
            <Tooltip title="Reset" arrow describeChild>
              <Button
                variant="contained"
                disabled={!anySegmentsSelected}
                onClick={() => {
                  dispatch(resetTextSegments());
                }}
              >
                <RestartAlt />
              </Button>
            </Tooltip>
          </ButtonGroup>
          <ButtonGroup>
            <Tooltip title="Undo" arrow describeChild>
              <Button
                variant="contained"
                onClick={() => {
                  dispatch(ActionCreators.undo());
                }}
              >
                <Undo />
              </Button>
            </Tooltip>

            <Tooltip title="Redo" arrow describeChild>
              <Button
                variant="contained"
                onClick={() => {
                  dispatch(ActionCreators.redo());
                }}
              >
                <Redo />
              </Button>
            </Tooltip>
          </ButtonGroup>

          <Tooltip title="Save" arrow describeChild>
            <Button
              variant="contained"
              onClick={() => {
                if (props.alignmentUpdated) {
                  props.alignmentUpdated(alignmentState);
                }
              }}
            >
              <Save />
            </Button>
          </Tooltip>
        </div>
      </GridLayout>
    </React.Fragment>
  );
};

export default ControlPanel;
