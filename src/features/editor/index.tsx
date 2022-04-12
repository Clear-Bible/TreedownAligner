import { ReactElement, Fragment } from 'react';

import { Provider } from 'react-redux';
import { store } from 'app/store';

import Editor from './editor';
import { Alignment, Corpus } from 'structs';

interface EditorWrapperProps {
  corpora: Corpus[];
  alignments: Alignment[];
  theme: 'night' | 'day';
  alignmentUpdated: Function;
}

const EditorWrapper = (props: EditorWrapperProps): ReactElement => {
  return (
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
  );
};

export default EditorWrapper;
