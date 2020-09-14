import React, { useCallback, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Avatar from '@material-ui/core/Avatar';
import grey from '@material-ui/core/colors/grey';
import { makeStyles } from '@material-ui/core/styles';
import Message from './Message';
import { OptimisedAPIMessage } from '../../../store/slices/MessagesSlice';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser, selectUserById } from '../../../store/slices/UsersSlice';
import getIcon from '../../util/getAvatar';
import { Skeleton } from '@material-ui/lab';
import clsx from 'clsx';

export enum Align {
	Left = 'left',
	Right = 'right'
}

interface MessageGroupProps {
	authorID: string;
	messages: OptimisedAPIMessage[];
	align: Align;
}

const useStyles = makeStyles(theme => ({
	messageGroup: {
		display: 'block',
		padding: theme.spacing(2),
		background: grey[200],
		borderRadius: theme.spacing(4)
	},
	avatar: {
		marginRight: theme.spacing(1),
		width: theme.spacing(4),
		height: theme.spacing(4)
	},
	userInfo: {
		display: 'flex',
		alignItems: 'center',
		marginBottom: theme.spacing(1)
	},
	skeletonBlock: {
		'display': 'grid',
		'gridTemplateColumns': '40px auto',
		'gap': '0.5rem',
		'width': '100%',
		'maxWidth': '40ch',
		'& > *:last-child': {
			gridColumn: '1 / -1'
		}
	}
}));

export function createGroups(messages: OptimisedAPIMessage[], relativeTo: string) {
	const groups: OptimisedAPIMessage[][] = [];
	let currentGroup: OptimisedAPIMessage[] = [];
	for (const message of messages) {
		if (currentGroup.length === 0) {
			currentGroup.push(message);
			continue;
		}
		if (message.authorID === currentGroup[0].authorID) {
			currentGroup.push(message);
		} else {
			groups.push(currentGroup);
			currentGroup = [message];
		}
	}
	groups.push(currentGroup);
	return groups.filter(group => group.length > 0).map((group, index) => <MessageGroup
		key={index}
		align={group[0].authorID === relativeTo ? Align.Right : Align.Left}
		messages={group}
		authorID={group[0].authorID}
	/>);
}

export default function MessageGroup({ messages, align, authorID }: MessageGroupProps) {
	const classes = useStyles();
	const author = useSelector(selectUserById(authorID));
	const dispatch = useCallback(useDispatch(), []);

	useEffect(() => {
		if (!author) dispatch(fetchUser(authorID));
	}, [author, authorID, dispatch]);

	if (!author) {
		return <Box style={{ textAlign: align }}>
			<Box className={clsx(classes.userInfo, classes.skeletonBlock)} >
				<Skeleton variant="circle" width={40} height={40} />
				<Skeleton variant="text" />
				<Skeleton variant="rect" height={Math.max(Math.min(200, messages.length * 50), 100)} />
			</Box>
		</Box>;
	}

	return <Box style={{ textAlign: align }}>
		{ align === Align.Left && <Box className={classes.userInfo} >
			<Avatar src={getIcon(author)} className={classes.avatar} />
			<Typography variant="subtitle2">
				{author.forename}
			</Typography>
		</Box>
		}
		{
			messages.map(message => <Message content={message.content} id={message.id} isOwn={align === Align.Right} key={message.id} />)
		}
	</Box>;
}
