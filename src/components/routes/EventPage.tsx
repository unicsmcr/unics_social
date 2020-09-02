import React, {useEffect, useState} from "react";
import {withRouter} from 'react-router-dom'
import {Container, Paper, Typography} from "@material-ui/core";
import Page from "../Page";
function EventPage(){
    const [name, setName] = useState<String>("")
    const [startDate, setStartDate] = useState<Date | String>("")
    const [endDate, setEndDate] = useState<Date| String>("")
    const [description, setDescription] = useState<String>("")
    const [image, setImage] = useState<String>("")
    const [hasImage, setHasImage] = useState<Boolean>(false)
    const [channelID, setChannelID] = useState<String>("")

    useEffect(() => {
        // expecting API CALL
        setName("Hello")
        setStartDate("23/12")
        setEndDate("12/12")
        setDescription("An Amazing event")
        setHasImage(false)
        setChannelID("eeee")

    }, [])

    return (
        <Container>
            <Paper elevation={3}>
            </Paper>
        </Container>
    )
}
export default withRouter(EventPage)