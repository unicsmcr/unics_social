import React, { useEffect, useRef } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import AutoAppBar from './AutoAppBar';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
	root: {
		display: 'flex',
		flexDirection: 'column',
		position: 'fixed',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0
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
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const resize = () => {
			if (ref.current) {
				ref.current.style.height = `${window.innerHeight}px`;
			}
		};
		// resize();
		window.addEventListener('resize', resize);
		return () => window.removeEventListener('resize', resize);
	}, [ref]);
	return (
		<>
			<CssBaseline />
			<div className={classes.root} ref={ref}>
				<AutoAppBar />
				<div className={classes.main}>
					{ children }
				</div>
			</div>
		</>
	);
}
