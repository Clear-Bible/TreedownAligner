import { ReactElement, useState } from 'react';
import { ActionCreators } from 'redux-undo';
import {
  Button,
  ButtonGroup,
  Tooltip,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  Stack,
} from '@mui/material';

import {
  AddLink,
  LinkOff,
  RestartAlt,
  Redo,
  Undo,
  Save,
  Park,
  Add,
  Remove,
  SyncLock,
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

import {
  addCorpusViewport,
  removeCorpusViewport,
  toggleScrollLock,
} from 'state/app.slice';

interface ControlPanelProps {
  alignmentUpdated: Function;
}

export const ControlPanel = (props: ControlPanelProps): ReactElement => {
  useDebug('ControlPanel');
  const dispatch = useAppDispatch();

  const [formats, setFormats] = useState([] as string[]);

  const scrollLock = useAppSelector((state) => state.app.scrollLock);

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

  const currentCorpusViewports = useAppSelector((state) => {
    return state.app.corpusViewports;
  });

  const corporaWithoutViewport = corpora.filter((corpus) => {
    const currentViewportIds = currentCorpusViewports.map(
      (viewport) => viewport.corpusId
    );
    return !currentViewportIds.includes(corpus.id);
  });

  const someSyntax = useAppSelector((state) => {
    return state.alignment.present.corpora.some((corpus) => {
      return Boolean(corpus.syntax);
    });
  });

  const alignmentState = useAppSelector((state) => {
    return state.alignment.present.alignments;
  });

  if (scrollLock && !formats.includes('scroll-lock')) {
    setFormats(formats.concat(['scroll-lock']));
  }
  return (
    <Stack
      direction="row"
      spacing={2}
      justifyContent="center"
      alignItems="baseline"
      style={{ marginTop: '16px', marginBottom: '16px' }}
    >
      <ToggleButtonGroup
        size="small"
        value={formats}
        // For later.
        // onChange={(
        //   event: React.MouseEvent<HTMLElement>,
        //   newFormats: string[]
        // ) => {}}
      >
        <ToggleButton
          value="tree"
          disabled={!someSyntax || currentCorpusViewports.length === 0}
          onClick={() => {
            if (someSyntax) {
              if (formats.includes('tree')) {
                setFormats(formats.filter((format) => format !== 'tree'));
              } else {
                setFormats(formats.concat(['tree']));
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

        <ToggleButton
          value="scroll-lock"
          onClick={() => {
            if (formats.includes('scroll-lock')) {
              setFormats(formats.filter((item) => item !== 'scroll-lock'));
            } else {
              setFormats(formats.concat(['scroll-lock']));
            }

            dispatch(toggleScrollLock());
          }}
        >
          <SyncLock />
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
            disabled={currentCorpusViewports.length === 0}
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
            disabled={currentCorpusViewports.length === 0}
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
          disabled={currentCorpusViewports.length === 0}
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

      <ButtonGroup>
        <Tooltip
          placement="top"
          arrow
          open={currentCorpusViewports.length === 0}
          title={
            <>
              <Typography color="info.light">Click here</Typography>
              <Typography>to add a corpus viewport.</Typography>
            </>
          }
        >
          <Tooltip
            title="Add corpus viewport"
            arrow
            describeChild
            disableHoverListener={currentCorpusViewports.length === 0}
          >
            <Button
              variant="contained"
              onClick={() => {
                dispatch(
                  addCorpusViewport({
                    availableCorpora: corporaWithoutViewport.map(
                      (corpus) => corpus.id
                    ),
                  })
                );
              }}
            >
              <Add />
            </Button>
          </Tooltip>
        </Tooltip>
        <Tooltip title="Remove a corpus viewport" arrow describeChild>
          <Button
            variant="contained"
            disabled={currentCorpusViewports.length === 0}
            onClick={() => {
              dispatch(removeCorpusViewport());
            }}
          >
            <Remove />
          </Button>
        </Tooltip>
      </ButtonGroup>
    </Stack>
  );
};

export default ControlPanel;
