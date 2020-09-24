import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import { useSelector } from 'react-redux';
import { selectChannelsSorted } from '../../../store/slices/ChannelsSlice';
import { APIDMChannel, APIEventChannel, NoteType } from '@unicsmcr/unics_social_api_client';
import DMListItem from './DMListItem';
import { useParams } from 'react-router-dom';
import { selectReadTimes, startTime } from '../../../store/slices/ReadSlice';
import { selectNotesByType } from '../../../store/slices/NotesSlice';
import { selectMe } from '../../../store/slices/UsersSlice';
import { Button } from '@material-ui/core';

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
	const blocked = useSelector(selectNotesByType(NoteType.Blocked)).map(note => note.targetUserID);
	const me = useSelector(selectMe);

	const [showBlocked, setShowBlocked] = useState(false);

	// Trigger re-render of "moment" timestamps
	useEffect(() => {
		const timeout = setTimeout(() => setLastRefreshed(Date.now()), 60e3);
		return () => clearTimeout(timeout);
	}, [lastRefreshed]);

	const channels = useSelector(selectChannelsSorted);

	const eventChannels: APIEventChannel[] = [];
	const dmChannels: APIDMChannel[] = [];
	const blockedDmChannels: APIDMChannel[] = [];

	for (const channel of channels) {
		if (channel.type === 'dm') {
			const otherUser = channel.users.find(userID => userID !== me!.id);
			if (otherUser) {
				if (blocked.includes(otherUser)) {
					blockedDmChannels.push(channel);
				} else {
					dmChannels.push(channel);
				}
			}
		} else {
			eventChannels.push(channel);
		}
	}

	const generateList = (channels: APIDMChannel[], times = true) => channels.map((channel, index) => (
		<div key={channel.id}>
			{
				index !== 0 && <Divider />
			}
			<DMListItem channel={channel} selected={channel.id === id} lastReadTime={times ? (readTimes[channel.id] || startTime) : undefined} />
		</div>
	));

	return <Box className={classes.root}>
		<div className={classes.channelsPanel}>
			<List aria-label="channels" >
				{
					generateList(dmChannels)
				}
			</List>
			{
				blockedDmChannels.length > 0 && (
					<>
						<Button onClick={() => setShowBlocked(!showBlocked)}>{showBlocked ? 'Hide' : 'Show'} {blockedDmChannels.length} blocked user{blockedDmChannels.length > 1 ? 's' : ''}</Button>
						{
							showBlocked && <List aria-label="blocked_channels" >
								{
									generateList(blockedDmChannels, false)
								}
							</List>
						}
					</>
				)
			}
		</div>
	</Box>;
}
