import React, { useEffect } from 'react';

import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import ChatPanel from './ChatPanel';
import FocusedPage from '../../FocusedPage';
import { useDispatch } from 'react-redux';
import { fetchChannels } from '../../../store/slices/ChannelsSlice';
import ChannelsPanel from './ChannelsPanel';
import { Route } from 'react-router-dom';

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
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<FocusedPage>
			<Container maxWidth="lg" component="main" className={classes.mainContent}>
				<Paper elevation={3} className={classes.chatsRoot}>
					<Route path="/chats/:id" render={props => (
						<>
							<ChannelsPanel {...props} />
							<ChatPanel {...props} />
						</>
					)} />
					<Route exact path="/chats" component={ChatPanel} />
				</Paper>
			</Container>
		</FocusedPage>
	);
}
