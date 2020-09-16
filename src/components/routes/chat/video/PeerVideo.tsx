import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { forwardRef, Ref } from 'react';

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

const PeerVideo = forwardRef((props, ref: Ref<HTMLVideoElement>) => {
	const classes = useStyles();

	return <Box className={classes.holder}>
		<video ref={ref} autoPlay={true} className={classes.video}></video>
	</Box>;
});

export default PeerVideo;
