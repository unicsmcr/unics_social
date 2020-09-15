import React, { useCallback, useEffect } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser, selectMe, selectUserById } from '../../../store/slices/UsersSlice';
import { APIDMChannel } from '@unicsmcr/unics_social_api_client';
import { Skeleton } from '@material-ui/lab';
import { makeStyles, MenuItem, Typography } from '@material-ui/core';
import getIcon from '../../util/getAvatar';
import { useHistory } from 'react-router-dom';

export interface DMListItemProps {
	channel: APIDMChannel;
	selected: boolean;
}

const useStyles = makeStyles(() => ({
	loadingContainer: {
		display: 'grid',
		gridTemplateColumns: '40px 1fr',
		gap: '0.5rem'
	}
}));

export default function DMListItem({ channel, selected }: DMListItemProps) {
	const classes = useStyles();
	const me = useSelector(selectMe);
	const recipientID = channel.users.find(userID => userID !== me!.id);
	if (!recipientID) throw new Error('Recipient not found!');
	const recipient = useSelector(selectUserById(recipientID));
	const history = useHistory();

	const dispatch = useCallback(useDispatch(), []);
	useEffect(() => {
		if (!recipient) dispatch(fetchUser(recipientID));
	}, [recipient, dispatch, recipientID]);

	if (!recipient) {
		return <ListItem className={classes.loadingContainer}>
			<Skeleton animation="wave" variant="circle" width={40} height={40} />
			<Skeleton animation="wave" variant="text" />
		</ListItem>;
	}

	return <MenuItem button onClick={() => history.push(`/chats/${channel.id}`)} selected={selected}>
		<ListItemAvatar>
			<Avatar alt={recipient.forename} src={getIcon(recipient)}/>
		</ListItemAvatar>
		<ListItemText primary={<Typography noWrap>{`${recipient.forename} ${recipient.surname}`}</Typography>}/>
	</MenuItem>;
}
