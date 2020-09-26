import { makeStyles } from '@material-ui/core/styles';
import React, { forwardRef, Ref } from 'react';

interface SelfVideoProps extends React.DetailedHTMLProps<React.VideoHTMLAttributes<HTMLVideoElement>, HTMLVideoElement> {
	mediaStream: MediaStream;
}

const useStyles = makeStyles(theme => ({
	video: {
		width: 'min(20rem, 30vw)',
		height: 'auto',
		position: 'absolute',
		bottom: theme.spacing(2),
		left: theme.spacing(2),
		maxHeight: '15vh',
		objectPosition: 'bottom left',
		[theme.breakpoints.down('xs')]: {
			width: '20vw'
		}
	}
}));

const SelfVideo = forwardRef((props, ref: Ref<HTMLVideoElement>) => {
	const classes = useStyles();
	return <video ref={ref} autoPlay={true} {...props} className={classes.video}></video>;
});

export default SelfVideo;
