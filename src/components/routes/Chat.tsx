import React from 'react';

import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import Page from '../Page';

const useStyles = makeStyles(theme => ({
	heroContent: {
		padding: theme.spacing(14, 2, 4, 2)
	},
	mainContent: {
		padding: theme.spacing(4, 2, 14, 2),
		textAlign: 'center'
	}
}));

export default function ChatPage() {
	const classes = useStyles();

	return (
		<Page>
			{/* Hero unit */}
			<Container maxWidth="sm" component="header" className={classes.heroContent}>
				<Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
					Account Settings
				</Typography>
			</Container>
			{/* End hero unit */}
			<Container maxWidth="sm" component="main" className={classes.mainContent}>
				<Typography component="p" variant="body1">
					Chat goes here
				</Typography>
			</Container>
		</Page>
	);
}
