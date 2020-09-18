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
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Box from '@material-ui/core/Box';

import { useSelector, useDispatch } from 'react-redux';
import { fetchMe, selectMe } from '../../store/slices/UsersSlice';
import { unwrapResult } from '@reduxjs/toolkit';
import NotificationDialog from '../util/NotificationDialog';
import Page from '../Page';
import { APIUser, Year, Course, Visibility } from '@unicsmcr/unics_social_api_client';
import API_HOST from '../util/APIHost';
import { client } from '../util/makeClient';
import asAPIError from '../util/asAPIError';

import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import InputAdornment from '@material-ui/core/InputAdornment';

import InstagramIcon from '@material-ui/icons/Instagram';
import FacebookIcon from '@material-ui/icons/Facebook';
import TwitterIcon from '@material-ui/icons/Twitter';
import LinkedInIcon from '@material-ui/icons/LinkedIn';

const useStyles = makeStyles(theme => ({
	heroContent: {
		padding: theme.spacing(8, 2, 0, 2)
	},
	mainContent: {
		padding: theme.spacing(0, 2, 8, 2),
		textAlign: 'center'
	},
	warning: {
		padding: theme.spacing(4)
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
	},
	formControl: {
		minWidth: '100%',
		textAlign: 'left'
	},
	profileSection: {
		marginTop: theme.spacing(2),
		display: 'inline-block'
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
	const [saveMessage, setSaveMessage] = useState<{ title: string; message: string } | null>(null);

	const [hasChanged, setHasChanged] = useState(false);
	const [avatarMenuTarget, setAvatarMenuTarget] = useState<null | HTMLElement>(null);

	const [userState, setUserState] = useState({
		forename: me.forename,
		surname: me.surname,
		profile: {
			course: me.profile?.course,
			yearOfStudy: me.profile?.yearOfStudy ?? '',
			facebook: me.profile?.facebook ?? '',
			twitter: me.profile?.twitter ?? '',
			instagram: me.profile?.instagram ?? '',
			linkedin: me.profile?.linkedin ?? '',
			visibility: me.profile?.visibility
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

	const profileSettingsChanged = () => {
		if (!hasChanged) {
			setHasChanged(true);
		}
	};

	const formRef = createRef<HTMLFormElement>();

	const updateProfile = () => {
		let avatarAttachment: File | boolean;
		if (avatar === '') {
			avatarAttachment = false;
		} else if (inputFile.current?.files) {
			avatarAttachment = inputFile.current.files[0];
		} else {
			avatarAttachment = true;
		}

		if (!formRef.current) return;

		const profile = Object.fromEntries(new FormData(formRef.current).entries());
		const newUserState = {
			...userState,
			profile: {
				...userState.profile,
				...profile
			}
		};
		console.log(newUserState);
		setUserState(newUserState);

		setSaveState(SaveState.Saving);
		client.editProfile({
			...newUserState.profile,
			avatar: avatarAttachment
		} as any).then(me => {
			dispatch({
				type: 'users/fetchMe/fulfilled',
				payload: me
			});
			setHasChanged(false);
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
		{
			!me.profile && <Paper elevation={2} className={classes.warning}>
				<ErrorOutlineIcon />
				<Typography variant="body1" color="textSecondary">
				Before you can use UniCS  KB and meet new people, you need to finish setting up your profile below! You need to set at least your course and year of study before you can continue.
				</Typography>
			</Paper>
		}
		{<Fab variant="extended" color="primary" aria-label="save" className={classes.saveButton} disabled={!hasChanged || saveState === SaveState.Saving} onClick={updateProfile}>
			<SaveIcon className={classes.saveIcon} />
			Save Changes
		</Fab>}
		<Paper elevation={2} className={classes.paper}>
			<Typography component="h2" variant="h6" color="textPrimary" align="left" gutterBottom>Account Settings</Typography>
			<Typography component="p" color="textSecondary" align="center" className={classes.margin}>To change any of the information here, please contact us directly.</Typography>
			<form className={classes.form}>
				<TextField fullWidth label="Forename" name="forename" variant="outlined" disabled defaultValue={userState.forename} />
				<TextField fullWidth label="Surname" name="surname" variant="outlined" disabled defaultValue={userState.surname} />
			</form>
		</Paper>
		<Paper elevation={2} className={classes.paper}>
			<Typography component="h2" variant="h6" color="inherit" align="left" gutterBottom>Profile Settings</Typography>
			<form ref={formRef} className={classes.form} onChange={() => profileSettingsChanged()}>
				<input type="file" id="file" ref={inputFile} style={{ display: 'none' }} onChange={fileUploaded} accept="image/*"/>
				<Avatar alt={`${me.forename} ${me.surname}`} src={avatar} className={classes.avatar} onClick={avatarClicked} />

				<Box>
					<Typography variant="overline" gutterBottom className={classes.profileSection}>Key Information</Typography>
				</Box>

				<Box>
					<FormControl variant="outlined" className={classes.formControl}>
						<InputLabel id="form-label-course" required>Course</InputLabel>
						<Select
							labelId="form-label-course"
							id="form-course"
							name="course"
							defaultValue={userState.profile.course}
							label="Course *"
							required
							onChange={() => profileSettingsChanged()}
						>
							{
								[...Object.values(Course)].map(course => <MenuItem value={course} key={course}>{course}</MenuItem>)
							}
						</Select>
					</FormControl>
				</Box>

				<Box>
					<FormControl variant="outlined" className={classes.formControl}>
						<InputLabel id="form-label-year-of-study" required>Year of Study</InputLabel>
						<Select
							labelId="form-label-year-of-study"
							id="form-year-of-study"
							name="yearOfStudy"
							defaultValue={userState.profile.yearOfStudy}
							label="Year of Study *"
							onChange={() => profileSettingsChanged()}
							required
						>
							{
								[...Object.values(Year)].map(year => <MenuItem value={year} key={year}>{year}</MenuItem>)
							}
						</Select>
					</FormControl>
				</Box>

				<Box>
					<FormControl variant="outlined" className={classes.formControl}>
						<InputLabel id="form-label-visibility" required>Profile Visibility</InputLabel>
						<Select
							labelId="form-label-visibility"
							id="form-visibility"
							name="visibility"
							defaultValue={userState.profile.visibility ?? Visibility.Public}
							label="Profile Visibility *"
							onChange={() => profileSettingsChanged()}
							required
						>
							<MenuItem value={Visibility.Public}>Public - list me in the users directory</MenuItem>
							<MenuItem value={Visibility.Private}>Private - don't list me in the users directory</MenuItem>
						</Select>
					</FormControl>
				</Box>

				<Typography variant="overline" gutterBottom className={classes.profileSection}>Social Media</Typography>

				<TextField fullWidth label="Instagram" name="instagram" variant="outlined" defaultValue={userState.profile.instagram}
					InputProps={{
						startAdornment: (
							<InputAdornment position="start">
								<InstagramIcon />
							</InputAdornment>
						)
					}}/>
				<TextField fullWidth label="Facebook" name="facebook" variant="outlined" defaultValue={userState.profile.facebook}
					InputProps={{
						startAdornment: (
							<InputAdornment position="start">
								<FacebookIcon />
							</InputAdornment>
						)
					}}/>
				<TextField fullWidth label="Twitter" name="twitter" variant="outlined" defaultValue={userState.profile.twitter}
					InputProps={{
						startAdornment: (
							<InputAdornment position="start">
								<TwitterIcon />
							</InputAdornment>
						)
					}}/>
				<TextField fullWidth label="LinkedIn" name="linkedin" variant="outlined" defaultValue={userState.profile.linkedin}
					InputProps={{
						startAdornment: (
							<InputAdornment position="start">
								<LinkedInIcon />
							</InputAdornment>
						)
					}}/>

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
