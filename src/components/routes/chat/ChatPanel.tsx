import React, { useCallback, useEffect, useState } from 'react';

import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Avatar from '@material-ui/core/Avatar';
import grey from '@material-ui/core/colors/grey';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import GroupIcon from '@material-ui/icons/Group';
import { DRAWER_WIDTH } from './ChannelsPanel';
import clsx from 'clsx';
import { useMediaQuery } from 'react-responsive';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChannels, selectChannel } from '../../../store/slices/ChannelsSlice';
import { APIDMChannel, APIEventChannel, APIUser } from '@unicsmcr/unics_social_api_client';
import { Skeleton } from '@material-ui/lab';
import { fetchUser, selectMe, selectUserById } from '../../../store/slices/UsersSlice';
import getIcon from '../../util/getAvatar';
import { useHistory, useParams } from 'react-router-dom';
import UserInfoPanel from './UserInfoPanel';
import { Badge, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Drawer } from '@material-ui/core';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { selectHasUserChanges } from '../../../store/slices/ReadSlice';
import MessagesPanel from './MessagesPanel';
import VideoPanel from './video/VideoPanel';
import NotificationDialog from '../../util/NotificationDialog';
import { selectQueueMatch, setQueueState } from '../../../store/slices/AuthSlice';
import Timer from './Timer';

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
		backgroundColor: '#BABABA',
		background: `url(${require('../../../assets/chat_bg.png')})`,
		transition: theme.transitions.create(['left'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen
		}),
		[theme.breakpoints.up('sm')]: {
			left: DRAWER_WIDTH
		}
	},
	mainContent: {
		overflow: 'hidden',
		flexGrow: 1,
		display: 'grid',
		gridAutoColumns: 'auto 320px'
	},
	noChat: {
		right: '0 !important'
	},
	chatHolder: {
		display: 'flex',
		flexDirection: 'column',
		overflow: 'auto',
		flexGrow: 1,
		gridColumn: 1,
		position: 'absolute',
		top: theme.spacing(8),
		left: 0,
		right: DRAWER_WIDTH,
		bottom: 0,
		[theme.breakpoints.down('sm')]: {
			right: 0,
			top: theme.spacing(7)
		}
	},
	emptyChatArea: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		padding: theme.spacing(2),
		overflow: 'auto',
		flexGrow: 1
	},
	skeletonText: {
		marginLeft: theme.spacing(2),
		width: 'min(300px, 50vw)'
	},
	infoPanel: {
		width: `min(${DRAWER_WIDTH}, 80vw)`,
		height: '100%',
		gridColumn: 2
	}
}));

export interface ChannelDisplayData {
	title: string;
	image?: string;
}

const selectChannelResource = (channel: APIDMChannel|APIEventChannel|undefined, meId: string) => {
	if (channel?.type === 'dm') {
		return selectUserById(channel.users.find(userId => userId !== meId)!);
	}
	return () => undefined;
};

enum ViewType {
	Messages = 'messages',
	Video = 'video'
}

export default function ChatPanel(props) {
	const classes = useStyles();
	const theme = useTheme();
	const isMobile = useMediaQuery({ query: `(max-width: ${theme.breakpoints.values.sm}px)` });
	const isSmall = useMediaQuery({ query: `(max-width: ${theme.breakpoints.values.md - 1}px)` });
	const dispatch = useCallback(useDispatch(), []);
	const { id: channelID, type: viewTypeRaw } = useParams<{ id: string; type: string }>();
	const [hasEnded, setHasEnded] = useState(false);
	const history = useHistory();

	const matchedData = useSelector(selectQueueMatch);
	const hasUserChanges = useSelector(selectHasUserChanges);

	const me = useSelector(selectMe);

	const channel = useSelector(selectChannel(channelID));
	const resource: APIUser|undefined = useSelector(selectChannelResource(channel, me!.id));

	useEffect(() => {
		if (channel?.type === 'dm' && channel.video) {
			const endTime = new Date(channel.video.endTime).getTime();
			if (Date.now() < endTime) {
				const timeout = setTimeout(() => setHasEnded(true), endTime - Date.now());
				return () => clearTimeout(timeout);
			}
		}
	}, [channel]);

	useEffect(() => {
		if (channelID && !channel) {
			dispatch(fetchChannels());
		}
	}, [channelID, channel, dispatch]);

	useEffect(() => {
		if (me && channel && !resource) {
			if (channel.type === 'dm') {
				dispatch(fetchUser(channel.users.find(userID => userID !== me.id)!));
			}
		}
	}, [channel, resource, me, dispatch]);

	const [_infoPanelOpen, setInfoPanelOpen] = useState(false);
	const infoPanelOpen = _infoPanelOpen || !isSmall;

	let displayData: ChannelDisplayData|undefined;
	if (resource) {
		const user = resource;
		displayData = {
			title: `${user.forename} ${user.surname}`,
			image: getIcon(user)
		};
	}

	const requestedViewType: ViewType = (viewTypeRaw === 'video' && channel?.type === 'dm') ? ViewType.Video : ViewType.Messages;

	const getVideoDetails = () => {
		if (!channel) return;
		if (channel.type !== 'dm') return;
		if (!channel.video) return;
		if (!me) return;
		const now = Date.now();
		if (now < new Date(channel.video.creationTime).getTime() || now > new Date(channel.video.endTime).getTime()) {
			return;
		}
		return channel.video?.users?.find(user => user.id === me.id)?.accessToken;
	};

	const videoToken = getVideoDetails();

	const viewType = (requestedViewType === ViewType.Video && videoToken) ? ViewType.Video : ViewType.Messages;

	const generateInfoPanel = () => <Box className={clsx(classes.infoPanel)}>
		{
			resource
				? <UserInfoPanel user={resource} channel={channel as APIDMChannel} onClose={() => setInfoPanelOpen(false)}/>
				: <CircularProgress />
		}
	</Box>;

	return (
		<Box className={classes.flexGrow}>
			<Box className={classes.chatPanel}>
				<AppBar position="static" color="inherit" elevation={2} className={classes.appBar}>
					<Toolbar>
						{ isMobile &&
							<IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={() => props.onOpenChannels()} >
								{
									hasUserChanges.length > 1 || (hasUserChanges.length === 1 && hasUserChanges[0] !== channelID)
										? <Badge variant="dot" color="secondary"><GroupIcon /></Badge>
										: <GroupIcon />
								}
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
										? <>
											{displayData.title}
										</>
										: <Skeleton animation="wave" variant="text" className={classes.skeletonText} />
								}
							</Typography>
							{
								channel && channel.type === 'dm' && channel.video && new Date(channel.video.endTime) > new Date() && <Timer endTime={new Date(channel.video.endTime)} />
							}
						</>
						}
						{
							isSmall && channelID && <IconButton edge="end" color="inherit" aria-label="info" onClick={() => setInfoPanelOpen(!_infoPanelOpen)} >
								<InfoOutlinedIcon />
							</IconButton>
						}
					</Toolbar>
				</AppBar>
				<Box className={classes.mainContent}>
					<Box className={clsx(classes.chatHolder, !channel && classes.noChat)}>
						{ channel
							? (
								viewType === ViewType.Messages
									? <MessagesPanel channel={channel} />
									: <VideoPanel channel={channel as APIDMChannel} videoJWT={videoToken!}/>
							)
							: <Box className={classes.emptyChatArea}>
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
			<NotificationDialog
				message="You'll be able to video chat with them for 5 minutes. After that, you'll be asked if you'd like to continue talking, or rejoin the networking queue!"
				onClose={() => {
					dispatch(setQueueState({ match: undefined }));
				}}
				show={Boolean(matchedData?.channelID === channelID && displayData)}
				title={`You've been matched with ${displayData?.title}!`}
			/>

			<Dialog
				open={Boolean(channel) && hasEnded}
				onClose={() => {
					setHasEnded(false);
					history.replace(history.location.pathname.replace('/video', ''));
				}}>
				<DialogTitle>Time's up!</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Your 5 minutes are up! You can continue chatting over text, or you can rejoin the networking queue!
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => {
						setHasEnded(false);
						history.replace(history.location.pathname.replace('/video', ''));
					}}>
						Continue Chatting
					</Button>
					<Button color="primary" onClick={() => {
						setHasEnded(false);
						history.push('/networking');
					}}>
						Chat to Someone New
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
}
