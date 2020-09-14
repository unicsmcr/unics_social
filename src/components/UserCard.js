import React from 'react';
import { Paper, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import * as stockImage from './../assets/chat_bg.png';

const useStyles = makeStyles(theme => ({
	body: {
		width: '30vh',
		height: '15vh',
		display: 'flex',
		flexDirection: 'row'
	},
	imageSection: {
		padding: theme.spacing(1),
		width: '30%',
		display: 'flex',
		alignContent: 'center',
		justifyContent: 'center'
	},
	image: {
		borderRadius: '50%',
		width: '100%',
		height: '55%',
		alignSelf: 'center',
		objectFit: 'cover'
	},
	contentSection: {
		padding: theme.spacing(1),
		display: 'flex',
		width: '70%',
		flexDirection: 'column',
		justifyContent: 'center'
	}
}));
const UserCard = ({ fullName, course, year }) => {
	const classes = useStyles();

	return (
		<Paper className={classes.body} elevation={5}>
			<div className={classes.imageSection}>
				<img src={stockImage} className={classes.image}/>
			</div>
			<div className={classes.contentSection}>
				<Typography component="h3" variant="h5">
					{fullName}
				</Typography>
				<Typography color="textSecondary">
					{course}
				</Typography>
				<Typography color="primary">
					{year}
				</Typography>
			</div>
		</Paper>
	);
};
export default UserCard;
