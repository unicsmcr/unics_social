import { Box, Button, CircularProgress, Dialog, DialogContent, DialogContentText, DialogTitle, makeStyles, TextField } from '@material-ui/core';
import React, { useRef, useState } from 'react';
import asAPIError from '../util/asAPIError';
import { client } from '../util/makeClient';

interface ResendVerificationEmailModalProps {
	open: boolean;
	onClose: () => void;
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

export function ResendVerificationEmailModal(props: ResendVerificationEmailModalProps) {
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
						Haven't received your confirmation email? Please type in your email address below and we'll try to resend it. Alternatively, contact us if it still doesn't arrive.
					</DialogContentText>
					<TextField
						label="Email"
						variant="outlined"
						className={classes.textField}
						ref={textfieldRef}
						InputProps={{ type: 'email' }}/>
					<Box className={classes.buttonBox}>
						<Button color="primary" onClick={() => {
							if (!textfieldRef.current) return;
							const textarea: HTMLInputElement|null = textfieldRef.current.querySelector('input[type=email]');
							if (!textarea) return;
							const email = textarea.value.trim();
							setState({ state: ModalState.Processing });
							setTimeout(() => {
								client.resendVerificationEmail(email)
									.then(() => {
										setState({
											state: ModalState.Finished,
											message: 'Your confirmation email has been resent!'
										});
									})
									.catch(err => {
										console.error(err);
										const message = asAPIError(err) ?? 'An unknown error occurred trying to resend your confirmation email. Please try again later.';
										setState({
											state: ModalState.Finished,
											message
										});
									});
							}, 1e3);
						}}>Resend Email</Button>
					</Box>
				</>;
			case ModalState.Processing:
				return <Box className={classes.centered}>
					<DialogContentText className={classes.spaced}>
						Resending the confirmation email...
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
		<DialogTitle>Resend confirmation email</DialogTitle>
		<DialogContent>
			{ generateBody() }
		</DialogContent>
	</Dialog>;
}
