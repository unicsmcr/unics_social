import { CircularProgress } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { APIDMChannel } from '@unicsmcr/unics_social_api_client';
import React, { useEffect, useRef } from 'react';
import Video from 'twilio-video';
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

export default function VideoPanel(props: VideoPanelProps) {
	const classes = useStyles();

	const peerVideoRef = useRef<HTMLVideoElement>(null);

	const [room, setRoom] = React.useState<Video.Room|undefined>();
	const [mediaStream, setMediaStream] = React.useState<MediaStream|undefined>();

	useEffect(() => {
		let _room: Video.Room;
		let _mediaStream: MediaStream;
		async function launch() {
			if (!room) {
				_mediaStream = await navigator.mediaDevices.getUserMedia({
					audio: true,
					video: true
				});
				setMediaStream(_mediaStream);
				console.log('got', _mediaStream);
				console.log(props.channel.video!.id);
				_room = await Video.connect(props.videoJWT);
				setRoom(_room);

				function userConnected(user: Video.Participant) {
					console.log('connecting', user);
					user.on('trackSubscribed', (track: Video.AudioTrack|Video.VideoTrack) => {
						console.log('got track', track);
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

		launch();

		return () => {
			if (_mediaStream) {
				_mediaStream.getTracks().forEach(track => track.stop());
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
				mediaStream
					? <SelfVideo mediaStream={mediaStream} />
					: <CircularProgress />
			}
		</Box>
		<OptionsPanel />
	</Box>;
}
