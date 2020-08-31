import React, { useState } from 'react';

import Typography from '@material-ui/core/Typography';
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
	const [channel, setChannel] = useState<{ name: string; avatar: string }>({
		name: 'Blank',
		avatar: ''
	});

	return (
		<Page>
			<Container maxWidth="xl" component="main" className={classes.mainContent}>
				<Paper elevation={3} className={classes.chatsRoot}>
					<ChannelsPanel onChannelSelected={channel => setChannel(channel)}/>
					<ChatPanel channel={channel} />
				</Paper>
			</Container>
		</Page>
	);
}
