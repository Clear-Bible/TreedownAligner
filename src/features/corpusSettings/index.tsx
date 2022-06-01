import { useState } from 'react';
import {
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@mui/material';

import useDebug from 'hooks/useDebug';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { changeCorpusViewport } from 'state/app.slice';

interface CorpusSettingsProps {
  currentCorpusId: string | null;
  viewportIndex: number;
}

const CorpusSettingsComponent = (props: CorpusSettingsProps) => {
  useDebug('CorpusSettings');

  const { currentCorpusId, viewportIndex } = props;

  const [selectedCorpusId, setSelectedCorpusId] = useState(currentCorpusId);

  const dispatch = useAppDispatch();

  const corpora = useAppSelector((state) => {
    return state.alignment.present.corpora;
  });

  return (
    <>
      <Typography variant="h6">Settings</Typography>
      <FormControl fullWidth style={{ marginTop: '12px' }}>
        <InputLabel id="select-corpus-input">Corpus</InputLabel>
        <Select
          size="small"
          labelId="select-corpus-label"
          id="select-corpus"
          value={selectedCorpusId}
          label="Corpus"
          onChange={(event) => {
            console.log('onChange', event.target.value);
            setSelectedCorpusId(event.target.value);
          }}
        >
          {corpora.map((corpus) => {
            return <MenuItem key={corpus.id} value={corpus.id}>{corpus.name}</MenuItem>;
          })}
        </Select>
        <Button
          disabled={!selectedCorpusId || selectedCorpusId === currentCorpusId}
          onClick={() => {
            dispatch(
              changeCorpusViewport({
                viewportIndex,
                newViewport: { corpusId: selectedCorpusId },
              })
            );
          }}
        >
          Update
        </Button>
      </FormControl>
    </>
  );
};

export default CorpusSettingsComponent;
