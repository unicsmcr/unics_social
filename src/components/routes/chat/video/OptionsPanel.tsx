import { Fab } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { grey } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';
import React, { useState } from 'react';

import VideocamOutlinedIcon from '@material-ui/icons/VideocamOutlined';
import VideocamOffOutlinedIcon from '@material-ui/icons/VideocamOffOutlined';

import MicNoneOutlinedIcon from '@material-ui/icons/MicNoneOutlined';
import MicOffOutlinedIcon from '@material-ui/icons/MicOffOutlined';

const useStyles = makeStyles(theme => ({
	panel: {
		background: grey[800],
		padding: theme.spacing(2, 1)
	},
	fab: {
		margin: theme.spacing(0, 1)
	}
}));

export default function OptionsPanel() {
	const classes = useStyles();
	const [video, setVideo] = useState(true);
	const [mic, setMic] = useState(true);

	const VideoIcon = video ? VideocamOutlinedIcon : VideocamOffOutlinedIcon;
	const MicIcon = mic ? MicNoneOutlinedIcon : MicOffOutlinedIcon;

	return <Box className={classes.panel}>
		<Fab onClick={() => setVideo(!video)} className={classes.fab}>
			<VideoIcon />
		</Fab>
		<Fab onClick={() => setMic(!mic)} className={classes.fab}>
			<MicIcon />
		</Fab>
	</Box>;
}
