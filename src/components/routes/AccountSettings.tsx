import React, { useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMe, selectMe } from '../../store/slices/UsersSlice';
import { makeStyles, TextField, CircularProgress } from '@material-ui/core';
import Page from '../Page';

const useStyles = makeStyles(theme => ({
	heroContent: {
		padding: theme.spacing(28, 2, 8, 2)
	},
	mainContent: {
		padding: theme.spacing(8, 2, 28, 2),
		textAlign: 'center'
	},
	form: {
		'textAlign': 'center',
		'& > *': {
			margin: theme.spacing(1, 0, 2, 0)
		}
	}
}));

export default function AccountSettingsPage() {
	const classes = useStyles();
	const dispatch = useDispatch();
	const me = useSelector(selectMe);

	useEffect(() => {
		if (!me) dispatch(fetchMe());
	});

	return (
		<Page>
			{/* Hero unit */}
			<Container maxWidth="sm" component="header" className={classes.heroContent}>
				<Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
					Account Settings
				</Typography>
			</Container>
			{/* End hero unit */}
			<Container maxWidth="sm" component="main" className={classes.mainContent}>
				{
					me
						? <form className={classes.form}>
							<TextField fullWidth defaultValue={me.forename} label="Forename" variant="outlined" disabled />
							<TextField fullWidth defaultValue={me.surname} label="Surname" variant="outlined" disabled />
						</form>
						: <CircularProgress />
				}
			</Container>
		</Page>
	);
}
