import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders copyright', () => {
	const { getByText } = render(<App />);
	const copyright = getByText(/Copyright/i);
	expect(copyright).toBeInTheDocument();
});
