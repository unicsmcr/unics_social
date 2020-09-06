import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';

export interface ChannelListItemProps {
	name: string;
	src: string;
	onClick: Function;
}

export default function ChannelListItem({ name, src, onClick }: ChannelListItemProps) {
	return <ListItem button onClick={() => onClick()}>
		<ListItemAvatar>
			<Avatar alt={name} src={src}/>
		</ListItemAvatar>
		<ListItemText primary={name} />
	</ListItem>;
}
