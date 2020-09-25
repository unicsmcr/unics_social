import React, { useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
	root: {
		display: 'flex',
		flexDirection: 'column',
		position: 'absolute',
		top: theme.spacing(8),
		bottom: 0,
		left: 0,
		right: 0,
		[theme.breakpoints.down('sm')]: {
			top: theme.spacing(7)
		}
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

	/*
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
	*/
	return (
		<>
			<div className={classes.root} ref={ref}>
				<div className={classes.main}>
					{ children }
				</div>
			</div>
		</>
	);
}
