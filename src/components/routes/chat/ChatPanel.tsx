import React, { useCallback, useEffect, useState } from 'react';

import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Avatar from '@material-ui/core/Avatar';
import grey from '@material-ui/core/colors/grey';
import IconButton from '@material-ui/core/IconButton';
import Card from '@material-ui/core/Card';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import { DRAWER_WIDTH } from './ChannelsPanel';
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
import UserInfoPanel from './UserInfoPanel';
import { Badge, CircularProgress, Drawer } from '@material-ui/core';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import EventInfoPanel from './EventInfoPanel';
import { selectHasUserChanges } from '../../../store/slices/ReadSlice';
import MessagesPanel from './MessagesPanel';
import VideoPanel from './VideoPanel';

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
		background: 'rgba(255, 255, 255, 0.6)',
		width: `min(${DRAWER_WIDTH}, 80vw)`,
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
	const { id: channelID, type: viewTypeRaw } = useParams();

	const hasUserChanges = useSelector(selectHasUserChanges);

	const me = useSelector(selectMe);

	const channel: APIDMChannel|APIEventChannel|undefined = useSelector(selectChannel(channelID));
	const resource: APIUser|APIEvent = useSelector(selectChannelResource(channel, me!.id));

	useEffect(() => {
		if (channelID && !channel) dispatch(fetchChannels());
	}, [channel, channelID, dispatch]);

	const [_infoPanelOpen, setInfoPanelOpen] = useState(false);
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

	const requestedViewType: ViewType = (viewTypeRaw === 'video' && channel?.type === 'dm') ? ViewType.Video : ViewType.Messages;

	const getVideoDetails = () => {
		if (!channel) return;
		if (channel.type !== 'dm') return;
		if (!channel.video) return;
		if (!me) return;
		const now = Date.now();
		if (now < new Date(channel.video.creationTime).getTime() || now > new Date(channel.video.endTime).getTime()) {
			return false;
		}
		return channel.video?.users?.find(user => user.id === me.id)?.accessToken;
	};

	const videoToken = getVideoDetails();

	const viewType = (requestedViewType === ViewType.Video && videoToken) ? ViewType.Video : ViewType.Messages;

	const generateInfoPanel = () => <Box className={clsx(classes.infoPanel)}>
		{
			resource
				? (
					resource.hasOwnProperty('forename')
						? <UserInfoPanel user={resource as APIUser} channel={channel as APIDMChannel} />
						: <EventInfoPanel event={resource as APIEvent} />
				)
				: <CircularProgress />
		}
	</Box>;

	return (
		<Card className={classes.flexGrow}>
			<Box className={classes.chatPanel}>
				<AppBar position="static" color="inherit" elevation={2} className={classes.appBar}>
					<Toolbar>
						{ isMobile &&
							<IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={() => props.onOpenChannels()} >
								{
									hasUserChanges.length > 1 || (hasUserChanges.length === 1 && hasUserChanges[0].id !== channelID)
										? <Badge variant="dot" color="secondary"><MenuIcon /></Badge>
										: <MenuIcon />
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
										? displayData.title
										: <Skeleton animation="wave" variant="text" className={classes.skeletonText} />
								}
							</Typography>
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
					<Box className={classes.chatHolder}>
						{ channel
							? (
								viewType === ViewType.Messages
									? <MessagesPanel channel={channel} />
									: <VideoPanel channel={channel as APIDMChannel} />
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
		</Card>
	);
}
