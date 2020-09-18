import { makeStyles, Card, TextField, Fab } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';
import { APIDMChannel, APIEventChannel } from '@unicsmcr/unics_social_api_client';
import React, { createRef, useCallback, useEffect, useState } from 'react';
import { createMessage, fetchMessages, selectMessages } from '../../../store/slices/MessagesSlice';
import { createGroups } from './MessageGroup';
import SendIcon from '@material-ui/icons/Send';
import { useDispatch, useSelector } from 'react-redux';
import { selectMe } from '../../../store/slices/UsersSlice';
import { readChannel } from '../../../store/slices/ReadSlice';

const useStyles = makeStyles(theme => ({
	flexGrow: {
		flexGrow: 1
	},
	chatArea: {
		padding: theme.spacing(2),
		overflow: 'auto',
		flexGrow: 1
	},
	chatBox: {
		'borderTop': '1px solid',
		'borderColor': grey[400],
		'padding': theme.spacing(2),
		'overflow': 'initial',
		'background': grey[300],
		'& > form': {
			display: 'flex',
			alignItems: 'flex-start'
		}
	},
	sendIcon: {
		marginLeft: theme.spacing(2)
	},
	skeletonText: {
		marginLeft: theme.spacing(2),
		width: 'min(300px, 50vw)'
	}
}));

interface MessagesPanelProps {
	channel: (APIDMChannel|APIEventChannel) & {
		firstMessage?: string;
	};
}

export default function MessagesPanel(props: MessagesPanelProps) {
	const classes = useStyles();
	const dispatch = useCallback(useDispatch(), []);
	const messages = useSelector(selectMessages(props.channel.id));

	const firstMessageTime = props.channel.firstMessage ? new Date(props.channel.firstMessage) : undefined;

	const me = useSelector(selectMe);
	const chatBoxRef = createRef<HTMLDivElement>();
	const inputBoxRef = createRef<HTMLInputElement>();
	const [scrollSynced, setScrollSynced] = useState(true);

	useEffect(() => {
		if (messages.length === 0) {
			dispatch(fetchMessages({ channelID: props.channel.id }));
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.channel, dispatch]);

	useEffect(() => {
		if (scrollSynced) {
			dispatch(readChannel({ channelID: props.channel.id, time: Date.now() }));
		}
	}, [props.channel.id, scrollSynced, messages.length, dispatch]);

	useEffect(() => {
		if (messages && chatBoxRef.current && scrollSynced) {
			chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
		}
	}, [chatBoxRef, messages, scrollSynced]);

	return <>
		<div ref={chatBoxRef} className={classes.chatArea} onScroll={e => {
			const target = e.target as any;
			const scrolledToBottom = target.scrollHeight - target.scrollTop - target.clientHeight < 1;
			if (target.scrollTop === 0 && !firstMessageTime) {
				dispatch(fetchMessages({
					channelID: props.channel.id,
					before: new Date(messages[0].time)
				}));
			}

			if (scrolledToBottom && !scrollSynced) {
				setScrollSynced(true);
			} else if (!scrolledToBottom && scrollSynced) {
				setScrollSynced(false);
			}
		}}>
			{
				createGroups(messages, me!.id)
			}
		</div>
		<Card className={classes.chatBox}>
			<form className={classes.flexGrow} onSubmit={e => {
				e.preventDefault();
				const form = e.target as any;
				const message = String(new FormData(form).get('message'));
				form.reset();
				dispatch(createMessage({
					content: message,
					channelID: props.channel.id
				}));
				if (inputBoxRef.current) {
					const textbox: HTMLElement|null = inputBoxRef.current.querySelector('input[type=text]');
					if (textbox) {
						textbox.focus();
					}
				}
			}}>
				<TextField label="Type a message" variant="filled" className={classes.flexGrow} name="message" inputProps={{ autoComplete: 'off' }}
					ref={inputBoxRef}
					onClick={() => {
						let count = 20;
						const resetScroll = () => {
							if (scrollSynced && chatBoxRef.current) {
								chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
							}
							if (count-- > 0) setTimeout(resetScroll, 50);
						};
						resetScroll();
					}}
				/>
				<Fab aria-label="send" className={classes.sendIcon} color="primary" type="submit">
					<SendIcon />
				</Fab>
			</form>
		</Card>
	</>;
}
