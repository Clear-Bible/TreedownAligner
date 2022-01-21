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
        <div key="a" style={{ border: '1px solid black' }}>
          <p>Control Panel</p>
        </div>
      </GridLayout>
    </React.Fragment>
  );
};

export default ControlPanel;
