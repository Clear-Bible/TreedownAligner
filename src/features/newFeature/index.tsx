import { ReactElement, Fragment } from 'react';

// import { useAppDispatch, useAppSelector } from 'app/hooks';
// import { } from '';

interface NewFeatureProps {}

export const NewFeatureComponent = (props: NewFeatureProps): ReactElement => {
  return (
    <Fragment>
      <p>New Feature</p>
    </Fragment>
  );
};

export default NewFeatureComponent;
