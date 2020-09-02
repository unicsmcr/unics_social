import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { QueueState, selectQueueState, QueueStatus } from '../store/slices/AuthSlice';
import { Container, Typography, Button, Checkbox, FormControlLabel } from '@material-ui/core';

function InQueue() {
	return (
		<Container>
			<Typography className="h2">You're queued up! We'll notify you when we find a match.</Typography>
		</Container>
	);
}


function IdleQueue() {
	const [sameYear, setSameYear] = useState(false);

	return (
		<Container>
			<Button className="h2">Queue up</Button>
			<FormControlLabel
				control={
					<Checkbox
						checked={sameYear}
						onChange={event => setSameYear(event.target.checked)}
					/>
				}
				label="Same year?"
			/>
		</Container>
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
			default:
				return <Typography>def</Typography>;
		}
	};

	return (
		<Container>
			{renderComponent()}
		</Container>
	);
}
