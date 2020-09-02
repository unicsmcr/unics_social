import React, { useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import useStyles from '../util/useStyles';
import { useLocation } from 'react-router-dom';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';
import NotificationDialog from '../util/NotificationDialog';

import makeClient from '../util/makeClient';
import asAPIError from '../util/asAPIError';
import Page from '../Page';

enum VerifyEmailPageState {
	MissingToken,
	Verifying,
	Verified,
	Failure
}

function getVerifyMessage(state: VerifyEmailPageState, classes: Record<string, string>) {
	if (state === VerifyEmailPageState.MissingToken) {
		return <Typography component="p" variant="body1" align="center" color="textPrimary">
			Oops! You've landed on this page without an email address to verify!
		</Typography>;
	} else if (state === VerifyEmailPageState.Verifying) {
		return <Box textAlign="center">
			<Typography component="p" variant="body1" align="center" color="textPrimary" className={classes.paddedCaption}>
					Verifying your account...
			</Typography>
			<CircularProgress />
		</Box>;
	} else if (state === VerifyEmailPageState.Verified) {
		return <Box textAlign="center">
			<CheckCircleOutlineIcon fontSize="large" color="primary" />
			<Typography component="p" variant="body1" align="center" color="textPrimary">
				Your account has been verified!
			</Typography>
		</Box>;
	}
	return <Box textAlign="center">
		<ErrorOutlineIcon fontSize="large" color="primary" />
		<Typography component="p" variant="body1" align="center" color="textPrimary">
			Failed to verify the given email address.
		</Typography>
	</Box>;
}

export default function VerifyEmailPage() {
	const [verifyEmailState, setVerifyEmailState] = useState(VerifyEmailPageState.Verifying);
	const [errorMessage, setErrorMessage] = useState('');

	const classes = useStyles();
	const location = useLocation();
	const token = new URLSearchParams(location.search).get('token');

	useEffect(() => {
		if (token) {
			const client = makeClient();
			client.verifyEmail(token)
				.then(() => setVerifyEmailState(VerifyEmailPageState.Verified))
				.catch(err => {
					console.warn(err);
					const message = asAPIError(err) ?? 'An unexpected error occurred trying to verify your email address.';
					setErrorMessage(message);
					setVerifyEmailState(VerifyEmailPageState.Failure);
				});
		} else {
			setVerifyEmailState(VerifyEmailPageState.MissingToken);
		}
	}, [token]);

	return (
		<Page>
			{/* Hero unit */}
			<Container maxWidth="sm" component="main" className={classes.heroContent}>
				<Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
					Verify Email
				</Typography>
				{ getVerifyMessage(verifyEmailState, classes) }
			</Container>
			{/* End hero unit */}
			<NotificationDialog
				title="Failed to verify your email"
				message={errorMessage}
				show={Boolean(errorMessage)}
				onClose={() => setErrorMessage('')}
			/>
		</Page>
	);
}
