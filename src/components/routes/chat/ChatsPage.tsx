import React, { useState } from 'react';

import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import Page from '../../Page';
import { Paper } from '@material-ui/core';
import ChannelsPanel from './ChannelsPanel';
import ChatPanel from './ChatPanel';

const useStyles = makeStyles(theme => ({
	mainContent: {
		padding: theme.spacing(6, 2, 14, 2),
		textAlign: 'center'
	},
	chatsRoot: {
		display: 'flex'
	},
	flexGrow: {
		flexGrow: 1
	}
}));

export default function ChatsPage() {
	const classes = useStyles();
	const [channelsPanelOpen, setChannelsPanelOpen] = useState(false);
	const [channel, setChannel] = useState<{ name: string; avatar: string }>({
		name: 'Blank',
		avatar: ''
	});

	return (
		<Page>
			<Container maxWidth="lg" component="main" className={classes.mainContent}>
				<Paper elevation={3} className={classes.chatsRoot}>
					<ChannelsPanel onChannelSelected={channel => setChannel(channel)} open={channelsPanelOpen} onClose={() => setChannelsPanelOpen(false)}/>
					<ChatPanel channel={channel} onChannelsMenuClicked={() => setChannelsPanelOpen(true)} />
				</Paper>
			</Container>
		</Page>
	);
}
