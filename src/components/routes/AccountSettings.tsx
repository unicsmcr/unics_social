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
import { Paper, Avatar, Menu, MenuItem } from '@material-ui/core';
import { APIUser } from '@unicsmcr/unics_social_api_client';

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
		width: theme.spacing(16),
		cursor: 'pointer'
	}
}));

enum PageState {
	Loading,
	Loaded,
	Failed
}

function AccountSettings({ me }: { me: APIUser }) {
	const classes = useStyles();
	const [avatarMenuTarget, setAvatarMenuTarget] = useState<null | HTMLElement>(null);

	const [userState, setUserState] = useState({
		forename: me.forename,
		surname: me.surname,
		profile: {
			course: me.profile?.course ?? '',
			yearOfStudy: me.profile?.yearOfStudy ?? '',
			profilePicture: me.profile?.profilePicture ?? '',
			facebook: me.profile?.facebook ?? '',
			twitter: me.profile?.twitter ?? '',
			instagram: me.profile?.instagram ?? ''
		}
	});

	const avatarClicked = e => setAvatarMenuTarget(e.target);
	const accountSettingsChanged = e => setUserState({ ...userState, [e.target.name]: e.target.value });
	const profileSettingsChanged = e => setUserState({ ...userState, profile: { ...userState.profile, [e.target.name]: e.target.value } });

	return <>
		<Paper elevation={2} className={classes.paper}>
			<Typography component="h2" variant="h6" color="textPrimary" align="left" gutterBottom>Account Settings</Typography>
			<form className={classes.form}>
				<TextField fullWidth label="Forename" name="forename" variant="outlined" onBlur={accountSettingsChanged} defaultValue={userState.forename}/>
				<TextField fullWidth label="Surname" name="surname" variant="outlined" onBlur={accountSettingsChanged} defaultValue={userState.surname}/>
			</form>
		</Paper>
		<Paper elevation={2} className={classes.paper}>
			<Typography component="h2" variant="h6" color="inherit" align="left" gutterBottom>Profile Settings</Typography>
			<form className={classes.form}>
				<Avatar alt={`${me.forename} ${me.surname}`} src="" className={classes.avatar} onClick={avatarClicked} />
				<TextField fullWidth label="Course" name="course" variant="outlined" onBlur={profileSettingsChanged} defaultValue={userState.profile.course}/>
				<TextField fullWidth label="Year of Study" name="yearOfStudy" variant="outlined" onBlur={profileSettingsChanged} defaultValue={userState.profile.yearOfStudy}/>
				<TextField fullWidth label="Instagram" name="yearOfStudy" variant="outlined" onBlur={profileSettingsChanged} defaultValue={userState.profile.instagram}/>
				<TextField fullWidth label="Facebook" name="yearOfStudy" variant="outlined" onBlur={profileSettingsChanged} defaultValue={userState.profile.facebook}/>
				<TextField fullWidth label="Twitter" name="yearOfStudy" variant="outlined" onBlur={profileSettingsChanged} defaultValue={userState.profile.twitter}/>

				<Menu
					open={Boolean(avatarMenuTarget)}
					onClose={() => setAvatarMenuTarget(null)}
					anchorEl={avatarMenuTarget}
					keepMounted>
					<MenuItem>Select new avatar</MenuItem>
					<MenuItem>Delete avatar</MenuItem>
				</Menu>
			</form>
		</Paper>
	</>;
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
			return <AccountSettings me={me} />;
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
