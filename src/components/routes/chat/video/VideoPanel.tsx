import { APIDMChannel } from '@unicsmcr/unics_social_api_client';
import React, { useEffect, useRef } from 'react';
import Video from 'twilio-video';

interface VideoPanelProps {
	channel: APIDMChannel;
	videoJWT: string;
}

export default function VideoPanel(props: VideoPanelProps) {
	const [room, setRoom] = React.useState<Video.Room|undefined>();
	const [mediaStream, setMediaStream] = React.useState<MediaStream|undefined>();

	const ourVideoRef = useRef<HTMLVideoElement|null>(null);

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
				const videoEl = ourVideoRef.current;
				if (!videoEl) return;
				const videoTrack = _mediaStream.getVideoTracks()[0];

				videoEl.width = videoTrack.getSettings().width!;
				videoEl.height = videoTrack.getSettings().height!;

				videoEl.srcObject = _mediaStream;

				_room = await Video.connect(props.videoJWT, { name: props.channel.id, tracks: _mediaStream.getTracks() });
				setRoom(_room);
				console.log(_room);
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

	return <video autoPlay={true} ref={ourVideoRef} muted={true} />;
}
