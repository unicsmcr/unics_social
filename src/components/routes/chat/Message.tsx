import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import grey from '@material-ui/core/colors/grey';
import { makeStyles } from '@material-ui/core/styles';
import moment from 'moment';
import { OptimisedAPIMessage } from '../../../store/slices/MessagesSlice';

import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';

import { IconButton } from '@material-ui/core';

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
		background: props.isOwn ? theme.palette.primary.light : grey[100],
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
	const classes = useStyles({ isOwn });

	const [hovered, setHovered] = useState(false);

	return <Box onMouseOver={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
		{
			isOwn && hovered && <IconButton>
				<DeleteOutlinedIcon />
			</IconButton>
		}
		<div className={classes.messageBubble}>
			<Typography variant="body1" style={{ textAlign: 'left' }}>
				{ message.content }
				<Typography variant="caption" className={classes.time}>{ formatTime(message.time) }</Typography>
			</Typography>
		</div>
	</Box>;
}
