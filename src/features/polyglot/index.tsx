import { ReactElement } from 'react';
import { Card, Container, Stack, Typography } from '@mui/material';

import { useAppSelector } from 'app/hooks';
import useDebug from 'hooks/useDebug';
import CorpusComponent from 'features/corpus';
import { CorpusViewport } from 'structs';


import './styles.css';

export const Polyglot = (): ReactElement => {
  useDebug('PolyglotComponent');
  const corpora = useAppSelector((state) => state.alignment.present.corpora);

  const corpusViewports = useAppSelector((state) => {
    return state.app.corpusViewports;
  });

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
