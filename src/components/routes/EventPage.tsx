import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { Box, Container, Divider, Grid, LinearProgress, Paper, Typography } from '@material-ui/core';
import * as stockImage from '../../res/stockEventPhoto.jpg';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import Url from '../Url';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';

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
	useEffect(() => {
		// expecting API CALL
		setLoading(true);
		setName('Hello');
		setStartDate('2/12');
		setEndDate('23/12');
		setDescription('An Amazing event');
		setChannelID('eeee');
		setLoading(false);
	}, []);

	return (
		<div style={{ display: 'flex', justifyContent: 'center' }}>
			<Paper
				elevation={10} style={{ height: '98vh', width: '70vh', alignSelf: 'center' }}>
				{loading ? <LinearProgress/> : null}
				<SimpleBar style={{ maxHeight: '98vh' }}>

					<img src={image} alt="" style={{ width: '100%', height: '30vh', objectFit: 'cover' }}/>

					<Container>
						<Typography component="h2" variant="h2" color="textPrimary">
							{name}
						</Typography>
						<Typography color="textSecondary">
							{description}
						</Typography>
						<Grid
							style={{ paddingTop: 4 }}
							container
							direction="row"
							alignItems="center"
						>
							<AccessTimeIcon style={{ paddingRight: '0.4rem' }} color="disabled"/>
							<Typography>{`${startDate} - ${endDate}`}</Typography>
						</Grid>
					</Container>
					<Divider light style={{ marginTop: '2rem', marginBottom: '2rem' }}/>
					<Box>
						<Container>
							<Typography variant="h5">
                                What are you waiting for? Go to the group chat
							</Typography>
						</Container>
						<Url link="google.com"/>
						<Container>
							<Typography variant="h5">
                                Match with a cs student
							</Typography>
						</Container>
						<Url link={channelID}/>
					</Box>
				</SimpleBar>

			</Paper>
		</div>
	);
}

export default withRouter(EventPage);
