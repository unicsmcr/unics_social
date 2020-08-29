import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import useStyles from '../../components/util/useStyles';
import { Link as RouterLink } from 'react-router-dom';

export default function PublicAppBar() {
	const classes = useStyles();

	return (
		<AppBar position="static" color="default" elevation={0} className={classes.appBar}>
			<Toolbar className={classes.toolbar}>
				<Typography variant="h6" color="textPrimary" noWrap className={classes.toolbarTitle}>
					UniCS KB
				</Typography>
				<nav>
					<Button color="inherit" component={RouterLink} to="/">About</Button>
					<Button color="inherit" component={RouterLink} to="/register">Register</Button>
				</nav>
				<Button href="#" color="primary" variant="contained" className={classes.link} component={RouterLink} to="/login">
					Login
				</Button>
			</Toolbar>
		</AppBar>
	);
}
