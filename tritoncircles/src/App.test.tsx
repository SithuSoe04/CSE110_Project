import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

test.skip('checks if navbar exists', () => {
  render(<BrowserRouter><App /></BrowserRouter>);
  const navbar = screen.getByTestId('navbar'); 
  expect(navbar).toBeInTheDocument();
});