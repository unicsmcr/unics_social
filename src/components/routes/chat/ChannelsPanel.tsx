import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import { useSelector } from 'react-redux';
import { selectChannelsSorted } from '../../../store/slices/ChannelsSlice';
import { APIDMChannel, APIEventChannel } from '@unicsmcr/unics_social_api_client';
import DMListItem from './DMListItem';
import { useParams } from 'react-router-dom';
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
		width: DRAWER_WIDTH,
		overflow: 'auto',
		height: '100%'
	}
}));

export default function ChannelsPanel() {
	const classes = useStyles();
	const { id } = useParams<{ id: string }>();
	const [lastRefreshed, setLastRefreshed] = React.useState(Date.now());
	const readTimes = useSelector(selectReadTimes);

	// Trigger re-render of "moment" timestamps
	useEffect(() => {
		const timeout = setTimeout(() => setLastRefreshed(Date.now()), 60e3);
		return () => clearTimeout(timeout);
	}, [lastRefreshed]);

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

	const generateList = () => dmChannels.map((channel, index) => (
		<div key={channel.id}>
			{
				index !== 0 && <Divider />
			}
			<DMListItem channel={channel} selected={channel.id === id} lastReadTime={readTimes[channel.id] || startTime} />
		</div>
	));

	return <Box className={classes.root}>
		<div className={classes.channelsPanel}>
			<List component="nav" aria-label="channels" >
				{
					generateList()
				}
			</List>
		</div>
	</Box>;
}
