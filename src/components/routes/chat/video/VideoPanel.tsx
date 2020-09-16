import Box from '@material-ui/core/Box';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { APIDMChannel } from '@unicsmcr/unics_social_api_client';
import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Video, { createLocalTracks } from 'twilio-video';
import NotificationDialog from '../../../util/NotificationDialog';
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
		position: 'relative'
	}
}));

function wrapError<T>(promise: Promise<T>, message: string): Promise<T> {
	return promise.catch(error => {
		console.error(error);
		return Promise.reject(new Error(message));
	});
}

export default function VideoPanel(props: VideoPanelProps) {
	const classes = useStyles();
	const history = useHistory();

	const selfVideoRef = useRef<HTMLVideoElement>(null);
	const peerVideoRef = useRef<HTMLVideoElement>(null);

	const [room, setRoom] = useState<Video.Room|undefined>();

	const [cameraMode, setCameraMode] = useState<'user'|'environment'>('user');
	const [tracks, setTracks] = useState<Video.LocalTrack[]>();

	const [error, setError] = useState<string>();

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

				_room = await Video.connect(props.videoJWT, { tracks });
				setRoom(_room);

				function userConnected(user: Video.Participant) {
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
					if (peerVideoRef.current) {
						peerVideoRef.current.srcObject = null;
					}
				}

				_room.participants.forEach(userConnected);
				_room.on('participantConnected', userConnected);
				_room.on('participantDisconnected', userDisconnected);
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
			}
		};
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return <Box className={classes.panel}>
		<Box className={classes.videoArea}>
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
			title="Error in video chat"
			show={Boolean(error?.length)}
			message={error ?? ''}
			onClose={() => history.push(`${history.location.pathname.replace('/video', '')}`)}
		/>
	</Box>;
}
