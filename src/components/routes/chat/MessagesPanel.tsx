import { makeStyles, Card, TextField, Fab, CircularProgress, Button } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';
import { APIDMChannel, APIEventChannel, NoteType, ClientTypingPacket, GatewayPacketType } from '@unicsmcr/unics_social_api_client';
import React, { createRef, useCallback, useEffect, useState } from 'react';
import { createMessage, fetchMessages, selectMessages } from '../../../store/slices/MessagesSlice';
import { createGroups } from './MessageGroup';
import SendIcon from '@material-ui/icons/Send';
import { useDispatch, useSelector } from 'react-redux';
import { selectMe } from '../../../store/slices/UsersSlice';
import { readChannel } from '../../../store/slices/ReadSlice';
import { client } from '../../util/makeClient';
import { selectNoteByID } from '../../../store/slices/NotesSlice';
import { SystemMessagesList } from '../../util/SystemMessage';

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
	},
	loader: {
		margin: theme.spacing(1, 0)
	}
}));

interface MessagesPanelProps {
	channel: (APIDMChannel | APIEventChannel) & {
		firstMessage?: string;
	};
	hideTypingIndicator(): void;
}

const NBSP_CHAR = String.fromCharCode(160);

export default function MessagesPanel(props: MessagesPanelProps) {
	const classes = useStyles();
	const dispatch = useCallback(useDispatch(), []);
	const messages = useSelector(selectMessages(props.channel.id));
	const me = useSelector(selectMe);

	const [showBlocked, setShowBlocked] = useState(false);

	const channel: APIDMChannel = props.channel as APIDMChannel;
	const otherID = channel.users.find(userID => userID !== me!.id);

	const firstMessageTime = props.channel.firstMessage ? new Date(props.channel.firstMessage) : undefined;
	const isBlocked = useSelector(selectNoteByID(otherID ?? ''))?.noteType === NoteType.Blocked;

	const chatBoxRef = createRef<HTMLDivElement>();
	const inputBoxRef = createRef<HTMLInputElement>();
	const [loadingMore, setLoadingMore] = useState<{
		scrollPosition: number;
	} | null>(null);
	const [scrollSynced, setScrollSynced] = useState(true);
	const [lastSentTypingPacket, setLastSentTypingPacket] = useState(0);

	useEffect(() => {
		setShowBlocked(false);
		setLastSentTypingPacket(0);
	}, [props.channel.id]);

	useEffect(() => {
		if (messages.length === 0 && !loadingMore) {
			setLoadingMore({ scrollPosition: 0 });
			(dispatch(fetchMessages({ channelID: props.channel.id })) as any)
				.then(() => setLoadingMore(null));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.channel.id]);

	useEffect(() => {
		if (scrollSynced) {
			dispatch(readChannel({ channelID: props.channel.id, time: Date.now() }));
		}
	}, [props.channel.id, scrollSynced, messages.length, dispatch]);

	useEffect(() => {
		if (messages && chatBoxRef.current && scrollSynced) {
			chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
		}

		// hide typing indicator when the other user sends the message they were typing by
		// checking if the last message was sent by them and that it was sent in the last 0.5 seconds
		if (messages.length > 0 &&
			messages[messages.length - 1].authorID !== me?.id &&
			(Date.now() - messages[messages.length - 1].time) < 500) {
			props.hideTypingIndicator();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [chatBoxRef, messages, scrollSynced]);

	useEffect(() => {
		if (chatBoxRef.current && loadingMore) {
			chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight - loadingMore.scrollPosition;
		}
	}, [messages.length, loadingMore, chatBoxRef]);

	useEffect(() => {
		if (chatBoxRef.current && loadingMore) {
			chatBoxRef.current.scrollTop = 0;
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [loadingMore]);

	const generateMessageBody = () => {
		if (!isBlocked || (isBlocked && showBlocked)) {
			return createGroups(messages, me!.id);
		}
		return <Button variant="contained" onClick={() => setShowBlocked(true)}>Load Messages</Button>;
	};

	return <>
		<div ref={chatBoxRef} className={classes.chatArea} onScroll={e => {
			const target = e.target as any;
			const scrolledToBottom = target.scrollHeight - target.scrollTop - target.clientHeight < 1;
			if (target.scrollTop === 0 && !firstMessageTime && messages.length > 0) {
				setLoadingMore({ scrollPosition: target.scrollHeight });
				(dispatch(fetchMessages({
					channelID: props.channel.id,
					before: new Date(messages[0].time)
				})) as any)
					.then(() => setLoadingMore(null));
			}

			if (scrolledToBottom && !scrollSynced) {
				setScrollSynced(true);
			} else if (!scrolledToBottom && scrollSynced) {
				setScrollSynced(false);
			}
		}}>
			{
				loadingMore && <CircularProgress className={classes.loader} size="2rem" />
			}
			{
				generateMessageBody()
			}
		</div>
		{
			(!isBlocked || (isBlocked && showBlocked)) && <Card className={classes.chatBox}>
				<form className={classes.flexGrow} onSubmit={e => {
					e.preventDefault();
					const form = e.target as any;
					let message = String(new FormData(form).get('message'));
					form.reset();
					if (SystemMessagesList.includes(message as any)) message = `${NBSP_CHAR}${message}`;
					dispatch(createMessage({
						content: message,
						channelID: props.channel.id
					}));
					if (inputBoxRef.current) {
						const textbox: HTMLElement | null = inputBoxRef.current.querySelector('input[type=text]');
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
						onChange={() => {
							if (Date.now() - lastSentTypingPacket >= 4500) {
								client.gateway!.send<ClientTypingPacket>({
									type: GatewayPacketType.ClientTyping,
									data: {
										channelID: props.channel.id
									}
								});
								setLastSentTypingPacket(Date.now());
							}
						}}
					/>
					<Fab aria-label="send" className={classes.sendIcon} color="primary" type="submit">
						<SendIcon />
					</Fab>
				</form>
			</Card>
		}
	</>;
}
