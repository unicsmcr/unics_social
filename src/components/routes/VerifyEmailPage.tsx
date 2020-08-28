import React, { useState, useEffect } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Footer from '../Footer';
import useStyles from '../util/useStyles';
import PublicAppBar from '../bars/PublicAppBar';
import { useLocation } from 'react-router-dom';
import { CircularProgress, Box } from '@material-ui/core';

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
	}
}

export default function VerifyEmailPage() {
	const [verifyEmailState, setVerifyEmailState] = useState(VerifyEmailPageState.Verifying);

	const classes = useStyles();
	const location = useLocation();
	const confirmationId = new URLSearchParams(location.search).get('confirmationId');

	useEffect(() => {
		if (!confirmationId) setVerifyEmailState(VerifyEmailPageState.MissingConfirmationId);
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
			<Footer />
		</>
	);
}
