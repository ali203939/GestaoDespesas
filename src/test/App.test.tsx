import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../App';

describe('Componente App', () => {
  it('deve renderizar o título principal', () => {
    render(<App />);
    const title = screen.getByText(/Get started/i);
    expect(title).toBeInTheDocument();
  });
});