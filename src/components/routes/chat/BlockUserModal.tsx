import { Box, Button, CircularProgress, Dialog, DialogContent, DialogContentText, DialogTitle, makeStyles } from '@material-ui/core';
import { APIUser, NoteType } from '@unicsmcr/unics_social_api_client';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createNote } from '../../../store/slices/NotesSlice';
import asAPIError from '../../util/asAPIError';

interface BlockUserModalProps {
	open: boolean;
	onClose: () => void;
	user: APIUser;
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

export function BlockUserModal(props: BlockUserModalProps) {
	const classes = useStyles();

	const [state, setState] = useState<{
		state: ModalState;
		message?: string;
	}>({ state: ModalState.Waiting });

	const dispatch = useDispatch();

	const generateBody = () => {
		switch (state.state) {
			case ModalState.Waiting:
				return <>
					<DialogContentText>
						Doing this means that they'll still be able to send you messages, but you just won't be able to see them. The other user won't know that you've blocked them.
					</DialogContentText>
					<Box className={classes.buttonBox}>
						<Button color="primary" onClick={() => {
							setState({ state: ModalState.Processing });
							(dispatch(createNote({ id: props.user.id, noteType: NoteType.Blocked })) as any)
								.then(() => {
									setState({
										state: ModalState.Finished,
										message: 'This user has been blocked!'
									});
								})
								.catch(err => {
									console.error(err);
									const message = asAPIError(err) ?? 'An unknown error occurred trying to block this user. Please try again later.';
									setState({
										state: ModalState.Finished,
										message
									});
								});
						}}>Block</Button>
					</Box>
				</>;
			case ModalState.Processing:
				return <Box className={classes.centered}>
					<DialogContentText className={classes.spaced}>
						Blocking this user...
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
		<DialogTitle>Block {props.user.forename}?</DialogTitle>
		<DialogContent>
			{ generateBody() }
		</DialogContent>
	</Dialog>;
}
