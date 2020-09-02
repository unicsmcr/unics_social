import React, {useEffect, useState} from "react";
import {withRouter} from 'react-router-dom'
import {Box, CircularProgress, Container, Divider, Grid, LinearProgress, Paper, Typography} from "@material-ui/core";
import * as stockImage from "../../res/stockEventPhoto.jpg"
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import useStyles from "../util/useStyles";
import Url from "../Url";
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css'

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
            <Paper
                elevation={10} style={{height: "98vh", width: "70vh", alignSelf: "center"}}>
                {loading ? <LinearProgress/> : null}
                <SimpleBar style={{maxHeight: "98vh"}}>

                    <img src={image} alt="" style={{width: "100%", height: "30vh", objectFit: "cover"}}/>

                    <Container>
                        <Typography component="h2" variant="h2" color="textPrimary">
                            {name}
                        </Typography>
                        <Typography color="textSecondary">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                            labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                            laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
                            voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                            cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laboruLorem
                            ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                            labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                            laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
                            voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                            cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laboru
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
                    <Divider light style={{marginTop: "2rem", marginBottom: "2rem"}}/>
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
                        <Url link="ff.com"/>
                    </Box>
                </SimpleBar>

            </Paper>
        </div>
    )
}

export default withRouter(EventPage)