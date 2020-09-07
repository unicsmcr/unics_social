import React, { useEffect, useState, createRef } from 'react';

import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Fab from '@material-ui/core/Fab';
import Backdrop from '@material-ui/core/Backdrop';

import { useSelector, useDispatch } from 'react-redux';
import { fetchMe, selectMe } from '../../store/slices/UsersSlice';
import { unwrapResult } from '@reduxjs/toolkit';
import NotificationDialog from '../util/NotificationDialog';
import Page from '../Page';
import { APIUser } from '@unicsmcr/unics_social_api_client';
import API_HOST from '../util/APIHost';
import { client } from '../util/makeClient';
import asAPIError from '../util/asAPIError';

const useStyles = makeStyles(theme => ({
	heroContent: {
		padding: theme.spacing(14, 2, 4, 2)
	},
	mainContent: {
		padding: theme.spacing(4, 2, 14, 2),
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
	},
	saveButton: {
		margin: theme.spacing(4, 0, 8, 0)
	},
	saveIcon: {
		marginRight: theme.spacing(1)
	},
	margin: {
		margin: theme.spacing(4, 1)
	},
	backdrop: {
		zIndex: theme.zIndex.drawer + 1,
		color: '#fff'
	}
}));

enum PageState {
	Loading,
	Loaded,
	Failed
}

enum SaveState {
	Idle,
	Saving
}

function AccountSettings({ me }: { me: APIUser }) {
	const classes = useStyles();
	const dispatch = useDispatch();

	const [saveState, setSaveState] = useState(SaveState.Idle);
	const [saveMessage, setSaveMessage] = useState<{ title: string; message: string }|null>(null);

	const [hasChanged, setHasChanged] = useState(false);
	const [avatarMenuTarget, setAvatarMenuTarget] = useState<null | HTMLElement>(null);

	const [userState, setUserState] = useState({
		forename: me.forename,
		surname: me.surname,
		profile: {
			course: me.profile?.course ?? '',
			yearOfStudy: me.profile?.yearOfStudy ?? '',
			facebook: me.profile?.facebook ?? '',
			twitter: me.profile?.twitter ?? '',
			instagram: me.profile?.instagram ?? ''
		}
	});

	const [avatar, setAvatar] = useState(me.profile?.avatar ? `${API_HOST}/assets/${me.id}.png` : '');

	const inputFile = createRef<HTMLInputElement>();

	const avatarClicked = e => setAvatarMenuTarget(e.target);

	const selectAvatar = () => {
		setAvatarMenuTarget(null);
		inputFile.current?.click();
	};

	const deleteAvatar = () => {
		setAvatarMenuTarget(null);
		setAvatar('');
		setHasChanged(true);
	};

	const fileUploaded = e => {
		setAvatar(URL.createObjectURL(e.target.files[0]));
		setHasChanged(true);
	};

	const profileSettingsChanged = e => {
		setUserState({ ...userState, profile: { ...userState.profile, [e.target.name]: e.target.value } });
		setHasChanged(true);
	};

	const updateProfile = () => {
		let avatarAttachment: File|boolean;
		if (avatar === '') {
			avatarAttachment = false;
		} else if (inputFile.current?.files) {
			avatarAttachment = inputFile.current.files[0];
		} else {
			avatarAttachment = true;
		}

		setSaveState(SaveState.Saving);
		client.editProfile({
			...userState.profile,
			avatar: avatarAttachment as any
		} as any).then(me => {
			dispatch({
				type: 'users/fetchMe/fulfilled',
				payload: me
			});
			setSaveState(SaveState.Idle);
			setSaveMessage({
				title: 'Saved!',
				message: 'Your profile has been updated'
			});
		}).catch(err => {
			setSaveState(SaveState.Idle);
			setSaveMessage({
				title: 'Error updating your profile',
				message: asAPIError(err) ?? 'Unexpect error updating your profile'
			});
		});
	};

	return <>
		{ <Fab variant="extended" color="primary" aria-label="save" className={classes.saveButton} disabled={!hasChanged || saveState === SaveState.Saving} onClick={updateProfile}>
			<SaveIcon className={classes.saveIcon}/>
			Save Changes
		</Fab> }
		<Paper elevation={2} className={classes.paper}>
			<Typography component="h2" variant="h6" color="textPrimary" align="left" gutterBottom>Account Settings</Typography>
			<Typography component="p" color="textSecondary" align="center" className={classes.margin}>To change any of the information here, please contact us directly.</Typography>
			<form className={classes.form}>
				<TextField fullWidth label="Forename" name="forename" variant="outlined" disabled defaultValue={userState.forename}/>
				<TextField fullWidth label="Surname" name="surname" variant="outlined" disabled defaultValue={userState.surname}/>
			</form>
		</Paper>
		<Paper elevation={2} className={classes.paper}>
			<Typography component="h2" variant="h6" color="inherit" align="left" gutterBottom>Profile Settings</Typography>
			<form className={classes.form}>
				<input type="file" id="file" ref={inputFile} style={{ display: 'none' }} onChange={fileUploaded} accept="image/*"/>
				<Avatar alt={`${me.forename} ${me.surname}`} src={avatar} className={classes.avatar} onClick={avatarClicked} />
				<TextField fullWidth label="Course" name="course" variant="outlined" onBlur={profileSettingsChanged} defaultValue={userState.profile.course}/>
				<TextField fullWidth label="Year of Study" name="yearOfStudy" variant="outlined" onBlur={profileSettingsChanged} defaultValue={userState.profile.yearOfStudy}/>
				<TextField fullWidth label="Instagram" name="instagram" variant="outlined" onBlur={profileSettingsChanged} defaultValue={userState.profile.instagram}/>
				<TextField fullWidth label="Facebook" name="facebook" variant="outlined" onBlur={profileSettingsChanged} defaultValue={userState.profile.facebook}/>
				<TextField fullWidth label="Twitter" name="twitter" variant="outlined" onBlur={profileSettingsChanged} defaultValue={userState.profile.twitter}/>

				<Menu
					open={Boolean(avatarMenuTarget)}
					onClose={() => setAvatarMenuTarget(null)}
					anchorEl={avatarMenuTarget}
					keepMounted>
					<MenuItem onClick={selectAvatar}>Select new avatar</MenuItem>
					<MenuItem onClick={deleteAvatar}>Delete avatar</MenuItem>
				</Menu>
			</form>
		</Paper>

		<Backdrop open={saveState === SaveState.Saving} className={classes.backdrop}>
			<CircularProgress color="inherit" />
		</Backdrop>

		<NotificationDialog
			title={saveMessage?.title ?? ''}
			message={saveMessage?.message ?? ''}
			show={Boolean(saveMessage)}
			onClose={() => {
				setSaveMessage(null);
			}}
		/>
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
