import React from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Avatar from '@material-ui/core/Avatar';
import grey from '@material-ui/core/colors/grey';
import { makeStyles } from '@material-ui/core/styles';
import Message, { MessageProps } from './Message';

export enum Align {
	Left,
	Right
}

interface MessageGroupProps {
	author: {
		name: string;
		avatar?: string;
	};
	messages: Pick<MessageProps, 'content' | 'id'>[];
	align: Align;
}

const useStyles = makeStyles(theme => ({
	messageGroup: {
		display: 'block',
		padding: theme.spacing(2),
		background: grey[200],
		borderRadius: theme.spacing(4)
	},
	avatar: {
		marginRight: theme.spacing(1),
		width: theme.spacing(4),
		height: theme.spacing(4)
	},
	userInfo: {
		display: 'flex',
		alignItems: 'center',
		marginBottom: theme.spacing(1)
	}
}));

export default function MessageGroup({ messages, align, author }: MessageGroupProps) {
	const classes = useStyles();

	return <Box style={{ textAlign: align === Align.Left ? 'left' : 'right' }}>
		{ align === Align.Left && <Box className={classes.userInfo} >
			<Avatar src={author.avatar} className={classes.avatar} />
			<Typography variant="subtitle2">
				{author.name}
			</Typography>
		</Box>
		}
		{
			messages.map(message => <Message content={message.content} id={message.id} isOwn={align === Align.Right} key={message.id} />)
		}
	</Box>;
}
