import React, { useState, useEffect } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Footer from '../Footer';
import useStyles from '../util/useStyles';
import PublicAppBar from '../bars/PublicAppBar';
import { useLocation } from 'react-router-dom';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

import makeClient from '../util/makeClient';
import asAPIError from '../util/asAPIError';

enum VerifyEmailPageState {
	MissingConfirmationId,
	Verifying,
	Verified,
	Failure
}

function getVerifyMessage(state: VerifyEmailPageState, classes: Record<string, string>) {
	if (state === VerifyEmailPageState.MissingConfirmationId) {
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
	const confirmationId = new URLSearchParams(location.search).get('confirmationId');

	useEffect(() => {
		if (confirmationId) {
			const client = makeClient();
			client.verifyEmail(confirmationId)
				.then(() => setVerifyEmailState(VerifyEmailPageState.Verified))
				.catch(err => {
					console.warn(err);
					const message = asAPIError(err) ?? 'An unexpected error occurred trying to verify your email address.';
					setErrorMessage(message);
					setVerifyEmailState(VerifyEmailPageState.Failure);
				});
		} else {
			setVerifyEmailState(VerifyEmailPageState.MissingConfirmationId);
		}
	}, [confirmationId]);

	return (
		<>
			<CssBaseline />
			<PublicAppBar />
			{/* Hero unit */}
			<Container maxWidth="sm" component="main" className={classes.heroContent}>
				<Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
          Verify Email
				</Typography>
				{ getVerifyMessage(verifyEmailState, classes) }
			</Container>
			{/* End hero unit */}
			<Dialog
				open={errorMessage.length > 0}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title">Failed to verify your email</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-description">
						{ errorMessage }
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setErrorMessage('')} color="primary">
            Ok
					</Button>
				</DialogActions>
			</Dialog>
			<Footer />
		</>
	);
}
