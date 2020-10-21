import React from 'react';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Page from '../Page';
import { Box, Link, makeStyles, Paper } from '@material-ui/core';

import { Link as RouterLink } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
	heroContent: {
		padding: theme.spacing(16, 2, 16, 2),
		backgroundColor: '#520F79',
		background: `url(${require('../../assets/homepage_bg.jpg')})`,
		backgroundSize: 'cover',
		backgroundPosition: 'center',
		minHeight: '70vh',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center'
	},
	heroText: {
		background: 'black',
		color: 'white',
		display: 'inline-block',
		fontSize: '3rem',
		fontWeight: 'bold',
		padding: theme.spacing(2)
	},
	about: {
		marginTop: `-${theme.spacing(10)}px`,
		marginBottom: theme.spacing(8),
		padding: theme.spacing(5),
		fontSize: '1rem',
		width: '100%',
		[theme.breakpoints.down('sm')]: {
			marginTop: theme.spacing(2),
			padding: theme.spacing(3)
		}
	},
	subtitle: {
		fontSize: '1rem',
		color: theme.palette.text.secondary,
		marginBottom: theme.spacing(4)
	},
	list: {
		'margin': theme.spacing(4, 0),
		'fontSize': '1em',
		'listStyleType': 'disc',
		'marginLeft': theme.spacing(4),
		'& > li': {
			paddingLeft: theme.spacing(1),
			marginBottom: theme.spacing(0.5)
		}
	},
	joinNow: {
		textAlign: 'center'
	}
}));

export default function Homepage() {
	const classes = useStyles();
	return (
		<Page>
			<Box className={classes.heroContent} component="header">
				{/* Hero unit */}
				<Container maxWidth="sm">
					<Typography variant="h1" align="center" color="textPrimary" gutterBottom className={classes.heroText}>
						Welcome to UniCS <span style={{ color: 'gold' }}>KB</span>
					</Typography>
				</Container>
				{/* End hero unit */}
			</Box>
			<Container maxWidth="md" component="section">
				<Paper elevation={2} className={classes.about}>
					<Typography variant="h3" component="h2">About</Typography>
					<Typography variant="subtitle1" gutterBottom className={classes.subtitle}>Made by students, for students</Typography>
					<Typography variant="body1">
					KB is a platform created by UniCS as a space for students at the University of Manchester to socialise and network with each other online! For new students, this an excellent way for you to find and connect with other students just like you!
					</Typography>
					<ul className={classes.list}>
						<li>Socialise and network with each other online</li>
						<li>Our networking feature lets you meet someone new and have a quick 5 minute chat with them, either via video or text!</li>
						<li>Link your social media to connect with your new friends outside of UniCS KB</li>
						<li>Join our <b>Discord server</b> after registering to meet even more new people!</li>
					</ul>
					<Typography variant="body1">
					Put simply, we aim to make it possible for our community to stick together, regardless of wherever you may be!
					</Typography>
				</Paper>
				<Typography variant="h5" color="textSecondary" className={classes.joinNow}>
					What are you waiting for? <Link component={RouterLink} to="/register">Join now</Link> and meet potential friends for life!
				</Typography>
			</Container>
		</Page>
	);
}
