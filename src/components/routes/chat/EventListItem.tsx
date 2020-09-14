import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import { APIEventChannel } from '@unicsmcr/unics_social_api_client';
import getIcon from '../../util/getAvatar';
import { Typography } from '@material-ui/core';
import { useHistory } from 'react-router-dom';

export interface EventListItemProps {
	channel: APIEventChannel;
}

export default function EventListItem({ channel }: EventListItemProps) {
	const history = useHistory();
	return <ListItem button onClick={() => history.push(`/chats/${channel.id}`)}>
		<ListItemAvatar>
			<Avatar alt={channel.event.title} src={getIcon(channel.event)}/>
		</ListItemAvatar>
		<ListItemText primary={<Typography noWrap>{channel.event.title}</Typography>}/>
	</ListItem>;
}
