import React from 'react';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import useStyles from '../util/useStyles';
import CardMedia from '@material-ui/core/CardMedia';
import stockEvent from '../../res/stockEventPhoto.jpg';

const EventCard = ({ title, description, startDate, endDate, expired = false, img = stockEvent }) => {
	const classes = useStyles();
	const zIndex = expired ? -1 : 0;
	let className = 'card-top-element';
	className += expired ? ' card-top-element-disabled' : '';
	return (
		<div className={className}>
			<Card className={classes.eventCard} style={{ position: 'relative', zIndex: zIndex }}>
				<CardMedia
					className={classes.media}
					image={img}
					title={title}
				/>
				<CardContent>
					<Typography variant="h3">
						{title}
					</Typography>
					<Typography variant="h5" color="textSecondary" noWrap={true}>
						{description}
					</Typography>
					<Typography variant="subtitle2" color="secondary">
						{startDate} - {endDate}
					</Typography>
				</CardContent>
				<CardActions>
					<Button size="small" color="primary">Learn More</Button>
				</CardActions>
			</Card>
		</div>
	);
};
export default EventCard;
