import { CircularProgress } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { APIDMChannel } from '@unicsmcr/unics_social_api_client';
import React, { useEffect } from 'react';
import Video from 'twilio-video';
import OptionsPanel from './OptionsPanel';
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

	return <Box className={classes.panel}>
		<Box className={classes.videoArea}>
			{
				room
					? <h2>Room here!</h2>
					: <h2>Loading</h2>
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
