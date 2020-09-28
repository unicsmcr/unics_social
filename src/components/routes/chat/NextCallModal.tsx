import { Dialog, DialogTitle, DialogContent, DialogContentText, Box, Button } from '@material-ui/core';
import { APIUser } from '@unicsmcr/unics_social_api_client';
import React from 'react';
import { useHistory } from 'react-router-dom';

interface NextCallModalProps {
	user: APIUser;
	open: boolean;
	onClose: () => void;
}

export default function NextCallModal(props: NextCallModalProps) {
	const history = useHistory();

	return <Dialog open={props.open} onClose={props.onClose}>
		<DialogTitle>Talk to someone new?</DialogTitle>
		<DialogContent>
			<DialogContentText>
				If you're not enjoying talking to {props.user.forename}, you can join the Networking Queue again. Would you like to do that?
			</DialogContentText>
			<Box style={{ textAlign: 'right' }}>
				<Button color="default" onClick={() => props.onClose()}>No</Button>
				<Button color="primary" onClick={() => history.push('/networking')}>Rejoin Networking</Button>
			</Box>
		</DialogContent>
	</Dialog>;
}
