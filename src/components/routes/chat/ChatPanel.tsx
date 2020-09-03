import React from 'react';

import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { Box, AppBar, Toolbar, colors, Avatar, IconButton, TextField, Card, Fab } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import SendIcon from '@material-ui/icons/Send';
import MessageGroup, { Align } from './MessageGroup';

const useStyles = makeStyles(theme => ({
	flexGrow: {
		flexGrow: 1
	},
	root: {
		display: 'flex',
		flexDirection: 'column',
		position: 'absolute',
		top: theme.spacing(4),
		bottom: theme.spacing(4),
		left: '10vw',
		right: '10vw',
		[theme.breakpoints.down('sm')]: {
			top: 0,
			bottom: 0,
			left: 0,
			right: 0
		}
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
		padding: theme.spacing(2),
		overflow: 'auto',
		background: '#fafafa',
		flexGrow: 1
	},
	chatBox: {
		'borderTop': '1px solid',
		'borderColor': colors.grey[400],
		'padding': theme.spacing(2),
		'overflow': 'initial',
		'& > form': {
			display: 'flex',
			alignItems: 'flex-start'
		}
	},
	sendIcon: {
		marginLeft: theme.spacing(2)
	}
}));

const messages = [
	{
		content: 'Hi!',
		id: '1'
	},
	{
		content: 'My name is Test 😄',
		id: '2'
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
		<Card className={[classes.flexGrow, classes.root].join(' ')}>
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
				<MessageGroup align={Align.Left} messages={messages} author={{ name: 'Bob' }}/>
				<MessageGroup align={Align.Right} messages={messages} author={{ name: 'Bob' }}/>
			</Box>
			<Card className={classes.chatBox}>
				<form className={classes.flexGrow}>
					<TextField label="Type a message" variant="filled" className={classes.flexGrow}/>
					<Fab aria-label="send" className={classes.sendIcon} color="primary" >
						<SendIcon />
					</Fab>
				</form>
			</Card>
		</Card>
	);
}
