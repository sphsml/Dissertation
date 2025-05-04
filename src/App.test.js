import { render, screen } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const heading = screen.getByText(/One4All/i);
  expect(heading).toBeInTheDocument();
});
