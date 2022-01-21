import React, { ReactElement } from 'react';
import GridLayout from 'react-grid-layout';

import Text from '../text';

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
          <Text
            text="οὐ μόνον δέ, ἀλλὰ καὶ καυχώμεθα ἐν ταῖς θλίψεσιν, εἰδότες ὅτι ἡ θλῖψις ὑπομονὴν κατεργάζεται,"
            name="SBL GNT"
          />
        </div>
        <div key="b" style={{ border: '1px solid black' }}>
          <Text
            text="And not only this, but we also boast in our afflictions, because we know that affliction produces patient endurance,"
            name="LEB"
          />
        </div>
        <div key="c" style={{ border: '1px solid black' }}>
          <Text
            text="Y no solo en esto, sino también en nuestros sufrimientos, porque sabemos que el sufrimiento produce perseverancia;"
            name="NVI"
          />
        </div>
        <div key="d" style={{ border: '1px solid black' }}>
          <Text
            text="And not only in this, otherwise too in our sufferings, because we know that the suffering produces perseverance;"
            name="Back Trans"
          />
        </div>
      </GridLayout>
    </React.Fragment>
  );
};

export default Polyglot;
