import React from 'react';

import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { Box, AppBar, Toolbar, colors, Avatar, IconButton } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

const useStyles = makeStyles(theme => ({
	mainContent: {
		padding: theme.spacing(6, 2, 14, 2),
		textAlign: 'center'
	},
	chatsRoot: {
		display: 'flex'
	},
	flexGrow: {
		flexGrow: 1
	},
	avatar: {
		marginRight: theme.spacing(2)
	},
	appBar: {
		background: colors.grey[700],
		color: theme.palette.getContrastText(colors.grey[700])
	},
	menuButton: {
		marginRight: theme.spacing(1),
		cursor: 'pointer'
	}
}));

interface ChatPanelProps {
	channel: {
		name: string;
		avatar: string;
	};
	onChannelsMenuClicked: Function;
}

export default function ChatPanel({ channel, onChannelsMenuClicked }: ChatPanelProps) {
	const classes = useStyles();

	return (
		<Box className={classes.flexGrow}>
			<AppBar position="static" color="inherit" elevation={2} className={classes.appBar}>
				<Toolbar>
					<IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={() => onChannelsMenuClicked()} >
						<MenuIcon />
					</IconButton>
					<Avatar className={classes.avatar} src={channel.avatar} alt={channel.name}></Avatar>
					<Typography variant="h6">
						{channel.name}
					</Typography>
				</Toolbar>
			</AppBar>
			<Box>

			</Box>
		</Box>
	);
}
