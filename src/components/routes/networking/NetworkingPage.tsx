import { Box, Button, Checkbox, CircularProgress, Container, FormControlLabel, FormGroup, LinearProgress, makeStyles, Paper, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { joinDiscoveryQueue, leaveDiscoveryQueue, QueueStatus, selectQueueOptions, selectQueueState, setQueueState } from '../../../store/slices/AuthSlice';
import Page from '../../Page';

const useStyles = makeStyles(theme => ({
	root: {
		minHeight: '60vh'
	},
	heroContent: {
		padding: theme.spacing(8, 2, 0, 2)
	},
	mainContent: {
		padding: theme.spacing(0, 2, 0, 2),
		textAlign: 'center'
	},
	padded: {
		padding: theme.spacing(2)
	},
	marginTop: {
		marginTop: theme.spacing(4)
	},
	form: {
		textAlign: 'left'
	}
}));

function JoinQueue() {
	const dispatch = useDispatch();
	const uxOptions = useSelector(selectQueueOptions);
	const classes = useStyles();

	const [matchOptions, setMatchOptions] = useState<{ sameYear: boolean }>({
		sameYear: true
	});

	return <>
		<Typography variant="body1" align="center" color="textSecondary" component="p" className={classes.padded}>
				Join the 1:1 Networking Queue to be paired up with another random KB user! You'll be able to chat to each other for 5 minutes, and then you can either continue speaking to them or join the queue again.
		</Typography>
		<Paper elevation={2} className={classes.padded}>
			<FormGroup className={classes.form}>
				<FormControlLabel
					control={
						<Checkbox
							checked={matchOptions.sameYear}
							onChange={e => setMatchOptions({ ...matchOptions, sameYear: e.target.checked })}
							name="sameYear"
							color="primary"
						/>
					}
					label="Only match with users in the same year"
				/>
				<FormControlLabel
					control={
						<Checkbox
							checked={uxOptions.autoJoinVideo}
							onChange={e => dispatch(setQueueState({
								uxOptions: {
									...uxOptions,
									autoJoinVideo: e.target.checked
								}
							}))}
							name="autoJoinVideo"
							color="primary"
						/>
					}
					label="Join video automatically"
				/>
			</FormGroup>
		</Paper>
		<Button variant="contained" color="primary" className={classes.marginTop} onClick={() => {
			dispatch(joinDiscoveryQueue(matchOptions));
		}}>Join the queue</Button>
	</>;
}

function InQueue() {
	const dispatch = useDispatch();
	const classes = useStyles();
	return <>
		<Paper elevation={2}>
			<Typography variant="body1" align="center" color="textSecondary" component="p" className={classes.padded}>
				Trying to match you with someone else that's online right now... please wait!
			</Typography>
			<LinearProgress />
		</Paper>
		<Button variant="outlined" color="primary" className={classes.marginTop} onClick={() => {
			dispatch(leaveDiscoveryQueue());
		}}>Leave the queue</Button>
	</>;
}

function Failed() {
	const classes = useStyles();
	const state = useSelector(selectQueueState);
	const dispatch = useDispatch();
	return <>
		<Paper elevation={2}>
			<Typography variant="body1" align="center" color="textSecondary" component="p" className={classes.padded}>
				{ state.errorMessage }
			</Typography>
			<LinearProgress />
		</Paper>
		<Button variant="outlined" color="primary" className={classes.marginTop} onClick={() => {
			dispatch(setQueueState({
				errorMessage: '',
				status: QueueStatus.Idle
			}));
		}}>Try again</Button>
	</>;
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
			case QueueStatus.Joining:
			case QueueStatus.Leaving:
				return <CircularProgress />;
			case QueueStatus.Failed:
				return <Failed />;
		}
	};

	return <Page>
		<Box className={classes.root}>
			{/* Hero unit */}
			<Container maxWidth="sm" component="main" className={classes.heroContent}>
				<Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
				1-to-1 Networking
				</Typography>
			</Container>
			<Container maxWidth="sm" component="section" className={classes.mainContent}>
				{
					generateBody()
				}
			</Container>
			{/* End hero unit */}
		</Box>
	</Page>;
}
