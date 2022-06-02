import { ReactElement, useRef } from 'react';
import { Card, Container, Stack, Typography } from '@mui/material';

import { useAppSelector } from 'app/hooks';
import useDebug from 'hooks/useDebug';
import CorpusComponent from 'features/corpus';
import { CorpusViewport } from 'structs';

import './styles.css';

export const Polyglot = (): ReactElement => {
  useDebug('PolyglotComponent');

  const scrollLock = useAppSelector((state) => state.app.scrollLock);
  const corpora = useAppSelector((state) => state.alignment.present.corpora);
  const corpusViewports = useAppSelector((state) => {
    return state.app.corpusViewports;
  });

  const initialArray: HTMLDivElement[] = [];
  const corpusViewportRefs = useRef(initialArray);

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
                onScroll={(e) => {
                  if (scrollLock) {
                    const newScrollTop = (e.target as HTMLDivElement).scrollTop;
                    console.log(newScrollTop);
                    corpusViewportRefs.current.forEach((ref) => {
                      ref.scrollTop = newScrollTop;
                    });
                  }
                }}
                ref={(el) => {
                  if (el) {
                    corpusViewportRefs.current[index] = el;
                  }
                }}
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
