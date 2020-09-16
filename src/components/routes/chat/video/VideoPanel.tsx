import { CircularProgress } from '@material-ui/core';
import { APIDMChannel } from '@unicsmcr/unics_social_api_client';
import React, { useEffect, useRef } from 'react';
import Video from 'twilio-video';
import VideoElement from './VideoElement';

interface VideoPanelProps {
	channel: APIDMChannel;
	videoJWT: string;
}

export default function VideoPanel(props: VideoPanelProps) {
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
				/*
				_room = await Video.connect(props.videoJWT).catch(console.error) as any;
				setRoom(_room);
				console.log(_room);
				*/
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

	if (mediaStream) {
		return <VideoElement muted={true} mediaStream={mediaStream} />;
	}

	return <CircularProgress />;
}
