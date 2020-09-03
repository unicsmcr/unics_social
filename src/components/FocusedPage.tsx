import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Footer from './Footer';
import AutoAppBar from './AutoAppBar';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
	root: {
		display: 'flex',
		maxHeight: '100vh',
		minHeight: '100vh',
		flexDirection: 'column'
	},
	main: {
		flexGrow: 1,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		position: 'relative'
	}
}));

export default function FocusedPage({ children }) {
	const classes = useStyles();

	return (
		<>
			<CssBaseline />
			<div className={classes.root}>
				<AutoAppBar />
				<div className={classes.main}>
					{ children }
				</div>
			</div>
			<Footer />
		</>
	);
}
