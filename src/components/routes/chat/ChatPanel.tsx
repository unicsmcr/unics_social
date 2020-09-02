import React from 'react';

import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { Box, AppBar, Toolbar, colors, Avatar, IconButton } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import Message from './Message';
import MessageGroup, { Align } from './MessageGroup';

const useStyles = makeStyles(theme => ({
	flexGrow: {
		flexGrow: 1
	},
	avatar: {
		marginRight: theme.spacing(2)
	},
	appBar: {
		background: colors.grey[700],
		color: theme.palette.getContrastText(colors.grey[700])
	},
	menuButton: {
		marginRight: theme.spacing(1),
		cursor: 'pointer'
	},
	chatArea: {
		padding: theme.spacing(2)
	}
}));

const messages = [
	{
		content: 'Hi!',
		id: '1'
	},
	{
		content: 'Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought to have scrambled parts of Cicero\'s De Finibus Bonorum et Malorum for use in a type specimen book.',
		id: '2'
	}
];

interface ChatPanelProps {
	channel: {
		name: string;
		avatar: string;
	};
	onChannelsMenuClicked: Function;
}

export default function ChatPanel({ channel, onChannelsMenuClicked }: ChatPanelProps) {
	const classes = useStyles();

	return (
		<Box className={classes.flexGrow}>
			<AppBar position="static" color="inherit" elevation={2} className={classes.appBar}>
				<Toolbar>
					<IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={() => onChannelsMenuClicked()} >
						<MenuIcon />
					</IconButton>
					<Avatar className={classes.avatar} src={channel.avatar} alt={channel.name}></Avatar>
					<Typography variant="h6">
						{channel.name}
					</Typography>
				</Toolbar>
			</AppBar>
			<Box className={classes.chatArea}>
				<MessageGroup align={Align.Left} messages={messages} author={{ name: 'Bob' }}/>
				<MessageGroup align={Align.Right} messages={messages} author={{ name: 'Bob' }}/>
			</Box>
		</Box>
	);
}
