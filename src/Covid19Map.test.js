import React from 'react';
import { render } from '@testing-library/react';
import Covid19Map from './Covid19Map';

test('renders learn react link', () => {
  const { getByText } = render(<Covid19Map />);
  const linkElement = getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
