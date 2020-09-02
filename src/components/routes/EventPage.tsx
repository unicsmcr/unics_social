import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Container, Divider, Grid, LinearProgress, Paper, Typography } from '@material-ui/core';
import * as stockImage from '../../res/stockEventPhoto.jpg';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import useStyles from '../util/useStyles';

function EventPage() {
	const [loading, setLoading] = useState<boolean>(false);
	const [name, setName] = useState<string>('');
	const [startDate, setStartDate] = useState<Date | string>('');
	const [endDate, setEndDate] = useState<Date | string>('');
	const [description, setDescription] = useState<string>('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut\n' +
        '                            labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco\n' +
        '                            laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in\n' +
        '                            voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat\n' +
        '                            cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laboruLorem\n' +
        '                            ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut\n' +
        '                            labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco\n' +
        '                            laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in\n' +
        '                            voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat\n' +
        '                            cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laboru');
	const [image, setImage] = useState(stockImage);
	const [channelID, setChannelID] = useState<string>('ggg');
	const classes = useStyles();

	useEffect(() => {
		// expecting API CALL
		setLoading(true);
		setName('Hello');
		setStartDate('2/12');
		setEndDate('23/12');
		// setDescription('An Amazing event');
		setChannelID('eeee');
		setLoading(false);
	}, []);

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
                            Go to group chat
					</Button>
					<Typography variant="h5" className={classes.eventOptionText}>
                            Match with a cs student
					</Typography>
					<Button variant="contained" color="secondary">
                            Go to random chat
					</Button>
				</Container>
			</Paper>
		</Container>
	);
}

export default withRouter(EventPage);
