import { Box, Button, CircularProgress, Dialog, DialogContent, DialogContentText, DialogTitle, makeStyles, TextField } from '@material-ui/core';
import React, { useRef, useState } from 'react';
import asAPIError from '../util/asAPIError';
import { client } from '../util/makeClient';

interface ForgotPasswordModalProps {
	open: boolean;
	onClose: () => void;
	email?: string;
}

const useStyles = makeStyles(theme => ({
	textField: {
		width: '100%',
		margin: theme.spacing(1, 0)
	},
	buttonBox: {
		textAlign: 'right',
		margin: theme.spacing(1, 0)
	},
	centered: {
		textAlign: 'center'
	},
	spaced: {
		margin: theme.spacing(1, 0)
	}
}));

enum ModalState {
	Waiting,
	Processing,
	Finished
}

export function ForgotPasswordModal(props: ForgotPasswordModalProps) {
	const classes = useStyles();

	const [state, setState] = useState<{
		state: ModalState;
		message?: string;
	}>({ state: ModalState.Waiting });

	const textfieldRef = useRef<HTMLDivElement>(null);

	const generateBody = () => {
		switch (state.state) {
			case ModalState.Waiting:
				return <>
					<DialogContentText>
						Forgot your password or just want to change it? Enter your email below and we'll send you instructions on how you can reset it.
					</DialogContentText>
					<TextField
						label="Email"
						variant="outlined"
						className={classes.textField}
						defaultValue={props.email}
						ref={textfieldRef}/>
					<Box className={classes.buttonBox}>
						<Button color="primary" onClick={() => {
							if (!textfieldRef.current) return;
							const textarea: HTMLInputElement|null = textfieldRef.current.querySelector('input[type=text]');
							if (!textarea) return;
							const email = textarea.value.trim();
							setState({ state: ModalState.Processing });
							setTimeout(() => {
								client.forgotPassword(email)
									.then(() => {
										setState({
											state: ModalState.Finished,
											message: 'Your password reset email has been sent!'
										});
									})
									.catch(err => {
										console.error(err);
										const message = asAPIError(err) ?? 'An unknown error occurred trying to send your password reset email. Please try again later.';
										setState({
											state: ModalState.Finished,
											message
										});
									});
							}, 1e3);
						}}>Send Reset Instructions</Button>
					</Box>
				</>;
			case ModalState.Processing:
				return <Box className={classes.centered}>
					<DialogContentText className={classes.spaced}>
						Sending the password reset email...
					</DialogContentText>
					<CircularProgress className={classes.spaced} />
				</Box>;
			case ModalState.Finished:
				return <>
					<DialogContentText className={classes.spaced}>
						{state.message}
					</DialogContentText>
					<Box className={classes.buttonBox}>
						<Button variant="contained" color="primary" onClick={(() => {
							props.onClose();
							setTimeout(() => setState({ state: ModalState.Waiting }), 250);
						})}>Close</Button>
					</Box>
				</>;
		}
	};

	return <Dialog open={props.open} onClose={() => {
		props.onClose();
		setTimeout(() => setState({ state: ModalState.Waiting }), 250);
	}}>
		<DialogTitle>Reset password</DialogTitle>
		<DialogContent>
			{ generateBody() }
		</DialogContent>
	</Dialog>;
}
