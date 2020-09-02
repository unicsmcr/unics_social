import React from 'react';

import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { Box, AppBar, Toolbar, colors, Avatar } from '@material-ui/core';

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
	}
}));

interface ChatPanelProps {
	channel: {
		name: string;
		avatar: string;
	};
}

export default function ChatPanel({ channel }: ChatPanelProps) {
	const classes = useStyles();

	return (
		<Box className={classes.flexGrow}>
			<AppBar position="static" color="inherit" elevation={2} className={classes.appBar}>
				<Toolbar>
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
