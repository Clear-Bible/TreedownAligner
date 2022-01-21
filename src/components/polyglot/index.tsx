import React, { ReactElement } from 'react';
import GridLayout from 'react-grid-layout';

export const Polyglot = (): ReactElement => {
  const layout1 = [
    {
      i: 'a',
      x: 0,
      y: 0,
      w: 6,
      h: 12,
      minW: 6,
      maxW: 6,
      isResizeable: false,
    },
    { i: 'b', x: 6, y: 0, w: 6, h: 12, minW: 6, maxW: 6, isResizeable: false },
    { i: 'c', x: 12, y: 0, w: 6, h: 12, minW: 6, maxW: 6, isResizeable: false },
    { i: 'd', x: 18, y: 0, w: 6, h: 12, minW: 6, maxW: 6, isResizeable: false },
  ];

  return (
    <React.Fragment>
      <GridLayout
        layout={layout1}
        cols={24}
        rowHeight={12}
        width={1200}
        maxRows={1}
        compactType="horizontal"
      >
        <div key="a" style={{ border: '1px solid black' }}>
          <p>Text A</p>
        </div>
        <div key="b" style={{ border: '1px solid black' }}>
          <p>Text B</p>
        </div>
        <div key="c" style={{ border: '1px solid black' }}>
          <p>Text C</p>
        </div>
        <div key="d" style={{ border: '1px solid black' }}>
          <p>Text D</p>
        </div>
      </GridLayout>
    </React.Fragment>
  );
};

export default Polyglot;
