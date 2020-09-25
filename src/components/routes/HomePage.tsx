import React from 'react';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Page from '../Page';
import { Box, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
	'@global': {
		ul: {
			margin: 0,
			padding: 0,
			listStyle: 'none'
		}
	},
	'heroContent': {
		padding: theme.spacing(16, 2, 16, 2),
		backgroundColor: '#520F79',
		background: `url(${require('../../assets/homepage_bg.jpg')})`,
		backgroundSize: 'cover',
		minHeight: '70vh',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center'
	},
	'heroText': {
		background: 'black',
		color: 'white',
		display: 'inline-block',
		fontSize: '3rem',
		fontWeight: 'bold',
		padding: theme.spacing(2)
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
		</Page>
	);
}
