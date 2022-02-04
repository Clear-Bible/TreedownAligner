import React, { ReactElement } from 'react';
import GridLayout from 'react-grid-layout';

import useDebug from 'hooks/useDebug';
import Context from 'features/context';
import LinkBuilderComponent from 'features/linkBuilder';

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
          <Context
            anteText="Therefore, because we have been declared righteous by faith, we have peace with God through our Lord Jesus Christ, through whom also we have obtained access by faith into this grace in which we stand, and we boast in the hope of the glory of God."
            text="And not only this, but we also boast in our afflictions, because we know that affliction produces patient endurance,"
            postText="and patient endurance, proven character, and proven character, hope, and hope does not disappoint, because the love of God has been poured out in our hearts through the Holy Spirit who was given to us."
            name="LEB"
          />
        </div>
        <div key="b" style={{ border: '1px solid black' }}>
          <LinkBuilderComponent />
        </div>
      </GridLayout>
    </div>
  );
};

export default ContextPanel;
