import { APIDMChannel } from '@unicsmcr/unics_social_api_client';
import React, { useEffect } from 'react';
import Video from 'twilio-video';

interface VideoPanelProps {
	channel: APIDMChannel;
	videoJWT: string;
}

export default function VideoPanel(props: VideoPanelProps) {
	const [room, setRoom] = React.useState<Video.Room|undefined>();
	const [mediaStream, setMediaStream] = React.useState<MediaStream|undefined>();

	const ourVideoRef = React.createRef<HTMLVideoElement>();

	useEffect(() => {
		async function launch() {
			if (!room) {
				const mediaStream = await navigator.mediaDevices.getUserMedia({
					audio: true,
					video: true
				});
				setMediaStream(mediaStream);
				console.log('got', mediaStream);
				const videoEl = document.querySelector('video')!;
				const videoTrack = mediaStream.getVideoTracks()[0];

				videoEl.width = videoTrack.getSettings().width!;
				videoEl.height = videoTrack.getSettings().height!;

				videoEl.srcObject = mediaStream;

				const room = await Video.connect(props.videoJWT, { name: props.channel.id, tracks: mediaStream.getTracks() });
				setRoom(room);
				console.log(room);
			}
		}
		launch();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return <video autoPlay={true} ref={ourVideoRef} muted={true} />;
}
