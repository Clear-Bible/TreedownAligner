import React, { ReactElement } from 'react';
// import GridLayout from 'react-grid-layout';
import { Card, Container, Stack } from '@mui/material';

import { useAppSelector } from 'app/hooks';
import useDebug from 'hooks/useDebug';
import CorpusComponent from 'features/corpus';
import { Corpus } from 'structs';

// import cssVar from 'styles/cssVar';

import './styles.css';

export const Polyglot = (): ReactElement => {
  useDebug('PolyglotComponent');
  const corpora = useAppSelector((state) => state.alignment.present.corpora);

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

  return (
    <Stack
      direction="row"
      spacing={2}
      style={{ height: '16rem' }}
      justifyContent="stretch"
      alignItems="stretch"
    >
      {corpora.map((corpus: Corpus, index: number): ReactElement => {
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
              <CorpusComponent key={corpus.id} corpus={corpus} />
            </Container>
          </Card>
        );
      })}
    </Stack>
  );
};

export default Polyglot;
