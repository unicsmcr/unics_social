import { Fab } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { grey, red } from '@material-ui/core/colors';
import { makeStyles, ThemeProvider } from '@material-ui/core/styles';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import VideocamOutlinedIcon from '@material-ui/icons/VideocamOutlined';
import VideocamOffOutlinedIcon from '@material-ui/icons/VideocamOffOutlined';

import MicNoneOutlinedIcon from '@material-ui/icons/MicNoneOutlined';
import MicOffOutlinedIcon from '@material-ui/icons/MicOffOutlined';

import CallEndIcon from '@material-ui/icons/CallEnd';

import SwitchCameraIcon from '@material-ui/icons/SwitchCamera';

import createMuiTheme from '@material-ui/core/styles/createMuiTheme';

const useStyles = makeStyles(theme => ({
	panel: {
		background: grey[800],
		padding: theme.spacing(2, 1)
	},
	fab: {
		margin: theme.spacing(0, 1)
	}
}));

interface OptionsPanelProps {
	onFlipCamera: Function;
	onVideoStatusChange: (enabled: boolean) => void;
	onMicStatusChange: (enabled: boolean) => void;
}

export default function OptionsPanel(props: OptionsPanelProps) {
	const classes = useStyles();
	const [video, setVideo] = useState(true);
	const [mic, setMic] = useState(true);

	const history = useHistory();

	const VideoIcon = video ? VideocamOutlinedIcon : VideocamOffOutlinedIcon;
	const MicIcon = mic ? MicNoneOutlinedIcon : MicOffOutlinedIcon;

	return <Box className={classes.panel}>
		<Fab onClick={() => props.onFlipCamera()} className={classes.fab}>
			<SwitchCameraIcon />
		</Fab>
		<Fab onClick={() => {
			const newValue = !video;
			setVideo(newValue);
			props.onVideoStatusChange(newValue);
		}} className={classes.fab}>
			<VideoIcon />
		</Fab>
		<Fab onClick={() => {
			const newValue = !mic;
			setMic(newValue);
			props.onMicStatusChange(newValue);
		}} className={classes.fab}>
			<MicIcon />
		</Fab>
		<ThemeProvider theme={createMuiTheme({
			palette: {
				primary: {
					main: red[500]
				}
			}
		})}>
			<Fab className={classes.fab} color="primary" onClick={() => history.replace(history.location.pathname.replace('/video', ''))}>
				<CallEndIcon />
			</Fab>
		</ThemeProvider>
	</Box>;
}
