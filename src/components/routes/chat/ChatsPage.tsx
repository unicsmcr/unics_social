import React from 'react';

import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import Page from '../../Page';
import { Paper } from '@material-ui/core';
import ChannelsPanel from './ChannelsPanel';

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

	return (
		<Page>
			<Container maxWidth="xl" component="main" className={classes.mainContent}>
				<Paper elevation={3} className={classes.chatsRoot}>
					<ChannelsPanel onChannelSelected={channel => console.log(channel)}/>
					<div className={classes.flexGrow}>
						<Typography>hi</Typography>
					</div>
				</Paper>
			</Container>
		</Page>
	);
}
