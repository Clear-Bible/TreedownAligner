import React, { ReactElement, useState } from 'react';
import GridLayout from 'react-grid-layout';
import { ActionCreators } from 'redux-undo';
import {
  Button,
  ButtonGroup,
  Tooltip,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import {
  AddLink,
  LinkOff,
  RestartAlt,
  Redo,
  Undo,
  Save,
  Park,
} from '@mui/icons-material';

import { useAppDispatch, useAppSelector } from 'app/hooks';
import useDebug from 'hooks/useDebug';
import {
  resetTextSegments,
  createLink,
  deleteLink,
  toggleCorpusView,
  AlignmentMode,
} from 'state/alignment.slice';

interface ControlPanelProps {
  alignmentUpdated: Function;
}

export const ControlPanel = (props: ControlPanelProps): ReactElement => {
  useDebug('ControlPanel');
  const dispatch = useAppDispatch();

  const [formats, setFormats] = useState([] as string[]);

  const anySegmentsSelected = useAppSelector((state) =>
    Boolean(state.alignment.present.inProgressLink)
  );

  const mode = useAppSelector((state) => {
    return state.alignment.present.mode;
  });

  const linkHasBothSides = useAppSelector((state) => {
    return (
      Number(state.alignment.present.inProgressLink?.sources.length) > 0 &&
      Number(state.alignment.present.inProgressLink?.targets.length) > 0
    );
  });

  const corpora = useAppSelector((state) => {
    return state.alignment.present.corpora;
  });

  const someSyntax = useAppSelector((state) => {
    return state.alignment.present.corpora.some((corpus) => {
      return Boolean(corpus.syntax);
    });
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
          <ToggleButtonGroup
            size="small"
            value={formats}
            // onChange={(
            //   event: React.MouseEvent<HTMLElement>,
            //   newFormats: string[]
            // ) => {}}
          >
            <ToggleButton
              value="tree"
              disabled={!someSyntax}
              onClick={() => {
                if (someSyntax) {
                  if (formats.includes('tree')) {
                    setFormats([]);
                  } else {
                    setFormats(['tree']);
                  }
                  for (const corpus of corpora) {
                    if (corpus.syntax) {
                      dispatch(toggleCorpusView(corpus.id));
                    }
                  }
                }
              }}
            >
              <Park />
            </ToggleButton>
          </ToggleButtonGroup>

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
