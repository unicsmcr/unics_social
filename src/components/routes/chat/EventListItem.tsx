import React from 'react';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import { APIEventChannel } from '@unicsmcr/unics_social_api_client';
import getIcon from '../../util/getAvatar';
import { Badge, MenuItem, Typography } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import moment from 'moment';

export interface EventListItemProps {
	channel: APIEventChannel;
	selected: boolean;
	lastReadTime: number;
}

export default function EventListItem({ channel, selected, lastReadTime }: EventListItemProps) {
	const history = useHistory();

	const renderAvatar = () => <Avatar alt={channel.event.title} src={getIcon(channel.event)}/>;

	return <MenuItem button onClick={() => history.push(`/chats/${channel.id}`)} selected={selected}>
		<ListItemAvatar>
			{
				lastReadTime > new Date(channel.lastUpdated).getTime() || selected
					? renderAvatar()
					: <Badge color="secondary" variant="dot">
						{ renderAvatar() }
					</Badge>
			}
		</ListItemAvatar>
		<ListItemText
			primary={<Typography noWrap>{channel.event.title}</Typography>}
			secondary={moment(channel.lastUpdated).fromNow()}
		/>
	</MenuItem>;
}
