import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Footer from './Footer';
import AutoAppBar from './AutoAppBar';

export default function Page({ children }) {
	return (
		<>
			<CssBaseline />
			<AutoAppBar />
			{ children }
			<Footer />
		</>
	);
}
