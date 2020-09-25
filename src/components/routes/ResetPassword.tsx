import { Box, Button, CircularProgress, Container, makeStyles, Paper, TextField, Typography } from '@material-ui/core';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import React, { useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Page from '../Page';
import asAPIError from '../util/asAPIError';
import { client } from '../util/makeClient';
import NotificationDialog from '../util/NotificationDialog';

const useStyles = makeStyles(theme => ({
	root: {
		minHeight: '60vh'
	},
	heroContent: {
		padding: theme.spacing(8, 2, 0, 2)
	},
	mainContent: {
		padding: theme.spacing(8, 2, 0, 2),
		textAlign: 'center'
	},
	paddedPg: {
		padding: theme.spacing(1, 0),
		textAlign: 'justify',
		textJustify: 'inter-word'
	},
	padded: {
		marginTop: theme.spacing(2),
		padding: theme.spacing(2)
	},
	marginTop: {
		marginTop: theme.spacing(4)
	},
	form: {
		textAlign: 'center'
	},
	field: {
		width: '100%',
		marginTop: theme.spacing(4)
	},
	button: {
		marginTop: theme.spacing(4)
	},
	paper: {
		padding: theme.spacing(2)
	}
}));

enum PageState {
	Idle,
	Doing,
	Success
}

export default function ResetPasswordPage() {
	const classes = useStyles();
	const formRef = useRef<HTMLFormElement>(null);
	const [pageState, setPageState] = useState<PageState>(PageState.Idle);
	const history = useHistory();
	const params = new URLSearchParams(history.location.search);
	const token = params.get('token') ?? '';

	const [error, setError] = useState<{ show: boolean; message?: string }>(
		token
			? {
				show: false
			}
			: {
				show: true,
				message: 'You have reached this page with an invalid link. Please try following the link from your inbox.'
			}
	);

	const resetPassword = () => {
		if (!formRef.current) {
			setError({ show: true, message: 'Something went wrong!' });
			return;
		}
		const form = new FormData(formRef.current);
		const password = form.get('password') as string|undefined;
		const formPassword = form.get('confirmPassword') as string|undefined;
		if (!password || !formPassword) {
			setError({ show: true, message: 'Please fill in both fields' });
			return;
		}
		if (password !== formPassword) {
			setError({ show: true, message: 'Passwords don\'t match' });
			return;
		}
		if (password.length < 10) {
			setError({ show: true, message: 'Password must be at least 10 characters long ' });
			return;
		}
		setPageState(PageState.Doing);
		client.resetPassword({
			token,
			newPassword: password
		})
			.then(() => {
				setPageState(PageState.Success);
			})
			.catch(err => {
				const message = asAPIError(err) ?? 'An error occurred resetting your password.';
				setPageState(PageState.Idle);
				setError({ show: true, message });
			});
	};

	const generateBody = () => {
		switch (pageState) {
			case PageState.Idle:
				return <>
					<Typography variant="body1">Please enter your new password below.</Typography>
					<form className={classes.form} ref={formRef} onSubmit={e => {
						e.preventDefault();
						resetPassword();
					}}>
						<TextField label="Password *" variant="outlined" className={classes.field} inputProps={{ type: 'password' }} name="password"/>
						<TextField label="Confirm Password *" variant="outlined" className={classes.field} inputProps={{ type: 'password' }} name="confirmPassword"/>
						<Button variant="contained" type="submit" color="primary" className={classes.button}>Reset Password</Button>
					</form>
				</>;
			case PageState.Doing:
				return <CircularProgress />;
			case PageState.Success:
				return <Paper elevation={2} className={classes.paper}>
					<CheckCircleOutlineIcon color="primary" fontSize="large" />
					<Typography variant="body1">Your password has now been reset!</Typography>
				</Paper>;
		}
	};

	return <Page>
		<Box className={classes.root}>
			{/* Hero unit */}
			<Container maxWidth="sm" component="main" className={classes.heroContent}>
				<Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
					Reset Password
				</Typography>
			</Container>
			<Container maxWidth="sm" component="section" className={classes.mainContent}>
				{ generateBody() }
			</Container>
			{/* End hero unit */}
		</Box>
		<NotificationDialog
			message={error.message ?? ''}
			show={error.show}
			onClose={() => setError({ ...error, show: false })}
			title="An error occurred" />
	</Page>;
}
