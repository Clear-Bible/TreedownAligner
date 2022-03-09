import { ReactElement } from 'react';
import { render, screen } from '@testing-library/react';

import { Provider } from 'react-redux';

import { store } from 'app/store';

export const renderWithProvider = (componentToRender: ReactElement) => {
  return render(<Provider store={store}>{componentToRender}</Provider>);
};

export { render, screen };
