import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import grey from '@material-ui/core/colors/grey';
import { useSelector } from 'react-redux';
import { selectChannel, selectChannelsSorted } from '../../../store/slices/ChannelsSlice';
import { APIChannel, APIDMChannel, APIEventChannel } from '@unicsmcr/unics_social_api_client';
import DMListItem from './DMListItem';
import EventListItem from './EventListItem';
import { useParams } from 'react-router-dom';
import { Badge } from '@material-ui/core';
import { selectReadTimes, startTime } from '../../../store/slices/ReadSlice';

export const DRAWER_WIDTH = '20rem';

const useStyles = makeStyles(theme => ({
	root: {
		[theme.breakpoints.up('sm')]: {
			position: 'absolute',
			left: 0,
			top: 0,
			bottom: 0
		}
	},
	channelsPanel: {
		width: DRAWER_WIDTH
	},
	channelsList: {
		overflow: 'auto'
	},
	tab: {
		height: theme.spacing(8),
		[theme.breakpoints.down('xs')]: {
			height: theme.spacing(7)
		}
	},
	appBar: {
		background: grey[800]
	}
}));

export default function ChannelsPanel() {
	const classes = useStyles();
	const { id } = useParams();
	const [chatPanelValue, setChatPanelValue] = React.useState(0);
	const [lastRefreshed, setLastRefreshed] = React.useState(Date.now());

	const readTimes = useSelector(selectReadTimes);

	// Trigger re-render of "moment" timestamps
	useEffect(() => {
		const timeout = setTimeout(() => setLastRefreshed(Date.now()), 60e3);
		return () => clearTimeout(timeout);
	}, [lastRefreshed]);

	const selectedChannel = useSelector(selectChannel(id));

	useEffect(() => {
		setChatPanelValue(selectedChannel && selectedChannel.type === 'event' ? 1 : 0);
	}, [selectedChannel]);

	const channels = useSelector(selectChannelsSorted);

	const eventChannels: APIEventChannel[] = [];
	const dmChannels: APIDMChannel[] = [];

	for (const channel of channels) {
		if (channel.type === 'dm') {
			dmChannels.push(channel);
		} else {
			eventChannels.push(channel);
		}
	}

	const generateList = () => {
		if (chatPanelValue === 0) {
			return dmChannels.map((channel, index) => (
				<div key={channel.id}>
					{
						index !== 0 && <Divider />
					}
					<DMListItem channel={channel} selected={channel.id === id} lastReadTime={readTimes[channel.id] || startTime} />
				</div>
			));
		}
		return eventChannels.map((channel, index) => (
			<div key={channel.id}>
				{
					index !== 0 && <Divider />
				}
				<EventListItem channel={channel} selected={channel.id === id} lastReadTime={readTimes[channel.id] || startTime} />
			</div>
		));
	};

	const makeTab = (text: string, shouldBadge: boolean) => shouldBadge
		? <Badge variant="dot" color="secondary">
			{ text }
		</Badge>
		: text;

	const channelNewUpdates = (channel: APIChannel) => new Date(channel.lastUpdated).getTime() > (readTimes[channel.id] || startTime);

	return <Box className={classes.root}>
		<div className={classes.channelsPanel}>
			<AppBar position="static" className={classes.appBar}>
				<Tabs variant="fullWidth" value={chatPanelValue} onChange={(_, v) => setChatPanelValue(v)} indicatorColor="secondary" textColor="inherit">
					<Tab label={makeTab('Users', dmChannels.some(channelNewUpdates))} className={classes.tab}/>
					<Tab label={makeTab('Events', eventChannels.some(channelNewUpdates))} className={classes.tab} />
				</Tabs>
			</AppBar>
			<List component="nav" aria-label="channels" className={classes.channelsList} >
				{
					generateList()
				}
			</List>
		</div>
	</Box>;
}
