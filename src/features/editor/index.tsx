import { ReactElement, Fragment } from 'react';

import { Provider } from 'react-redux';
import { store } from 'app/store';

import Editor from './editor';
import { Alignment, Corpus } from 'structs';

interface EditorWrapperProps {
  corpora: Corpus[];
  alignments: Alignment[];
}

export const EditorWrapper = (props: EditorWrapperProps): ReactElement => {
  return (
    <Fragment>
      <Provider store={store}>
        <Editor corpora={props.corpora} alignments={props.alignments} />
      </Provider>
    </Fragment>
  );
};

export default EditorWrapper;
