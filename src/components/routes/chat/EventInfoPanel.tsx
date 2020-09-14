import { Avatar, Typography } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import { APIEvent } from '@unicsmcr/unics_social_api_client';
import React from 'react';
import getIcon from '../../util/getAvatar';

const useStyles = makeStyles(theme => ({
	root: {
		padding: theme.spacing(2),
		display: 'flex',
		alignItems: 'center',
		flexDirection: 'column',
		height: '100%',
		width: '100%'
	},
	avatar: {
		width: theme.spacing(18),
		height: theme.spacing(18),
		margin: theme.spacing(4, 0)
	}
}));

interface EventInfoPanelProps {
	event: APIEvent;
}

export default function EventInfoPanel({ event }: EventInfoPanelProps) {
	const classes = useStyles();

	return <Box className={classes.root}>
		<Avatar className={classes.avatar} src={getIcon(event)} />
		<Typography variant="subtitle1" gutterBottom>
			{ event.title }
		</Typography>
	</Box>;
}
