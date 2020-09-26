import { Typography } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { APIDMChannel } from '@unicsmcr/unics_social_api_client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Video, { createLocalTracks, TwilioError } from 'twilio-video';
import { createMessage } from '../../../../store/slices/MessagesSlice';
import NotificationDialog from '../../../util/NotificationDialog';
import SystemMessage from '../../../util/SystemMessage';
import OptionsPanel from './OptionsPanel';
import PeerVideo from './PeerVideo';
import SelfVideo from './SelfVideo';

interface VideoPanelProps {
	channel: APIDMChannel;
	videoJWT: string;
}

const useStyles = makeStyles(theme => ({
	panel: {
		display: 'grid',
		height: '100%',
		width: '100%',
		gridTemplateRows: 'auto min-content',
		background: 'black'
	},
	videoArea: {
		height: '100%',
		width: '100%',
		position: 'relative',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center'
	},
	waitingMessage: {
		color: theme.palette.getContrastText('#000')
	}
}));

function wrapError<T>(promise: Promise<T>, message: string): Promise<T> {
	return promise.catch(error => {
		console.error(error);
		return Promise.reject(new Error(message));
	});
}

function translateVideoError(error: Error|TwilioError) {
	if (error.hasOwnProperty('code')) {
		// https://www.twilio.com/docs/video/build-js-video-application-recommendations-and-best-practices#connection-errors
		switch ((error as TwilioError).code) {
			case 53000:
				return 'Your internet connection is too unstable for a video chat.';
			case 53006:
				return 'The external video chat provider is currently overloaded. We can\'t do anything about that, try again later. Sorry!';
			case 53105:
				return 'The video chat is full! How did you get here... 🤔';
			case 53103:
			case 53106:
			case 53118:
				// return 'Your call time is up! You can still carry on the conversation with text chat, or you can connect with eachother on a different platform!';
				return undefined;
			case 53405:
				return 'Your internet connection is unstable, or your firewall is preventing a connection to the video chat provider.';
		}
	}
	return error.message || String(error);
}

export default function VideoPanel(props: VideoPanelProps) {
	const classes = useStyles();
	const history = useHistory();

	const selfVideoRef = useRef<HTMLVideoElement>(null);
	const peerVideoRef = useRef<HTMLVideoElement>(null);

	const [room, setRoom] = useState<Video.Room|undefined>();

	const [cameraMode, setCameraMode] = useState<'user'|'environment'>('user');
	const [tracks, setTracks] = useState<Video.LocalTrack[]>();

	const [hasOtherUser, setHasOtherUser] = useState(false);

	const [error, setError] = useState<string>();

	const dispatch = useCallback(useDispatch(), []);

	useEffect(() => {
		let _room: Video.Room;
		let _tracks: Video.LocalTrack[];

		async function launch() {
			if (!room) {
				const tracks = await wrapError(createLocalTracks({
					audio: true,
					video: {
						facingMode: cameraMode
					}
				}), 'Failed to find a camera and/or microphone');
				_tracks = tracks;
				setTracks(tracks);

				if (selfVideoRef.current) {
					const videoTrack: Video.LocalVideoTrack|undefined = tracks.find(track => track.kind === 'video') as Video.LocalVideoTrack;
					if (!videoTrack) throw new Error('Camera not found');
					videoTrack.attach(selfVideoRef.current);
				}

				_room = await Video.connect(props.videoJWT, { tracks }).catch(err => {
					console.error(err);
					return Promise.reject(new Error(translateVideoError(err)));
				});
				setRoom(_room);

				// send join message
				dispatch(createMessage({
					content: SystemMessage.JoinVideo,
					channelID: props.channel.id
				}));

				function userConnected(user: Video.Participant) {
					setHasOtherUser(true);
					user.on('trackSubscribed', (track: Video.AudioTrack|Video.VideoTrack) => {
						if (peerVideoRef.current) {
							track.attach(peerVideoRef.current);
						}
					});
					user.on('trackUnsubscribed', (track: Video.AudioTrack|Video.VideoTrack) => {
						if (peerVideoRef.current) {
							track.detach(peerVideoRef.current);
						}
					});
				}

				function userDisconnected() {
					setHasOtherUser(false);
					if (peerVideoRef.current) {
						peerVideoRef.current.srcObject = null;
					}
				}

				_room.participants.forEach(userConnected);
				_room.on('participantConnected', userConnected);
				_room.on('participantDisconnected', userDisconnected);
				_room.once('disconnected', (room, error) => {
					if (error) {
						console.error(error);
						const translated = translateVideoError(error);
						if (translated) setError(translated);
					}
				});
			}
		}

		launch()
			.catch(error => {
				console.error('Error in video:', error);
				setError(error.message);
			});

		return () => {
			if (_tracks) {
				_tracks.forEach(track => (track.kind === 'video' || track.kind === 'audio') && track.stop());
			}
			if (_room) {
				_room.disconnect();
				dispatch(createMessage({
					content: SystemMessage.LeaveVideo,
					channelID: props.channel.id
				}));
			}
		};
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return <Box className={classes.panel}>
		<Box className={classes.videoArea}>
			{
				!hasOtherUser && <Typography variant="h5" className={classes.waitingMessage}>Waiting for other user...</Typography>
			}
			{
				<PeerVideo ref={peerVideoRef} />
			}
			{
				<SelfVideo ref={selfVideoRef} />
			}
		</Box>
		<OptionsPanel
			onFlipCamera={() => {
				const newMode = cameraMode === 'environment' ? 'user' : 'environment';
				setCameraMode(newMode);

				if (tracks) {
					const video = tracks.find(track => track.kind === 'video') as Video.LocalVideoTrack|undefined;
					if (video) {
						video.restart({
							facingMode: newMode
						});
					}
				}
			}}

			onVideoStatusChange={enable => {
				if (tracks) {
					const video = tracks.find(track => track.kind === 'video') as Video.LocalVideoTrack|undefined;
					if (video) {
						enable ? video.enable() : video.disable();
					}
				}
			}}

			onMicStatusChange={enable => {
				if (tracks) {
					const mic = tracks.find(track => track.kind === 'audio') as Video.LocalAudioTrack|undefined;
					if (mic) {
						enable ? mic.enable() : mic.disable();
					}
				}
			}}
		/>
		<NotificationDialog
			title="Unable to join video chat"
			show={Boolean(error?.length)}
			message={error ?? ''}
			onClose={() => history.push(`${history.location.pathname.replace('/video', '')}`)}
		/>
	</Box>;
}
