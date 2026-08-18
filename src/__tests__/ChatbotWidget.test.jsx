import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ChatbotWidget from '../components/ChatbotWidget';

describe('ChatbotWidget Component (Gemini Copilot)', () => {
  it('renders floating launcher button initially', () => {
    render(<ChatbotWidget activeSection="plantillas" />);
    const launchButton = screen.getByRole('button');
    expect(launchButton).toBeInTheDocument();
  });

  it('opens chat window when clicked', () => {
    render(<ChatbotWidget activeSection="plantillas" />);
    const launchButton = screen.getByRole('button');
    fireEvent.click(launchButton);

    expect(screen.getByText(/SurveySaaS Copilot/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Pregúntale a Gemini.../i)).toBeInTheDocument();
  });

  it('displays quick suggestion prompt chips', () => {
    render(<ChatbotWidget activeSection="plantillas" />);
    const launchButton = screen.getByRole('button');
    fireEvent.click(launchButton);

    expect(screen.getByText(/Crear una plantilla de satisfacción/i)).toBeInTheDocument();
  });
});
