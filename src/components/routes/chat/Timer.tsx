import React, { useEffect, useState } from 'react';
import { Chip, createMuiTheme, ThemeProvider } from '@material-ui/core';
import moment from 'moment';
import yellow from '@material-ui/core/colors/yellow';

interface TimerProps {
	endTime: Date;
}

function padTime(n: string) {
	return n.length === 1 ? `0${n}` : n;
}

export default function Timer({ endTime }: TimerProps) {
	const [diff, setDiff] = useState(moment(endTime).diff(new Date()));

	useEffect(() => {
		const interval = setInterval(() => {
			setDiff(moment(endTime).diff(new Date()));
		}, 500);

		return () => clearInterval(interval);
	}, [endTime]);

	const duration = moment.duration(Math.max(diff, 0));
	return <ThemeProvider theme={createMuiTheme({
		palette: {
			primary: {
				main: yellow[400]
			}
		}
	})}>
		<Chip label={`${duration.get('minutes')}:${padTime(duration.get('seconds').toString())}`} color="primary" />
	</ThemeProvider>;
}
