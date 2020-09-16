import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';

const useStyles = makeStyles(theme => ({
	holder: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0
	},
	video: {
		height: '100%',
		width: '100%'
	}
}));

export default function PeerVideo() {
	const classes = useStyles();

	return <Box className={classes.holder}>
		<video src="https://hydrabolt.me/hamster.mp4" autoPlay={true} loop={true} className={classes.video}></video>
	</Box>;
}
