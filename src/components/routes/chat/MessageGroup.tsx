import React, { useCallback, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Message from './Message';
import { OptimisedAPIMessage } from '../../../store/slices/MessagesSlice';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser, selectUserById } from '../../../store/slices/UsersSlice';
import { Skeleton } from '@material-ui/lab';
import clsx from 'clsx';
import moment from 'moment';
import { grey } from '@material-ui/core/colors';

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
		paddingBottom: theme.spacing(1)
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
	},
	rightAlign: {
		justifyContent: 'flex-end'
	},
	dateBox: {
		display: 'grid',
		gridTemplateColumns: 'auto min-content auto',
		alignItems: 'center',
		gap: '1rem',
		margin: theme.spacing(1, 0, 1, 0)
	},
	dateLine: {
		background: grey[500],
		height: 1
	}
}));

export function DateSeparator({ date }: { date: Date }) {
	const classes = useStyles();
	return <Box className={classes.dateBox}>
		<Box className={classes.dateLine} />
		<Typography variant="subtitle2" color="textSecondary" noWrap>{ moment(date).format('MMMM Do YYYY') }</Typography>
		<Box className={classes.dateLine} />
	</Box>;
}

function sameDay(day1: Date, day2: Date) {
	return day1.getDate() === day2.getDate() &&
		day1.getMonth() === day2.getMonth() &&
		day1.getFullYear() === day2.getFullYear();
}

export function createGroups(messages: OptimisedAPIMessage[], relativeTo: string) {
	const groups: (OptimisedAPIMessage[]|Date)[] = [];
	let currentGroup: OptimisedAPIMessage[] = [];
	for (const message of messages) {
		if (currentGroup.length === 0) {
			if (groups.length === 0) {
				groups.push(new Date(message.time));
			}
			currentGroup.push(message);
			continue;
		}
		const lastMessage = currentGroup[currentGroup.length - 1];
		const oldDate = new Date(lastMessage.time);
		const newDate = new Date(message.time);
		if (message.authorID === lastMessage.authorID && sameDay(newDate, oldDate)) {
			currentGroup.push(message);
		} else {
			groups.push(currentGroup);
			currentGroup = [message];
			if (!sameDay(newDate, oldDate)) {
				groups.push(newDate);
			}
		}
	}
	groups.push(currentGroup);
	return groups.filter(group => group instanceof Date || group.length > 0).map((group, index) => {
		if (group instanceof Date) {
			return <DateSeparator key={index} date={group} />;
		}
		return <MessageGroup
			key={index}
			align={group[0].authorID === relativeTo ? Align.Right : Align.Left}
			messages={group}
			authorID={group[0].authorID}
		/>;
	});
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

	return <Box style={{ textAlign: align }} className={classes.messageGroup}>
		{
			messages.map(message => <Message message={message} id={message.id} isOwn={align === Align.Right} key={message.id} />)
		}
	</Box>;
}
