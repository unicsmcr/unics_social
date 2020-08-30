import React, { useEffect, useState } from 'react';

import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

import { useSelector, useDispatch } from 'react-redux';
import { fetchMe, selectMe } from '../../store/slices/UsersSlice';
import { unwrapResult } from '@reduxjs/toolkit';
import NotificationDialog from '../util/NotificationDialog';
import Page from '../Page';
import { Paper, Avatar } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
	heroContent: {
		padding: theme.spacing(14, 2, 4, 2)
	},
	mainContent: {
		padding: theme.spacing(8, 2, 14, 2),
		textAlign: 'center'
	},
	paper: {
		padding: theme.spacing(2),
		marginBottom: theme.spacing(8)
	},
	form: {
		'textAlign': 'center',
		'& > *': {
			margin: theme.spacing(1, 0, 2, 0)
		}
	},
	avatar: {
		display: 'inline-flex',
		height: theme.spacing(16),
		width: theme.spacing(16)
	}
}));

enum PageState {
	Loading,
	Loaded,
	Failed
}

export default function AccountSettingsPage() {
	const me = useSelector(selectMe);
	const [fetchError, setFetchError] = useState('');
	const [pageState, setPageState] = useState(me ? PageState.Loaded : PageState.Loading);
	const classes = useStyles();
	const dispatch = useDispatch();

	useEffect(() => {
		if (!me && pageState === PageState.Loading) {
			(dispatch(fetchMe()) as any)
				.then(unwrapResult)
				.then(() => setPageState(PageState.Loaded))
				.catch(error => setFetchError(error.message ?? 'Unexpected error fetching account details'));
		}
	}, [me, pageState, dispatch]);

	const mainContent = () => {
		if (me) {
			return <>
				<Paper elevation={2} className={classes.paper}>
					<Typography component="h2" variant="h6" color="textPrimary" align="left" gutterBottom>Account Settings</Typography>
					<form className={classes.form}>
						<TextField fullWidth defaultValue={me.forename} label="Forename" variant="outlined" />
						<TextField fullWidth defaultValue={me.surname} label="Surname" variant="outlined" />
					</form>
				</Paper>
				<Paper elevation={2} className={classes.paper}>
					<Typography component="h2" variant="h6" color="inherit" align="left" gutterBottom>Profile Settings</Typography>
					<form className={classes.form}>
						<Avatar alt={`${me.forename} ${me.surname}`} src="" className={classes.avatar} />
						<TextField fullWidth defaultValue={''} label="Course" variant="outlined" />
						<TextField fullWidth defaultValue={''} label="Instagram" variant="outlined" />
						<TextField fullWidth defaultValue={''} label="Facebook" variant="outlined" />
						<TextField fullWidth defaultValue={''} label="Twitter" variant="outlined" />
					</form>
				</Paper>
			</>;
		} else if (pageState === PageState.Loading) {
			return <CircularProgress />;
		}
		return <Button variant="contained" color="primary" onClick={() => setPageState(PageState.Loading)}>Retry</Button>;
	};

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
					mainContent()
				}
			</Container>
			<NotificationDialog
				title="Failed to fetch account details"
				message={fetchError}
				show={Boolean(fetchError)}
				onClose={() => {
					setFetchError('');
					setPageState(PageState.Failed);
				}}
			/>
		</Page>
	);
}
