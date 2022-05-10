import {  Fragment } from 'react';

import { Provider } from 'react-redux';
import { store } from 'app/store';

import Editor from './editor';
import Themed from 'features/themed';
import { Alignment, Corpus } from 'structs';

import './styles.css';

interface EditorWrapperProps {
  corpora: Corpus[];
  alignments: Alignment[];
  theme: 'night' | 'day';
  alignmentUpdated: Function;
}

const EditorWrapper = (props: EditorWrapperProps): any => {
  const { theme } = props;

  return (
    <Themed theme={theme}>
      <Fragment>
        <Provider store={store}>
          <Editor
            corpora={props.corpora}
            alignments={props.alignments}
            theme={props.theme}
            alignmentUpdated={props.alignmentUpdated}
          />
        </Provider>
      </Fragment>
    </Themed>
  );
};

export default EditorWrapper;
