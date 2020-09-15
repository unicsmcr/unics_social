import React from 'react';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import { APIEventChannel } from '@unicsmcr/unics_social_api_client';
import getIcon from '../../util/getAvatar';
import { MenuItem, Typography } from '@material-ui/core';
import { useHistory } from 'react-router-dom';

export interface EventListItemProps {
	channel: APIEventChannel;
	selected: boolean;
}

export default function EventListItem({ channel, selected }: EventListItemProps) {
	const history = useHistory();
	return <MenuItem button onClick={() => history.push(`/chats/${channel.id}`)} selected={selected}>
		<ListItemAvatar>
			<Avatar alt={channel.event.title} src={getIcon(channel.event)}/>
		</ListItemAvatar>
		<ListItemText primary={<Typography noWrap>{channel.event.title}</Typography>}/>
	</MenuItem>;
}
