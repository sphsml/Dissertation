import { render, act, screen } from '@testing-library/react';
import { useCustomCursor } from '../utils/useCustomCursor';
import React from 'react';

const TestComponent = () => {
  const { mousePosition, showCursor } = useCustomCursor();

  return (
    <div>
      <span data-testid="position">
        {mousePosition.x},{mousePosition.y}
      </span>
      <span data-testid="showCursor">{showCursor ? 'true' : 'false'}</span>
    </div>
  );
};

describe('useCustomCursor', () => {
  beforeEach(() => {
    // Clear all cookies and styles before each test
    document.cookie = '';
    document.body.style.cursor = 'auto';
  });

  it('should default to false and position (0,0) with no cookie', () => {
    render(<TestComponent />);
    expect(screen.getByTestId('showCursor').textContent).toBe('false');
    expect(screen.getByTestId('position').textContent).toBe('0,0');
    expect(document.body.style.cursor).toBe('auto');
  });

  it('should enable custom cursor if cookie is set', () => {
    document.cookie = `accessibility=${encodeURIComponent(
      JSON.stringify({ custom_cursor: true })
    )}`;

    render(<TestComponent />);
    expect(screen.getByTestId('showCursor').textContent).toBe('true');
    expect(document.body.style.cursor).toBe('none');
  });

  it('should track mouse movement when cursor is shown', () => {
    document.cookie = `accessibility=${encodeURIComponent(
      JSON.stringify({ custom_cursor: true })
    )}`;

    render(<TestComponent />);
    act(() => {
      window.dispatchEvent(new MouseEvent('mousemove', { clientX: 100, clientY: 150 }));
    });

    expect(screen.getByTestId('position').textContent).toBe('100,150');
  });
});