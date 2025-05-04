import React from 'react';
import { render, screen } from '@testing-library/react';
import { motion } from 'framer-motion';
import CustomCursor from '../utils/CustomCursor';

jest.mock('framer-motion', () => {
  const React = require('react');
  return {
    motion: {
      div: ({ variants, animate, transition, className }) => (
        <div data-testid="cursor" className={className} data-variants={JSON.stringify(variants)} data-animate={animate} data-transition={JSON.stringify(transition)} />
      )
    }
  };
});

describe('CustomCursor', () => {
  it('renders with correct variant positions', () => {
    const mousex = 100;
    const mousey = 150;
    render(<CustomCursor mousex={mousex} mousey={mousey} />);
    
    const cursor = screen.getByTestId('cursor');
    const variants = JSON.parse(cursor.getAttribute('data-variants'));
    const transition = JSON.parse(cursor.getAttribute('data-transition'));

    expect(variants).toEqual({
      default: {
        x: mousex - 16,
        y: mousey - 16,
      },
    });

    expect(cursor.getAttribute('data-animate')).toBe('default');
    expect(transition).toEqual({ type: "spring", stiffness: 500, damping: 30 });
  });
});