import React, { createRef, useCallback, useEffect, useState } from 'react';

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
import { createGroups } from './MessageGroup';
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
import { createMessage, fetchMessages, selectMessages } from '../../../store/slices/MessagesSlice';
import UserInfoPanel from './UserInfoPanel';
import { CircularProgress, Drawer } from '@material-ui/core';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import EventInfoPanel from './EventInfoPanel';

const useStyles = makeStyles(theme => ({
	flexGrow: {
		flexGrow: 1
	},
	avatar: {
		marginRight: theme.spacing(2)
	},
	appBar: {
		'background': grey[700],
		'color': theme.palette.getContrastText(grey[700]),
		'& h6': {
			width: '100%',
			textAlign: 'left'
		}
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
	mainContent: {
		overflow: 'hidden',
		flexGrow: 1,
		display: 'grid',
		gridAutoColumns: 'auto 320px'
	},
	chatArea: {
		padding: theme.spacing(2),
		overflow: 'auto',
		flexGrow: 1
	},
	chatHolder: {
		display: 'flex',
		flexDirection: 'column',
		overflow: 'auto',
		flexGrow: 1,
		gridColumn: 1
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
	},
	infoPanel: {
		background: 'rgba(255, 255, 255, 0.6)',
		width: 'min(320px, 80vw)',
		gridColumn: 2
	}
}));

export interface ChannelDisplayData {
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
	const isSmall = useMediaQuery({ query: `(max-width: ${theme.breakpoints.values.md - 1}px)` });
	const dispatch = useCallback(useDispatch(), []);
	const { id: channelID } = useParams();
	const [scrollSynced, setScrollSynced] = useState(true);

	const me = useSelector(selectMe);
	const chatBoxRef = createRef<HTMLDivElement>();

	const channel: APIDMChannel|APIEventChannel|undefined = useSelector(selectChannel(channelID));
	const resource: APIUser|APIEvent = useSelector(selectChannelResource(channel, me!.id));
	const messages = useSelector(selectMessages(channelID));

	useEffect(() => {
		setChannelsPanelOpen(false);
	}, [channelID]);

	useEffect(() => {
		if (channelID && !channel) dispatch(fetchChannels());
	}, [channel, channelID, dispatch]);

	useEffect(() => {
		if (channel && messages.length === 0) {
			dispatch(fetchMessages(channel.id));
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [channel, dispatch]);

	useEffect(() => {
		if (messages && chatBoxRef.current && scrollSynced) {
			chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
		}
	}, [chatBoxRef, messages, scrollSynced]);

	const [_infoPanelOpen, setInfoPanelOpen] = useState(false);
	const [_channelsPanelOpen, setChannelsPanelOpen] = useState(isMobile);
	const channelsPanelOpen = _channelsPanelOpen || !isMobile;
	const infoPanelOpen = _infoPanelOpen || !isSmall;

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

	const generateInfoPanel = () => <Box className={clsx(classes.infoPanel)}>
		{
			resource
				? (
					resource.hasOwnProperty('forename')
						? <UserInfoPanel user={resource as APIUser} />
						: <EventInfoPanel event={resource as APIEvent} />
				)
				: <CircularProgress />
		}
	</Box>;

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
						{ channelID && <>
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
						{
							isSmall && <IconButton edge="end" color="inherit" aria-label="info" onClick={() => setInfoPanelOpen(!_infoPanelOpen)} >
								<InfoOutlinedIcon />
							</IconButton>
						}
					</Toolbar>
				</AppBar>
				<Box className={classes.mainContent}>
					<Box className={classes.chatHolder}>
						{ channelID
							? <>
								<div ref={chatBoxRef} className={classes.chatArea} onScroll={e => {
									const target = e.target as any;
									const scrolledToBottom = target.scrollHeight - target.scrollTop - target.clientHeight < 1;
									if (scrolledToBottom && !scrollSynced) {
										setScrollSynced(true);
									} else if (!scrolledToBottom && scrollSynced) {
										setScrollSynced(false);
									}
								}}>
									{
										createGroups(messages, me!.id)
									}
								</div>
								<Card className={classes.chatBox}>
									<form className={classes.flexGrow} onSubmit={e => {
										e.preventDefault();
										const form = e.target as any;
										const message = String(new FormData(form).get('message'));
										form.reset();
										dispatch(createMessage({
											content: message,
											channelID
										}));
									}}>
										<TextField label="Type a message" variant="filled" className={classes.flexGrow} name="message" inputProps={{ autoComplete: 'off' }} />
										<Fab aria-label="send" className={classes.sendIcon} color="primary" type="submit">
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
					{
						channelID && (isSmall
							? <Drawer anchor="right" open={infoPanelOpen} onClose={() => setInfoPanelOpen(false)}>
								{ generateInfoPanel() }
							</Drawer>
							: generateInfoPanel()
						)
					}
				</Box>
			</Box>
		</Card>
	);
}
