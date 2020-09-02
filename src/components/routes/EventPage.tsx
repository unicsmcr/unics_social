import React, {useEffect, useState} from "react";
import {withRouter} from 'react-router-dom'
import {Box, CircularProgress, Container, Divider, Grid, LinearProgress, Paper, Typography} from "@material-ui/core";
import * as stockImage from "../../res/stockEventPhoto.jpg"
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import useStyles from "../util/useStyles";
function EventPage() {
    const [loading, setLoading] = useState<boolean>(false)
    const [name, setName] = useState<String>("")
    const [startDate, setStartDate] = useState<Date | String>("")
    const [endDate, setEndDate] = useState<Date | String>("")
    const [description, setDescription] = useState<String>("")
    const [image, setImage] = useState(stockImage)
    const [hasImage, setHasImage] = useState<Boolean>(false)
    const [channelID, setChannelID] = useState<String>("")
    const classes = useStyles();

    useEffect(() => {
        // expecting API CALL
        setName("Hello")
        setStartDate("2/12")
        setEndDate("23/12")
        setDescription("An Amazing event")
        setHasImage(false)
        setChannelID("eeee")

    }, [])

    return (
        <div style={{display: "flex", justifyContent: "center"}}>
            <Paper elevation={10} style={{height: "99vh", width: "70vh", alignSelf: "center"}}>
                {loading ? <LinearProgress />: null}
                <img src={image} alt="" style={{width: "100%", height: "30vh", objectFit: "cover"}}/>

                <Container>
                    <Typography component="h1" variant="h2" color="textPrimary">
                        {name}
                    </Typography>
                    <Typography color="textSecondary">
                        {description}
                    </Typography>
                    <Grid
                        style={{paddingTop: 4}}
                        container
                        direction="row"
                        alignItems="center"
                    >
                        <AccessTimeIcon style={{paddingRight: "0.4rem"}} color="disabled"/>
                        <Typography>{`${startDate} - ${endDate}`}</Typography>
                    </Grid>
                </Container>
                <Divider light  style={{marginTop: "2rem"}}/>
            </Paper>
        </div>
    )
}

export default withRouter(EventPage)