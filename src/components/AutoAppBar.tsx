import React, { useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import { setJWT, selectJWT } from '../store/slices/AuthSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import { colors } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
	appBar: {
		borderBottom: `1px solid ${theme.palette.divider}`,
		background: colors.grey[800],
		color: theme.palette.getContrastText(colors.grey[800])
	},
	toolbar: {
		'flexWrap': 'wrap',
		'& a': {
			cursor: 'pointer',
			textDecoration: 'none'
		}
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

export default function AutoAppBar() {
	const classes = useStyles();
	const hasJWT = Boolean(useSelector(selectJWT));
	const [loggingOut, setLoggingOut] = useState(false);
	const dispatch = useDispatch();

	const logout = () => {
		setLoggingOut(true);
		setTimeout(() => {
			setLoggingOut(false);
			dispatch(setJWT(null));
		}, 1000);
	};

	return (
		<AppBar position="static" color="default" elevation={0} className={classes.appBar}>
			<Toolbar className={classes.toolbar}>
				<Typography variant="h6" color="inherit" noWrap className={classes.toolbarTitle}>
					<RouterLink style={{ color: 'inherit' }} to="/">UniCS KB</RouterLink>
				</Typography>
				<nav>
					{
						hasJWT
							? <>
								<Button color="inherit" component={RouterLink} to="/networking">1:1 Networking</Button>
								<Button color="inherit" component={RouterLink} to="/chats">Chats</Button>
								<Button color="inherit" component={RouterLink} to="/account">Account</Button>
								<Button href="#" color="inherit" variant="outlined" className={classes.link} onClick={logout}>
								Logout
								</Button>
							</>
							: <>
								<Button color="inherit" component={RouterLink} to="/">About</Button>
								<Button color="inherit" component={RouterLink} to="/register">Register</Button>
								<Button href="#" color="inherit" variant="outlined" className={classes.link} component={RouterLink} to="/login">
								Login
								</Button>
							</>
					}
				</nav>
			</Toolbar>
			<Backdrop open={loggingOut && hasJWT} className={classes.backdrop}>
				<CircularProgress color="inherit" />
			</Backdrop>
		</AppBar>
	);
}
