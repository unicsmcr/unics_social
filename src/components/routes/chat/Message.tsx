import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import grey from '@material-ui/core/colors/grey';
import { darken, makeStyles } from '@material-ui/core/styles';
import moment from 'moment';
import { deleteMessage, OptimisedAPIMessage } from '../../../store/slices/MessagesSlice';

import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';

import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton } from '@material-ui/core';
import { useDispatch } from 'react-redux';

export interface MessageProps {
	message: OptimisedAPIMessage;
	id: string;
	isOwn: boolean;
}

function formatTime(time: number): string {
	return moment(time).format('h:mma');
}

const useStyles = makeStyles(theme => ({
	messageBubble: (props: any) => ({
		display: 'inline-block',
		padding: theme.spacing(1.5, 2, 1.5, 2),
		background: props.isOwn ? (props.selected ? darken(theme.palette.primary.light, 0.1) : theme.palette.primary.light) : grey[100],
		borderRadius: props.isOwn ? theme.spacing(4, 4, 0, 4) : theme.spacing(0, 4, 4, 4),
		marginBottom: theme.spacing(1),
		maxWidth: '70ch',
		color: props.isOwn && theme.palette.primary.contrastText
	}),
	time: (props: any) => ({
		color: props.isOwn ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
		marginLeft: theme.spacing(1)
	})
}));

export default function Message({ message, isOwn }: MessageProps) {
	const [hovered, setHovered] = useState(false);
	const [dialogOpen, setDialogOpen] = useState(false);

	const selected = hovered || dialogOpen;

	const classes = useStyles({ isOwn, selected });

	const dispatch = useDispatch();

	const deleteThisMessage = () => {
		dispatch(deleteMessage({ channelID: message.channelID, messageID: message.id }));
		setDialogOpen(false);
	};

	return <>
		<Box onMouseOver={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
			{
				isOwn && selected && <IconButton onClick={() => setDialogOpen(true)}>
					<DeleteOutlinedIcon />
				</IconButton>
			}
			<div className={classes.messageBubble}>
				<Typography variant="body1" style={{ textAlign: 'left' }}>
					{ message.content }
					<Typography variant="caption" className={classes.time}>{ formatTime(message.time) }</Typography>
				</Typography>
			</div>
		</Box>
		<Dialog
			open={dialogOpen}
			onClose={() => setDialogOpen(false)}
		>
			<DialogTitle>Delete message?</DialogTitle>
			<DialogContent>
				<DialogContentText>
					This is an irreversible action - this message will no longer be visible to anyone else in this chat after you have deleted it! Are you sure you want to delete this message?
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={() => setDialogOpen(false)}>
            Cancel
				</Button>
				<Button onClick={() => deleteThisMessage()} color="primary">
            Delete for everyone
				</Button>
			</DialogActions>
		</Dialog>
	</>;
}
