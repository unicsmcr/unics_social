import React, { useEffect } from 'react';

import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import ChatPanel from './ChatPanel';
import FocusedPage from '../../FocusedPage';
import { useDispatch } from 'react-redux';
import { fetchChannels } from '../../../store/slices/ChannelsSlice';
import ChannelsPanel from './ChannelsPanel';

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
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(fetchChannels());
	}, []);

	return (
		<FocusedPage>
			<Container maxWidth="lg" component="main" className={classes.mainContent}>
				<Paper elevation={3} className={classes.chatsRoot}>
					<ChannelsPanel />
					<ChatPanel />
				</Paper>
			</Container>
		</FocusedPage>
	);
}
