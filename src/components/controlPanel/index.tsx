import React, { ReactElement } from 'react';
import GridLayout from 'react-grid-layout';

export const ControlPanel = (): ReactElement => {
  const layout = [
    {
      i: 'a',
      x: 0,
      y: 0,
      w: 24,
      h: 4,
      minW: 24,
      maxW: 24,
      isResizeable: false,
      static: true,
    },
  ];

  return (
    <React.Fragment>
      <GridLayout
        layout={layout}
        cols={24}
        rowHeight={4}
        width={1200}
        maxRows={1}
      >
        <div
          key="a"
          style={{
            border: '1px solid black',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          <button>Link</button>
          <button>Unlink</button>
        </div>
      </GridLayout>
    </React.Fragment>
  );
};

export default ControlPanel;
