import { ReactElement, Fragment } from 'react';

import { Provider } from 'react-redux';
import { store } from 'app/store';

import Editor from './editor';
import { Alignment, Text } from 'structs';

interface EditorWrapperProps {
  texts: Text[];
  alignments: Alignment[];
}

export const EditorWrapper = (props: EditorWrapperProps): ReactElement => {
  return (
    <Fragment>
      <Provider store={store}>
        <Editor texts={props.texts} alignments={props.alignments} />
      </Provider>
    </Fragment>
  );
};

export default EditorWrapper;
