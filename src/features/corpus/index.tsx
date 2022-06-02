import { ReactElement, useState } from 'react';
import { Tooltip, Typography, IconButton } from '@mui/material';
import { InfoOutlined, Settings } from '@mui/icons-material';

import useDebug from 'hooks/useDebug';
import { useAppSelector } from 'app/hooks';
import TextSegment from 'features/textSegment';
import Treedown from 'features/treedown';
import CorpusSettings from 'features/corpusSettings';

import { Word, Corpus, CorpusViewType, TreedownType } from 'structs';

interface CorpusProps {
  corpusId: string | null;
  viewportIndex: number;
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
  const { corpusId, viewportIndex } = props;
  useDebug('TextComponent');

  const [showSettings, setShowSettings] = useState(false);

  const corpus = useAppSelector((state) => {
    return state.alignment.present.corpora.find((corpus) => {
      return corpus.id === corpusId;
    });
  });

  if (!corpusId || !corpus) {
    return <Typography>Empty State</Typography>;
  }

  return (
    <>
      <div
        style={{
          display: 'flex',
          width: 'fit-content',
          justifyContent: 'flex-end',
          alignItems: 'center',
          backdropFilter: 'blur(2px)',
          paddingTop: '0.5rem',
          paddingRight: '0.5rem',
          paddingBottom: '0px',
          marginLeft: 'auto',
          marginBottom: '0px',
          borderRadius: '500px',
          fontWeight: 'regular',
          position: 'sticky',
          top: '0',
        }}
      >
        <Typography variant="h6" display="inline-block" style={{}}>
          {corpus.name}
        </Typography>

        <Tooltip
          title={
            <>
              <Typography variant="h6">{corpus.fullName}</Typography>
              <Typography>{corpus.name}</Typography>
              <Typography>Language: {corpus.language}</Typography>
            </>
          }
        >
          <div style={{ display: 'inline-block' }}>
            <InfoOutlined
              style={{ padding: '2px', marginTop: '6px', marginLeft: '4px' }}
            />
          </div>
        </Tooltip>
        <IconButton
          style={{
            marginLeft: '-8px',
            marginRight: '-24px',
          }}
          onClick={() => {
            setShowSettings(!showSettings);
          }}
        >
          <Settings />
        </IconButton>
      </div>

      {showSettings && (
        <CorpusSettings
          currentCorpusId={corpusId}
          viewportIndex={viewportIndex}
        />
      )}

      {!showSettings && determineCorpusView(corpus)}
    </>
  );
};

export default CorpusComponent;
