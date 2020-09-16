import { grey } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import VideoElement from './VideoElement';

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
		boxShadow: `0 0 1rem ${grey[500]}`,
		[theme.breakpoints.down('xs')]: {
			width: '45vw'
		}
	}
}));

export default function SelfVideo({ mediaStream }: SelfVideoProps) {
	const classes = useStyles();

	return <VideoElement muted={true} mediaStream={mediaStream} className={classes.video}/>;
}
