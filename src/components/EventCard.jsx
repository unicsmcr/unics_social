import React from 'react';
import Card from '@material-ui/core/Card';
import {CardContent, Typography} from '@material-ui/core';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import useStyles from './util/useStyles';

const EventCard = ({title, description, startDate, endDate, expired = false}) => {
    const classes = useStyles();
    const zIndex = expired === true ? -1 : 0
    let className = "card-top-element"
    className += expired === true ? " card-top-element-disabled" : ""
    return (
       <div className={className}>
           <Card className={classes.eventCard} style={{position: "relative", zIndex: zIndex}} >
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
       </div>
    );
};
export default EventCard;
