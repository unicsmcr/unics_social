import { Box } from '@material-ui/core';
import React from 'react';
import Footer from './Footer';

export default function Page({ children }) {
	return (
		<>
			<Box>
				{ children }
			</Box>
			<Footer />
		</>
	);
}
