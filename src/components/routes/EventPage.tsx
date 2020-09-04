import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Container, Divider, Grid, LinearProgress, Paper, Typography } from '@material-ui/core';
import * as stockImage from '../../res/stockEventPhoto.jpg';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
	eventContainer: {
		display: 'flex', justifyContent: 'center'
	},
	eventPaper: {
		height: '98vh', width: '70vh', alignSelf: 'center', overflow: 'auto'
	},
	eventInnerContainer: {
		margin: theme.spacing(2, 0),
		display: 'flex',
		flexDirection: 'column'
	},
	iconMargin: {
		margin: theme.spacing(0, 1, 0, 0)
	},
	eventButton: {
		alignSelf: 'center',
		margin: 2
	},
	eventOptionText: {
		margin: theme.spacing(3, 0)
	},
	eventGrid: {
		margin: theme.spacing(2, 0, 0, 0)
	}
}));

interface EventSkeleton {
	name: string;
	startDate: Date | string;
	endDate: Date | string;
	description: string;
	image: string;
	channelID: string;
}
function EventPage() {
	const [event, setEvent] = useState<EventSkeleton>({
		name: '',
		startDate: '',
		endDate: '',
		description: '',
		image: '',
		channelID: ''
	});
	const [loading, setLoading] = useState<boolean>(false);
	const { name, startDate, endDate, description, image, channelID } = event;
	const classes = useStyles();
	const stock = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut\n' +
        '                            labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco\n' +
        '                            laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in\n' +
        '                            voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat\n' +
        '                            cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laboruLorem\n' +
        '                            ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut\n' +
        '                            labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco\n' +
        '                            laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in\n' +
        '                            voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat\n' +
        '                            cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laboru';
	useEffect(() => {
		// expecting API CALL
		setLoading(true);
		// API CALL
		setEvent({
			name: 'Event', startDate: '12/1', endDate: '12/2',
			description: stock, image: stockImage, channelID: '121'
		});
		setLoading(false);
	}, [stock]);

	return (
		<Container className={classes.eventContainer}>
			<Paper
				elevation={10} className={classes.eventPaper}>
				{loading ? <LinearProgress/> : null}
				<img src={image} alt="" style={{ width: '100%', height: '30vh', objectFit: 'cover' }}/>

				<Container className={classes.eventInnerContainer}>
					<Typography component="h2" variant="h2" color="textPrimary">
						{name}
					</Typography>
					<Typography color="textSecondary">
						{description}
					</Typography>
					<Grid
						className={classes.eventGrid}
						container
						direction="row"
						alignItems="center"
					>
						<AccessTimeIcon className={classes.iconMargin} color="disabled"/>
						<Typography>{`${startDate} - ${endDate}`}</Typography>
					</Grid>
				</Container>
				<Divider light/>
				<Container className={classes.eventInnerContainer}>
					<Typography variant="h5" className={classes.eventOptionText}>
                        What are you waiting for? Go to the group chat
					</Typography>
					<Button variant="contained" color="primary">
                        Go to group chat {channelID}
					</Button>
				</Container>
			</Paper>
		</Container>
	);
}

export default withRouter(EventPage);
