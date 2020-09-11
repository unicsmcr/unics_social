import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import { APIEventChannel } from '@unicsmcr/unics_social_api_client';
import getIcon from '../../util/getAvatar';
import { Typography } from '@material-ui/core';

export interface EventListItemProps {
	channel: APIEventChannel;
	onClick: Function;
}

export default function EventListItem({ channel, onClick }: EventListItemProps) {
	return <ListItem button onClick={() => onClick()}>
		<ListItemAvatar>
			<Avatar alt={channel.event.title} src={getIcon(channel.event)}/>
		</ListItemAvatar>
		<ListItemText primary={<Typography noWrap>{channel.event.title}</Typography>}/>
	</ListItem>;
}
