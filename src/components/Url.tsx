import React from "react"
import {Container, Link, Typography} from "@material-ui/core";
interface props {
    link: string,
    primaryColor: string,
    secondaryColor: string
}
const Url = ({link}: {link: string}) => {

    return (
        <div className="outerBox" style={{height: 55}}>
            <div className="innerBox">
                <Typography style={{color: "white"}}>
                    <Link href={link} color="inherit">
                        {link}
                    </Link>
                </Typography>
            </div>
        </div>
    )
}
export default Url