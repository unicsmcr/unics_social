import { Box, Button, Container, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { joinDiscoveryQueue, leaveDiscoveryQueue, QueueStatus, selectQueueState } from '../../../store/slices/AuthSlice';
import Page from '../../Page';
import NotificationDialog from '../../util/NotificationDialog';

const useStyles = makeStyles(theme => ({
	root: {
		minHeight: '60vh'
	},
	heroContent: {
		padding: theme.spacing(8, 2, 0, 2)
	},
	mainContent: {
		padding: theme.spacing(8, 2, 0, 2),
		textAlign: 'center'
	}
}));

function JoinQueue() {
	const dispatch = useDispatch();
	return <Button variant="contained" color="primary" onClick={() => {
		dispatch(joinDiscoveryQueue({ sameYear: true }));
	}}>Join the queue</Button>;
}

function InQueue() {
	const dispatch = useDispatch();
	return <Button variant="contained" color="primary" onClick={() => {
		dispatch(leaveDiscoveryQueue());
	}}>Leave the queue</Button>;
}

export default function NetworkingPage() {
	const classes = useStyles();
	const queueState = useSelector(selectQueueState);

	const generateBody = () => {
		switch (queueState.status) {
			case QueueStatus.Idle:
				return <JoinQueue />;
			case QueueStatus.InQueue:
				return <InQueue />;
			default:
				return <h2>hi</h2>;
		}
	};

	return <Page>
		<Box className={classes.root}>
			{/* Hero unit */}
			<Container maxWidth="sm" component="main" className={classes.heroContent}>
				<Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
				1-to-1 Networking
				</Typography>
				<Typography variant="h5" align="center" color="textSecondary" component="p">
				Meet new people here!
				</Typography>
			</Container>
			<Container maxWidth="sm" component="section" className={classes.mainContent}>
				{
					generateBody()
				}
			</Container>
			{/* End hero unit */}
			{/*
		<NotificationDialog
			title="Failed to login"
			message={state.formError}
			show={Boolean(state.formError)}
			onClose={() => setState({ ...state, formError: '' })}
		/>*/}
		</Box>
	</Page>;
}
