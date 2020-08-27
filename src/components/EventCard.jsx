import React from "react";
import Card from "@material-ui/core/Card";
import {CardContent, CardHeader, Typography} from "@material-ui/core";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
const EventCard = ({title, description, startDate, endDate}) => {
    return(
        <Card>
            <CardHeader>
                <Typography variant={"h3"}>
                    {title}
                </Typography>
            </CardHeader>
            <CardContent>
                <Typography variant={"h5"} color="textSecondary">
                    {description}
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small">Learn More</Button>
            </CardActions>
        </Card>
    )
}
export default EventCard