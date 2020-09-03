import React, { useState } from 'react';

import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { Box, AppBar, Toolbar, colors, Avatar, IconButton, TextField, Card, Fab } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import SendIcon from '@material-ui/icons/Send';
import MessageGroup, { Align } from './MessageGroup';
import ChannelsPanel, { DRAWER_WIDTH } from './ChannelsPanel';
import ChevronLeftIcon from '@material-ui/icons/MenuOpen';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
	flexGrow: {
		flexGrow: 1
	},
	root: {
		position: 'absolute',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
		borderRadius: '0 !important'
	},
	avatar: {
		marginRight: theme.spacing(2)
	},
	appBar: {
		background: colors.grey[700],
		color: theme.palette.getContrastText(colors.grey[700]),
	},
	menuButton: {
		marginRight: theme.spacing(1),
		cursor: 'pointer'
	},
	chatPanel: {
		position: 'absolute',
		display: 'flex',
		flexDirection: 'column',
		left: 0,
		top: 0,
		bottom: 0,
		right: 0,
		transition: theme.transitions.create(['left', 'right'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen
		})
	},
	shiftLeft: {
		left: `min(${DRAWER_WIDTH}, calc(100vw - 3rem))`,
		[theme.breakpoints.down('sm')]: {
			right: `-${DRAWER_WIDTH}`
		}
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

export default function ChatPanel() {
	const classes = useStyles();

	const [channelsPanelOpen, setChannelsPanelOpen] = useState(false);
	const [channel, setChannel] = useState<{ name: string; avatar: string }>({
		name: 'Blank',
		avatar: ''
	});

	return (
		<Card className={[classes.flexGrow, classes.root].join(' ')}>
			<ChannelsPanel onChannelSelected={channel => setChannel(channel)} open={channelsPanelOpen} onClose={() => setChannelsPanelOpen(false)}/>
			<Box className={clsx(classes.chatPanel, channelsPanelOpen && classes.shiftLeft)}>
				<AppBar position="static" color="inherit" elevation={2} className={classes.appBar}>
					<Toolbar>
						<IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={() => setChannelsPanelOpen(!channelsPanelOpen)} >
							{ channelsPanelOpen ? <ChevronLeftIcon /> : <MenuIcon /> }
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
			</Box>
		</Card>
	);
}
