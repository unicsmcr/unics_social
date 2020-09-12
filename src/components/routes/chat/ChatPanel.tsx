import React, { useEffect, useState } from 'react';

import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Avatar from '@material-ui/core/Avatar';
import grey from '@material-ui/core/colors/grey';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import Fab from '@material-ui/core/Fab';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import SendIcon from '@material-ui/icons/Send';
import MessageGroup, { Align } from './MessageGroup';
import { DRAWER_WIDTH } from './ChannelsPanel';
import ChevronLeftIcon from '@material-ui/icons/MenuOpen';
import clsx from 'clsx';
import { useMediaQuery } from 'react-responsive';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChannels, selectChannel } from '../../../store/slices/ChannelsSlice';
import { APIDMChannel, APIEvent, APIEventChannel, APIUser } from '@unicsmcr/unics_social_api_client';
import { Skeleton } from '@material-ui/lab';
import { selectMe, selectUserById } from '../../../store/slices/UsersSlice';
import { selectEvent } from '../../../store/slices/EventsSlice';
import getIcon from '../../util/getAvatar';
import { useParams } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
	flexGrow: {
		flexGrow: 1
	},
	avatar: {
		marginRight: theme.spacing(2)
	},
	appBar: {
		background: grey[700],
		color: theme.palette.getContrastText(grey[700])
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
		background: `url(${require('../../../assets/chat_bg.png')})`,
		transition: theme.transitions.create(['left', 'right'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen
		})
	},
	shiftLeft: {
		left: `min(${DRAWER_WIDTH}, calc(100vw - 3rem))`,
		[theme.breakpoints.down('xs')]: {
			right: `-${DRAWER_WIDTH}`
		}
	},
	chatArea: {
		padding: theme.spacing(2),
		overflow: 'auto',
		flexGrow: 1
	},
	emptyChatArea: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center'
	},
	chatBox: {
		'borderTop': '1px solid',
		'borderColor': grey[400],
		'padding': theme.spacing(2),
		'overflow': 'initial',
		'background': grey[300],
		'& > form': {
			display: 'flex',
			alignItems: 'flex-start'
		}
	},
	sendIcon: {
		marginLeft: theme.spacing(2)
	},
	skeletonText: {
		marginLeft: theme.spacing(2),
		width: 'min(300px, 50vw)'
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
		id: '3'
	}
];

interface ChannelDisplayData {
	title: string;
	image?: string;
}

const selectChannelResource = (channel: APIDMChannel|APIEventChannel|undefined, meId: string) => {
	if (!channel) return () => undefined;
	if (channel.type === 'dm') {
		return selectUserById(channel.users.find(userId => userId !== meId)!);
	}
	return selectEvent(channel.event.id);
};

export default function ChatPanel() {
	const classes = useStyles();
	const theme = useTheme();
	const isMobile = useMediaQuery({ query: `(max-width: ${theme.breakpoints.values.sm}px)` });
	const dispatch = useDispatch();
	const { id: channelId } = useParams();

	const me = useSelector(selectMe);

	const channel: APIDMChannel|APIEventChannel|undefined = useSelector(selectChannel(channelId));

	const resource: APIUser|APIEvent = useSelector(selectChannelResource(channel, me!.id));

	useEffect(() => {
		setChannelsPanelOpen(false);
	}, [channelId]);

	useEffect(() => {
		if (channelId && !channel) dispatch(fetchChannels());
	}, [channel, channelId, dispatch]);

	const [_channelsPanelOpen, setChannelsPanelOpen] = useState(isMobile);
	const channelsPanelOpen = _channelsPanelOpen || !isMobile;

	let displayData: ChannelDisplayData|undefined;
	if (resource) {
		if (resource.hasOwnProperty('forename')) {
			const user = resource as APIUser;
			displayData = {
				title: `${user.forename} ${user.surname}`,
				image: getIcon(user)
			};
		} else {
			const event = resource as APIEvent;
			displayData = {
				title: event.title,
				image: getIcon(event)
			};
		}
	}

	return (
		<Card className={classes.flexGrow}>
			<Box className={clsx(classes.chatPanel, channelsPanelOpen && classes.shiftLeft)}>
				<AppBar position="static" color="inherit" elevation={2} className={classes.appBar}>
					<Toolbar>
						{ isMobile &&
						<IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={() => setChannelsPanelOpen(!channelsPanelOpen)} >
							{ channelsPanelOpen ? <ChevronLeftIcon /> : <MenuIcon /> }
						</IconButton>
						}
						{ channelId && <>
							{
								displayData
									? <Avatar className={classes.avatar} src={displayData.image} alt={'test'}></Avatar>
									: <Skeleton animation="wave" variant="circle" width={40} height={40} />
							}
							<Typography variant="h6" noWrap>
								{
									displayData
										? displayData.title
										: <Skeleton animation="wave" variant="text" className={classes.skeletonText} />
								}
							</Typography>
						</>
						}
					</Toolbar>
				</AppBar>
				{ channelId
					? <>
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
					</>
					: <Box className={clsx(classes.chatArea, classes.emptyChatArea)}>
						<Typography variant="h4" color="textSecondary">Select a chat!</Typography>
					</Box>
				}
			</Box>
		</Card>
	);
}
