import Box from '@material-ui/core/Box';
import { grey } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import VideoElement from './VideoElement';

interface SelfVideoProps extends React.DetailedHTMLProps<React.VideoHTMLAttributes<HTMLVideoElement>, HTMLVideoElement> {
	mediaStream: MediaStream;
}

const useStyles = makeStyles(theme => ({
	holder: {
		position: 'relative'
	},
	video: {
		width: 'min(20rem, 30vw)',
		height: 'auto',
		position: 'absolute',
		bottom: theme.spacing(2),
		left: theme.spacing(2),
		boxShadow: `0 0 1rem ${grey[500]}`,
		[theme.breakpoints.down('xs')]: {
			width: '40vw',
			maxHeight: '20vh'
		}
	}
}));

export default function SelfVideo({ mediaStream }: SelfVideoProps) {
	const classes = useStyles();

	return <Box className={classes.holder}>
		<VideoElement muted={true} mediaStream={mediaStream} className={classes.video}/>
	</Box>;
}
