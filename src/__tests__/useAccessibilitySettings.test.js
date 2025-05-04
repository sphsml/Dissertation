import { render, waitFor, screen } from '@testing-library/react';
import React from 'react';
import useAccessibilitySettings from '../utils/useAccessibilitySettings';

const TestComponent = () => {
  const settings = useAccessibilitySettings();

  return (
    <pre data-testid="settings">
      {settings ? JSON.stringify(settings) : 'null'}
    </pre>
  );
};

describe('useAccessibilitySettings', () => {
  beforeEach(() => {
    document.cookie = '';
  });

  it('returns empty object if no accessibility cookie is present', async () => {
    render(<TestComponent />);

    await waitFor(() =>
      expect(screen.getByTestId('settings').textContent).toBe('{}')
    );
  });

  it('parses and returns data from valid accessibility cookie', async () => {
    const mockSettings = { highContrast: true, fontSize: 'large' };
    document.cookie = `accessibility=${encodeURIComponent(
      JSON.stringify(mockSettings)
    )}`;

    render(<TestComponent />);

    await waitFor(() =>
      expect(screen.getByTestId('settings').textContent).toBe(
        JSON.stringify(mockSettings)
      )
    );
  });

  it('returns empty object if accessibility cookie has invalid JSON', async () => {
    document.cookie = 'accessibility=%7BinvalidJSON';

    render(<TestComponent />);

    await waitFor(() =>
      expect(screen.getByTestId('settings').textContent).toBe('{}')
    );
  });
});