import React, { useEffect } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser, selectMe, selectUserById } from '../../../store/slices/UsersSlice';
import { APIDMChannel } from '@unicsmcr/unics_social_api_client';
import { Skeleton } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core';
import getIcon from '../../util/getAvatar';

export interface DMListItemProps {
	channel: APIDMChannel;
	onClick: Function;
}

const useStyles = makeStyles(() => ({
	loadingContainer: {
		display: 'grid',
		gridTemplateColumns: '40px 1fr',
		gap: '0.5rem'
	}
}));

export default function DMListItem({ channel, onClick }: DMListItemProps) {
	const classes = useStyles();
	const me = useSelector(selectMe);
	const recipientID = channel.users.find(userID => userID !== me!.id);
	if (!recipientID) throw new Error('Recipient not found!');
	const recipient = useSelector(selectUserById(recipientID));

	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(fetchUser(recipientID));
	}, []);

	if (!recipient) {
		return <ListItem className={classes.loadingContainer}>
			<Skeleton animation="wave" variant="circle" width={40} height={40} />
			<Skeleton animation="wave" variant="text" />
		</ListItem>;
	}

	return <ListItem button onClick={() => onClick()}>
		<ListItemAvatar>
			<Avatar alt={recipient.forename} src={getIcon(recipient)}/>
		</ListItemAvatar>
		<ListItemText primary={`${recipient.forename} ${recipient.surname}`} />
	</ListItem>;
}