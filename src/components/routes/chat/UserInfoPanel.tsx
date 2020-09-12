import { Avatar, Typography } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import { APIDMChannel, APIUser } from '@unicsmcr/unics_social_api_client';
import React from 'react';
import getIcon from '../../util/getAvatar';
import { ChannelDisplayData } from './ChatPanel';

const useStyles = makeStyles(theme => ({
	root: {
		padding: theme.spacing(2),
		background: 'rgba(255, 255, 255, 0.6)',
		display: 'flex',
		alignItems: 'center',
		flexDirection: 'column'
	},
	avatar: {
		width: theme.spacing(18),
		height: theme.spacing(18),
		margin: theme.spacing(4, 0)
	}
}));

interface UserInfoPanelProps {
	user: APIUser;
}

export default function UserInfoPanel({ user }: UserInfoPanelProps) {
	const classes = useStyles();

	return <Box className={classes.root}>
		<Avatar className={classes.avatar} src={getIcon(user)} />
		<Typography variant="subtitle1">
			{ user.forename } {user.surname}
		</Typography>
		{
			user.profile && <Typography variant="subtitle2">
				{ user.profile.course } - { user.profile.yearOfStudy }
			</Typography>
		}
	</Box>;
}
