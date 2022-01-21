import React, { ReactElement } from 'react';
import GridLayout from 'react-grid-layout';

export const ContextPanel = (): ReactElement => {
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

  return (
    <div style={{ position: 'relative' }}>
      <GridLayout
        layout={layout}
        cols={24}
        rowHeight={12}
        width={1200}
        maxRows={1}
        compactType="horizontal"
      >
        <div key="a" style={{ border: '1px solid black' }}>
          <p>Focused verse (with context)</p>
        </div>
        <div key="b" style={{ border: '1px solid black' }}>
          <p>Link builder </p>
        </div>
      </GridLayout>
    </div>
  );
};

export default ContextPanel;
