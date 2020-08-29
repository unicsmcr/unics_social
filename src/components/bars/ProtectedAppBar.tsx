import React, { useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { Backdrop, CircularProgress, makeStyles } from '@material-ui/core';
import { setJWT } from '../../store/slices/AuthSlice';
import { useDispatch } from 'react-redux';

const useStyles = makeStyles(theme => ({
	appBar: {
		borderBottom: `1px solid ${theme.palette.divider}`
	},
	toolbar: {
		flexWrap: 'wrap'
	},
	toolbarTitle: {
		flexGrow: 1
	},
	link: {
		margin: theme.spacing(1, 1.5)
	},
	backdrop: {
		zIndex: theme.zIndex.drawer + 1,
		color: '#fff'
	}
}));

export default function ProtectedAppBar() {
	const classes = useStyles();
	const [loggingOut, setLoggingOut] = useState(false);
	const dispatch = useDispatch();

	const logout = () => {
		setLoggingOut(true);
		setTimeout(() => {
			dispatch(setJWT(null));
		}, 1000);
	};

	return (
		<AppBar position="static" color="default" elevation={0} className={classes.appBar}>
			<Toolbar className={classes.toolbar}>
				<Typography variant="h6" color="textPrimary" noWrap className={classes.toolbarTitle}>
					UniCS KB
				</Typography>
				<nav>
				</nav>
				<Button href="#" color="primary" variant="contained" className={classes.link} onClick={logout}>
					Logout
				</Button>
			</Toolbar>
			<Backdrop open={loggingOut} className={classes.backdrop}>
				<CircularProgress color="inherit" />
			</Backdrop>
		</AppBar>
	);
}
