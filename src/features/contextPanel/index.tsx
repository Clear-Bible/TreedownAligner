import React, { ReactElement } from 'react';
import GridLayout from 'react-grid-layout';

import { useAppSelector } from 'app/hooks';
import useDebug from 'hooks/useDebug';
//import Context from 'features/context';
import Treedown from 'features/treedown';
import LinkBuilderComponent from 'features/linkBuilder';

import { Corpus } from 'structs';
import cssVar from 'styles/cssVar';

export const ContextPanel = (): ReactElement => {
  useDebug('ContextPanel');
  const layout = [
    {
      i: 'a',
      x: 0,
      y: 0,
      w: 12,
      h: 12,
      minW: 12,
      maxW: 12,
      isResizeable: false,
    },
    {
      i: 'b',
      x: 12,
      y: 0,
      w: 12,
      h: 12,
      minW: 12,
      maxW: 12,
      isResizeable: false,
    },
  ];

  const theme = useAppSelector((state) => {
    return state.app.theme;
  });

  const greekCorpus =
    useAppSelector((state) => {
      return state.polyglot.corpora.find((corpus: Corpus) => {
        return corpus.id === 'sbl';
      });
    }) ?? ({} as Corpus);

  return (
    <div style={{ position: 'relative' }}>
      <GridLayout
        draggableHandle=".drag-handle"
        layout={layout}
        cols={24}
        rowHeight={12}
        width={1200}
        maxRows={1}
        compactType="horizontal"
      >
        <div
          key="a"
          style={{
            border: '1px solid',

            borderColor: cssVar('border-color', theme),
          }}
        >
          <LinkBuilderComponent />
        </div>

        <div
          key="b"
          style={{
            border: '1px solid',
            borderColor: cssVar('border-color', theme),
            overflow: 'scroll',
          }}
        >
          <Treedown corpus={greekCorpus} />;
        </div>
      </GridLayout>
    </div>
  );
};

export default ContextPanel;
