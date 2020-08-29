import React from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

export default function NotificationDialog(props: { title: string; message: string; show: boolean; onClose: Function }) {
	return <Dialog
		open={props.show}
		aria-labelledby="alert-dialog-title"
		aria-describedby="alert-dialog-description"
	>
		<DialogTitle id="alert-dialog-title">{ props.title }</DialogTitle>
		<DialogContent>
			<DialogContentText id="alert-dialog-description">
				{ props.message }
			</DialogContentText>
		</DialogContent>
		<DialogActions>
			<Button onClick={() => props.onClose()} color="primary">
				Ok
			</Button>
		</DialogActions>
	</Dialog>;
}
