import { ReactElement, Fragment } from 'react';

import useDebug from 'hooks/useDebug';
import { useAppDispatch, useAppSelector } from 'app/hooks';
// import { } from '';

interface LinkBuilderProps {}

export const LinkBuilderComponent = (props: LinkBuilderProps): ReactElement => {
  useDebug('LinkBuilderComponent');
  return (
    <Fragment>
      <p>The new link builder</p>
    </Fragment>
  );
};

export default LinkBuilderComponent;
