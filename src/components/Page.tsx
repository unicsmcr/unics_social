import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import PublicAppBar from './bars/PublicAppBar';
import Footer from './Footer';

export default function Page({ children }) {
	return (
		<>
			<CssBaseline />
			<PublicAppBar />
			{ children }
			<Footer />
		</>
	);
}
