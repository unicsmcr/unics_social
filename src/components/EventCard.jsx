import React from 'react';
import Card from '@material-ui/core/Card';
import { CardContent, Typography } from '@material-ui/core';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import useStyles from './util/useStyles';
const EventCard = ({ title, description, startDate, endDate }) => {
	const classes = useStyles();
	return (
		<Card className={classes.eventCard}>
			<CardContent>
				<Typography variant={'h3'}>
					{title}
				</Typography>
				<Typography variant={'h5'} color="textSecondary">
					{description.substring(0, 50)}
				</Typography>
				<Typography variant={'subtitle2'} color="secondary">
					{startDate} - {endDate}
				</Typography>
			</CardContent>
			<CardActions>
				<Button size="small" color="primary">Learn More</Button>
			</CardActions>
		</Card>
	);
};
export default EventCard;
