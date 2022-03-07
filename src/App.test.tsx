//import React from 'react';
import { render, screen } from '@testing-library/react';

import App from './App';

test('renders the app without blowing up', () => {
  render(<App />);
  //const linkElement = screen.getByText(/learn react/i);
  //expect(linkElement).toBeInTheDocument();
});
