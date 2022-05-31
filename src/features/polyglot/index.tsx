import React, { ReactElement } from 'react';
import {
  Card,
  Container,
  Stack,
  Button,
  ButtonGroup,
  Typography,
} from '@mui/material';
import { Add, Remove } from '@mui/icons-material';

import { useAppSelector } from 'app/hooks';
import useDebug from 'hooks/useDebug';
import CorpusComponent from 'features/corpus';
import { Corpus, CorpusViewport } from 'structs';

// import cssVar from 'styles/cssVar';

import './styles.css';

export const Polyglot = (): ReactElement => {
  useDebug('PolyglotComponent');
  const corpora = useAppSelector((state) => state.alignment.present.corpora);

  const corpusViewports = useAppSelector((state) => {
    return state.app.corpusViewports;
  });

  // const layoutRange = Array.from({ length: corpora.length }, (x, i) => i);

  // const layout = layoutRange.map((key: number) => {
  //   const width = 24 / corpora.length;
  //   const x = width * key;
  //
  //   return {
  //     i: `text_${key}`,
  //     x,
  //     y: 0,
  //     w: width === 24 ? 8 : width,
  //     h: 12,
  //     minW: width,
  //     maxW: width,
  //     isResizable: false,
  //   };
  // });
  //
  // const theme = useAppSelector((state) => {
  //   return state.app.theme;
  // });
  //
  // if (corpusViewports.length === 0) {
  //   return <Typography>To begin, add a corpus viewport.</Typography>;
  // }

  return (
    <Stack
      direction="row"
      spacing={2}
      style={{ height: '16rem' }}
      justifyContent="stretch"
      alignItems="stretch"
    >
      {corpusViewports.length === 0 && (
        <Typography variant="h6" style={{ margin: 'auto' }}>
          To begin, add a corpus viewport.
        </Typography>
      )}

      {corpora.length &&
        corpusViewports.map(
          (corpusViewport: CorpusViewport, index: number): ReactElement => {
            const corpusId = corpusViewport.corpusId;
            const key = `text_${index}`;
            return (
              <Card
                elevation={2}
                className="corpus-container corpus-scroll-container"
                key={key}
                style={{
                  flexGrow: '1',
                  flexBasis: '0',
                  minWidth: '16rem',
                  overflowY: 'scroll',
                  overflowX: 'scroll',
                  msOverflowStyle: 'none',
                }}
              >
                <Container>
                  <CorpusComponent
                    key={corpusId}
                    corpusId={corpusId}
                    viewportIndex={index}
                  />
                </Container>
              </Card>
            );
          }
        )}
    </Stack>
  );
};

export default Polyglot;
