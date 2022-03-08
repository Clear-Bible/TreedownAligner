import React, { ReactElement } from 'react';
import GridLayout from 'react-grid-layout';

import { useAppSelector } from 'app/hooks';
import useDebug from 'hooks/useDebug';
import TextComponent from 'features/text';
import { Text } from 'structs';

export const Polyglot = (): ReactElement => {
  useDebug('PolyglotComponent');
  const texts = useAppSelector((state) => state.polyglot.texts);

  const layoutRange = Array.from({ length: texts.length }, (x, i) => i);

  const layout = layoutRange.map((key: number) => {
    const width = 24 / texts.length;
    const x = width * key;

    return {
      i: `text_${key}`,
      x,
      y: 0,
      w: width,
      h: 12,
      minW: width,
      maxW: width,
      isResizable: false,
    };
  });

  return (
    <React.Fragment>
      <GridLayout
        draggableHandle=".drag-handle"
        layout={layout}
        cols={24}
        rowHeight={12}
        width={1200}
        maxRows={1}
        compactType="horizontal"
      >
        {texts.map((text: Text, index: number): ReactElement => {
          const key = `text_${index}`;
          return (
            <div key={key} style={{ border: '1px solid black' }}>
              <TextComponent id={text.id} name={text.name} words={text.words} />
            </div>
          );
        })}
      </GridLayout>
    </React.Fragment>
  );
};

export default Polyglot;
