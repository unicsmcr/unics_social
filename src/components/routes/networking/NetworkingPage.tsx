import { Box, Button, Checkbox, CircularProgress, Container, FormControlLabel, FormGroup, LinearProgress, makeStyles, Paper, Typography } from '@material-ui/core';
import { getDepartmentFromCourse } from '@unicsmcr/unics_social_api_client';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { joinDiscoveryQueue, leaveDiscoveryQueue, QueueStatus, selectQueueOptions, selectQueueState, setQueueState } from '../../../store/slices/AuthSlice';
import { selectMe } from '../../../store/slices/UsersSlice';
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
	paddedPg: {
		padding: theme.spacing(1, 0),
		textAlign: 'justify',
		textJustify: 'inter-word'
	},
	padded: {
		marginTop: theme.spacing(2),
		padding: theme.spacing(2)
	},
	marginTop: {
		marginTop: theme.spacing(4)
	},
	form: {
		textAlign: 'left'
	},
	formInput: {
		marginBottom: theme.spacing(1)
	}
}));

function JoinQueue() {
	const dispatch = useDispatch();
	const uxOptions = useSelector(selectQueueOptions);
	const classes = useStyles();
	const me = useSelector(selectMe)!;

	const [matchOptions, setMatchOptions] = useState<{ sameYear: boolean; sameDepartment: boolean }>({
		sameYear: true,
		sameDepartment: true
	});

	return <>
		<Typography variant="body1" align="center" component="p" className={classes.paddedPg}>
			Welcome to KB Networking! This is a great place to find new friends, and we're happy you're here.
		</Typography>
		<Typography variant="body1" align="center" component="p" className={classes.paddedPg}>
			Click the button below to join the Networking Queue. Here, we'll try to pair you up with someone that you've not spoken to on KB before. Once you're paired up, you have 5 minutes to chat to each other! You're able to video chat for this time after you've been paired, and chat over text for however long you want!
		</Typography>
		<Typography variant="body1" align="center" component="p" className={classes.paddedPg}>
			Once your 5 minutes are over, you'll have the option to join the queue again and be paired with someone new, or continue your conversation if it's going well!
		</Typography>
		<Typography variant="body1" align="center" component="p" className={classes.paddedPg}>
			If it's not going so well, you can end the call whenever you want. We hope this will never be the case, but if you come across any abusive and/or disturbing actions, please block the user and report them to us, where we will then pass on their details and your report to the Student Support Office (SSO).
		</Typography>
		<Paper elevation={2} className={classes.padded}>
			<FormGroup className={classes.form}>
				<FormControlLabel
					className={classes.formInput}
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
					className={classes.formInput}
					control={
						<Checkbox
							checked={matchOptions.sameDepartment}
							onChange={e => setMatchOptions({ ...matchOptions, sameDepartment: e.target.checked })}
							name="sameYear"
							color="primary"
						/>
					}
					label={`Only match within the ${getDepartmentFromCourse(me.profile!.course)}`}
				/>
				<FormControlLabel
					className={classes.formInput}
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
		}}>Chat to someone new!</Button>
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
					Networking
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
