import React from 'react';
import { render, screen } from '@testing-library/react';
import OfflineIndicator from '../components/OfflineIndicator';

describe('OfflineIndicator Component', () => {
  it('renders without crashing when online', () => {
    Object.defineProperty(navigator, 'onLine', {
      configurable: true,
      value: true,
    });
    const { container } = render(<OfflineIndicator />);
    expect(container).toBeInTheDocument();
  });
});
