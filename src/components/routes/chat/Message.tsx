import React from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import grey from '@material-ui/core/colors/grey';
import { makeStyles } from '@material-ui/core/styles';

export interface MessageProps {
	content: string;
	id: string;
	isOwn: boolean;
}

const useStyles = makeStyles(theme => ({
	messageBubble: {
		display: 'inline-block',
		padding: theme.spacing(2),
		background: grey[100],
		borderRadius: theme.spacing(0, 4, 4, 4),
		marginBottom: theme.spacing(1),
		maxWidth: '70ch'
	},
	ownMessage: {
		background: theme.palette.primary.light,
		color: theme.palette.primary.contrastText,
		borderRadius: theme.spacing(4, 4, 0, 4)
	}
}));

export default function Message({ content, isOwn }: MessageProps) {
	const classes = useStyles();

	return <Box>
		<div className={[classes.messageBubble, isOwn ? classes.ownMessage : ''].join(' ')}>
			<Typography variant="body1" style={{ textAlign: 'left' }}>
				{ content }
			</Typography>
		</div>
	</Box>;
}
