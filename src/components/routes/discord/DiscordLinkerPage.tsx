import { Container, LinearProgress, makeStyles, Paper, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import asAPIError from '../../util/asAPIError';
import { client } from '../../util/makeClient';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';

const useStyles = makeStyles(theme => ({
	heroContent: {
		padding: theme.spacing(8, 2, 4, 2)
	},
	mainContent: {
		padding: theme.spacing(0, 2, 8, 2),
		textAlign: 'center',
		minHeight: '40vh'
	},
	paper: {
		padding: theme.spacing(2)
	}
}));

enum PageState {
	Linking,
	Succeeded,
	Failed
}

export default function DiscordLinkerPage() {
	const classes = useStyles();
	const history = useHistory();

	useEffect(() => {
		const params = new URLSearchParams(history.location.search);
		const code = params.get('code') ?? '';
		const state = params.get('state') ?? '';
		client
			.linkDiscordAccount({ code, state })
			.then(() => {
				setState(PageState.Succeeded);
			})
			.catch(err => {
				setState(PageState.Failed);
				console.error(err);
				setError(asAPIError(err) ?? 'An unknown error occurred linking your account');
			});
	}, [history.location.search]);

	const [state, setState] = useState<PageState>(PageState.Linking);
	const [error, setError] = useState<string>('');

	const generateBody = () => {
		switch (state) {
			case PageState.Linking:
				return <LinearProgress />;
			case PageState.Succeeded:
				return <Paper elevation={2} className={classes.paper}>
					<CheckCircleOutlineIcon color="primary" fontSize="large" />
					<Typography variant="body1" align="center" color="textPrimary">
						Your account has been linked and you've been added to our server! You can now close this tab.
					</Typography>
				</Paper>;
			case PageState.Failed:
				return <Paper elevation={2} className={classes.paper}>
					<ErrorOutlineIcon color="primary" fontSize="large" />
					<Typography variant="body1" align="center" color="textPrimary">
						{ error }
					</Typography>
				</Paper>;
		}
	};

	return <>
		<Container maxWidth="sm" component="main" className={classes.heroContent}>
			<Typography variant="h3" align="center" color="textPrimary" gutterBottom>
				Linking your account...
			</Typography>
		</Container>
		<Container maxWidth="sm" component="section" className={classes.mainContent}>
			{ generateBody() }
		</Container>
	</>;
}
