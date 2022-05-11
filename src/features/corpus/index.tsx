import { ReactElement } from 'react';
import { CardHeader, Typography } from '@mui/material';

import useDebug from 'hooks/useDebug';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import TextSegment from 'features/textSegment';
import DragHandle from 'features/dragHandle';
import Treedown from 'features/treedown';

import { toggleCorpusView } from 'state/alignment.slice';
import { Word, Corpus, CorpusViewType, TreedownType } from 'structs';

import cssVar from 'styles/cssVar';

interface CorpusProps {
  corpus: Corpus;
}

const determineCorpusView = (corpus: Corpus) => {
  if (corpus.viewType === CorpusViewType.Paragraph) {
    return (
      <Typography
        style={{
          paddingTop: '0.5rem',
          paddingBottom: '0.5rem',
          paddingLeft: '0.7rem',
          paddingRight: '0.7rem',
        }}
      >
        {corpus.words.map((word: Word): ReactElement => {
          return <TextSegment key={word.id} word={word} />;
        })}
      </Typography>
    );
  }

  if (corpus.viewType === CorpusViewType.Treedown) {
    const syntaxCorpora = ['sbl', 'nestle1904'];
    const treedownType = syntaxCorpora.includes(corpus.id)
      ? TreedownType.Source
      : TreedownType.Mapped;
    return <Treedown corpus={corpus} treedownType={treedownType} />;
  }
};

export const CorpusComponent = (props: CorpusProps): ReactElement => {
  const { corpus } = props;
  useDebug('TextComponent');

  // const dispatch = useAppDispatch();
  //
  // const theme = useAppSelector((state) => {
  //   return state.app.theme;
  // });

  return (
    <div className="corpus-scroll-container">
      <DragHandle />
      <div
        style={{
          textAlign: 'right',
          padding: '0.5rem',
          fontWeight: 'regular',
          // color: cssVar('font-color', theme),
          position: 'sticky',
          top: '0',
          // backgroundColor: cssVar('--background', theme),
        }}
      >
        <Typography variant="h6">{corpus.name}</Typography>
      </div>

      {determineCorpusView(corpus)}
    </div>
  );
};

export default CorpusComponent;
