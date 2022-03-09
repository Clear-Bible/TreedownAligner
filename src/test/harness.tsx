import { ReactElement } from 'react';
import { render, screen } from '@testing-library/react';

import { Provider } from 'react-redux';

import { store } from 'app/store';

console.log(store.getState());
export const renderWithProvider = (componentToRender: ReactElement) => {
  return render(<Provider store={store}>{componentToRender}</Provider>);
};

export { render, screen };
