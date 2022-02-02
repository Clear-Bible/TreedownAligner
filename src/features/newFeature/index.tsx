import { ReactElement, Fragment } from 'react';

//import useDebug from 'hooks/useDebug';
// import { useAppDispatch, useAppSelector } from 'app/hooks';
// import { } from '';

interface NewFeatureProps {}

export const NewFeatureComponent = (props: NewFeatureProps): ReactElement => {
  // useDebug('NewFeatureComponent');
  return (
    <Fragment>
      <p>New Feature</p>
    </Fragment>
  );
};

export default NewFeatureComponent;
