import React, { ReactElement } from 'react';
import GridLayout from 'react-grid-layout';
import { Card } from '@mui/material';

import { useAppSelector } from 'app/hooks';
import useDebug from 'hooks/useDebug';
//import Context from 'features/context';
import Treedown from 'features/treedown';
import LinkBuilderComponent from 'features/linkBuilder';

import { Corpus, TreedownType } from 'structs';
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
      const syntaxCorpora = ['sbl', 'nestle1904'];
      return state.alignment.present.corpora.find((corpus: Corpus) => {
        return syntaxCorpora.includes(corpus.id);
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
        <Card
          elevation={6}
          key="a"
          // style={{
          //   borderColor: cssVar('border-color', theme),
          // }}
        >
          <LinkBuilderComponent />
        </Card>

        <Card
          elevation={6}
          key="b"
          style={{
            overflow: 'scroll',
          }}
        >
          <Treedown corpus={greekCorpus} treedownType={TreedownType.Source} />;
        </Card>
      </GridLayout>
    </div>
  );
};

export default ContextPanel;
