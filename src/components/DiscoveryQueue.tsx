import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { QueueState, selectQueueState, QueueStatus, joinDiscoveryQueue, leaveDiscoveryQueue } from '../store/slices/AuthSlice';
import { Container, Typography, Button, Checkbox, FormControlLabel, Grid, CircularProgress, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

function InQueue() {
	const dispatch = useDispatch();

	return (
		<Grid
			container
			direction="column"
			justify="center"
			alignItems="center"
			spacing={3}
		>
			<Grid item>
				<CircularProgress />
			</Grid>
			<Grid item>
				<Typography className="h2">You're queued up! We'll notify you when we find a match.</Typography>
			</Grid>
			<Grid item direction="row">
				<IconButton
					color="secondary"
					onClick={() => dispatch(leaveDiscoveryQueue())}>
					<CloseIcon />
					<Typography>Leave queue</Typography>
				</IconButton>
			</Grid>
		</Grid>
	);
}


function IdleQueue(props: { errorMessage?: string }) {
	const [sameYear, setSameYear] = useState(false);
	const dispatch = useDispatch();

	return (
		<Grid
			container
			direction="column"
			justify="center"
			alignItems="center"
			spacing={3}
		>
			{props.errorMessage !== undefined &&
				// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
				<Grid item>
					<Typography color="error">{props.errorMessage}</Typography>
				</Grid>}
			<Button
				className="h2"
				color="primary"
				onClick={() => dispatch(joinDiscoveryQueue({ sameYear }))}>
				Queue up
			</Button>
			<FormControlLabel
				control={
					<Checkbox
						checked={sameYear}
						onChange={event => setSameYear(event.target.checked)}
					/>
				}
				label="Same year?"
			/>
		</Grid>
	);
}

function Joining() {
	return (
		<Grid
			container
			direction="column"
			justify="center"
			alignItems="center"
			spacing={3}
		>
			<Grid item>
				<CircularProgress />
			</Grid>
			<Grid item>
				<Typography className="h2">Adding you to the queue...</Typography>
			</Grid>
		</Grid>
	);
}

function Leaving() {
	return (
		<Grid
			container
			direction="column"
			justify="center"
			alignItems="center"
			spacing={3}
		>
			<Grid item>
				<CircularProgress />
			</Grid>
			<Grid item>
				<Typography className="h2">Removing you from the queue...</Typography>
			</Grid>
		</Grid>
	);
}

export default function DiscoveryQueue() {
	const queueState: QueueState = useSelector(selectQueueState);
	const renderComponent = () => {
		switch (queueState.status) {
			case QueueStatus.InQueue:
				return <InQueue />;
			case QueueStatus.Idle:
				return <IdleQueue />;
			case QueueStatus.Joining:
				return <Joining />;
			case QueueStatus.Leaving:
				return <Leaving />;
			case QueueStatus.Failed:
				return <IdleQueue errorMessage={queueState.errorMessage} />;
		}
	};

	return (
		<Container style={{ padding: 20 }}>
			{renderComponent()}
		</Container>
	);
}
