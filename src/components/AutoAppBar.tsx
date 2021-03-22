import React, { useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { setJWT, selectJWT } from '../store/slices/AuthSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { colors, Divider, Drawer, IconButton, List, ListItem, ListItemText } from '@material-ui/core';
import { useMediaQuery } from 'react-responsive';
import MenuIcon from '@material-ui/icons/Menu';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { Helmet } from 'react-helmet';
import { selectHasUserChanges } from './../store/slices/ReadSlice';
import clsx from 'clsx';

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
		margin: theme.spacing(1, 0)
	},
	backdrop: {
		zIndex: theme.zIndex.drawer + 1,
		color: '#fff'
	},
	drawer: {
		textAlign: 'center'
	},
	drawerItem: {
		'minWidth': '50vw',
		'textAlign': 'center',
		'& > * > *': {
			padding: theme.spacing(1, 3)
		}
	},
	logo: {
		height: theme.spacing(6),
		marginRight: theme.spacing(2),
		marginTop: theme.spacing(0.5),
		[theme.breakpoints.down('md')]: {
			height: theme.spacing(6)
		}
	},
	specialEventInfo: {
		'& > img': {
			maxHeight: '90vh',
			maxWidth: '95vw'
		}
	}
}));

const GUEST_LINKS = [
	['Home', '/'],
	['Register', '/register'],
	['Login', '/login']
];

const AUTH_LINKS = [
	['Home', '/'],
	['Chats', '/chats'],
	['Networking', '/networking'],
	['Account Settings', '/account'],
	['Discord', '/discord']
];

function shouldShowPoster() {
	const hasSeen = Boolean(localStorage.getItem('seeneaster'));
	if (!hasSeen) {
		localStorage.setItem('seeneaster', 'yes');
	}
	return !hasSeen;
}

export function AppDrawer(props) {
	const classes = useStyles();
	const history = useHistory();

	const links = props.hasJWT ? AUTH_LINKS : GUEST_LINKS;

	return <Drawer open={props.open} anchor="left" onClose={() => props.onClose()} className={classes.drawer}>
		<List>
			{
				links.map(([name, url], index) => (
					<div key={name}>
						{
							index !== 0 && <Divider />
						}
						<ListItem button className={classes.drawerItem} onClick={() => {
							history.push(url);
							props.onClose();
						}}>
							<ListItemText>{name}</ListItemText>
						</ListItem>
					</div>
				))
			}
			{
				<>
					<Divider />
					<ListItem button className={classes.drawerItem} onClick={() => {
						props.onSpecialEvent();
						props.onClose();
					}}>
						<ListItemText>Easter Event</ListItemText>
					</ListItem>
				</>
			}
			{
				props.hasJWT && <>
					<Divider />
					<ListItem button className={classes.drawerItem} onClick={() => {
						props.onClose();
						props.onLogout();
					}}>
						<ListItemText>Logout</ListItemText>
					</ListItem>
				</>
			}
		</List>
	</Drawer>;
}

function SetUnreadIndicators() {
	const DEFAULT_TITLE = 'UniCS KB';
	const unreadMessages = useSelector(selectHasUserChanges);
	return <Helmet defer={false}>
		<title>
			{
				(unreadMessages.length > 0
					? `(${unreadMessages.length}) ✉️ `
					: '') + DEFAULT_TITLE
			}
		</title>
	</Helmet>;
}

export default function AutoAppBar() {
	const classes = useStyles();
	const hasJWT = Boolean(useSelector(selectJWT));
	const [loggingOut, setLoggingOut] = useState(false);
	const [specialEventOpen, setSpecialEventOpen] = useState(shouldShowPoster());
	const dispatch = useDispatch();
	const theme = useTheme();

	const [drawerOpen, setDrawerOpen] = useState(false);
	const isMobile = useMediaQuery({ query: `(max-width: ${theme.breakpoints.values.sm}px)` });

	const logout = () => {
		setLoggingOut(true);
		setTimeout(() => {
			setLoggingOut(false);
			dispatch(setJWT(null));
		}, 1000);
	};

	return (
		<AppBar position="static" color="default" elevation={0} className={classes.appBar}>
			{SetUnreadIndicators()}
			<Toolbar className={classes.toolbar}>
				{
					isMobile && <IconButton color="inherit" onClick={() => setDrawerOpen(true)} edge="start">
						<MenuIcon />
					</IconButton>
				}
				<RouterLink to="/" ><img src={require('../assets/kb_logo.png')} className={classes.logo} alt="KB Logo"/></RouterLink>
				{
					!isMobile && <Typography variant="h6" color="inherit" noWrap className={classes.toolbarTitle}>
						<RouterLink style={{ color: 'inherit' }} to="/">UniCS KB</RouterLink>
					</Typography>
				}
				{
					!isMobile && <nav>
						{
							hasJWT
								? <>
									<Button color="secondary" variant="contained" onClick={() => setSpecialEventOpen(true)}>Easter</Button>
									<Button color="inherit" component={RouterLink} to="/chats">Chats</Button>
									<Button color="inherit" component={RouterLink} to="/networking">Networking</Button>
									<Button color="inherit" component={RouterLink} to="/account">Account</Button>
									<Button color="inherit" component={RouterLink} to="/discord">Discord</Button>
									<IconButton edge="end" color="inherit" className={classes.link} onClick={() => logout()}>
										<ExitToAppIcon />
									</IconButton>
								</>
								: <>
									<Button color="inherit" component={RouterLink} to="/">About</Button>
									<Button color="inherit" component={RouterLink} to="/register">Register</Button>
									<Button href="#" color="inherit" component={RouterLink} to="/login">
											Login
									</Button>
								</>
						}
					</nav>
				}
			</Toolbar>
			<AppDrawer open={isMobile && drawerOpen} onClose={() => setDrawerOpen(false)} hasJWT={hasJWT} onLogout={() => logout()} SpecialEvent={() => setSpecialEventOpen(true)}/>
			<Backdrop open={loggingOut && hasJWT} className={classes.backdrop}>
				<CircularProgress color="inherit" />
			</Backdrop>
			<Backdrop open={specialEventOpen} className={clsx(classes.backdrop, classes.specialEventInfo)} onClick={() => setSpecialEventOpen(false)}>
				<img src={require('../assets/info.png')} alt="Christmas Event Poster" />
			</Backdrop>
		</AppBar>
	);
}
