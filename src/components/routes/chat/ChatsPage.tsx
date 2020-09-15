import React, { useCallback, useEffect, useState } from 'react';

import Container from '@material-ui/core/Container';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import ChatPanel from './ChatPanel';
import FocusedPage from '../../FocusedPage';
import { useDispatch } from 'react-redux';
import { fetchChannels } from '../../../store/slices/ChannelsSlice';
import ChannelsPanel from './ChannelsPanel';
import { Drawer } from '@material-ui/core';
import { useMediaQuery } from 'react-responsive';
import { useParams } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
	mainContent: {
		padding: theme.spacing(6, 2, 14, 2),
		textAlign: 'center'
	},
	chatsRoot: {
		display: 'flex',
		position: 'absolute',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
		borderRadius: '0 !important'
	},
	flexGrow: {
		flexGrow: 1
	}
}));

export default function ChatsPage() {
	const classes = useStyles();
	const theme = useTheme();
	const dispatch = useCallback(useDispatch(), []);
	const isMobile = useMediaQuery({ query: `(max-width: ${theme.breakpoints.values.sm}px)` });

	const [drawerOpen, setDrawerOpen] = useState(false);

	const { id: channelID } = useParams();

	useEffect(() => {
		dispatch(fetchChannels());
	}, [dispatch]);

	useEffect(() => {
		setDrawerOpen(!Boolean(channelID));
	}, [channelID]);

	return (
		<FocusedPage>
			<Container maxWidth="lg" component="main" className={classes.mainContent}>
				<Paper elevation={3} className={classes.chatsRoot}>
					{
						isMobile
							? <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
								<ChannelsPanel />
							</Drawer>
							: <ChannelsPanel />
					}
					<ChatPanel onOpenChannels={() => setDrawerOpen(true)} />
				</Paper>
			</Container>
		</FocusedPage>
	);
}
