import { Box, Container, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import Page from '../../Page';
import NotificationDialog from '../../util/NotificationDialog';

const useStyles = makeStyles(theme => ({
	root: {
		minHeight: '60vh'
	},
	heroContent: {
		padding: theme.spacing(8, 2, 0, 2)
	},
	mainContent: {
		padding: theme.spacing(0, 2, 8, 2),
		textAlign: 'center'
	}
}));

export default function NetworkingPage() {
	const classes = useStyles();

	return <Page>
		<Box className={classes.root}>
			{/* Hero unit */}
			<Container maxWidth="sm" component="main" className={classes.heroContent}>
				<Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
				1-to-1 Networking
				</Typography>
				<Typography variant="h5" align="center" color="textSecondary" component="p">
				Meet new people here!
				</Typography>
			</Container>
			<Container maxWidth="sm" component="section" className={classes.mainContent}>
			hello
			</Container>
			{/* End hero unit */}
			{/*
		<NotificationDialog
			title="Failed to login"
			message={state.formError}
			show={Boolean(state.formError)}
			onClose={() => setState({ ...state, formError: '' })}
		/>*/}
		</Box>
	</Page>;
}
