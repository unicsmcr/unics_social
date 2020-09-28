import React, { FormEvent, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import { client } from '../util/makeClient';
import asAPIError from '../util/asAPIError';
import NotificationDialog from '../util/NotificationDialog';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import { useDispatch } from 'react-redux';
import { setJWT } from '../../store/slices/AuthSlice';
import Page from '../Page';
import { Divider, Link } from '@material-ui/core';
import { ResendVerificationEmailModal } from './ResendVerificationEmailModal';
import { ForgotPasswordModal } from './ForgotPasswordModal';

const useStyles = makeStyles(theme => ({
	mainContent: {
		minHeight: 'calc(100vh - 4rem)',
		display: 'grid',
		gridTemplateColumns: '1fr minmax(300px, 1fr)',
		[theme.breakpoints.down('md')]: {
			gridTemplateColumns: '0 1fr'
		}
	},
	image: {
		backgroundColor: '#520F79',
		background: `url(${require('../../assets/backdrop_1.jpg')})`,
		backgroundSize: 'cover',
		backgroundPosition: 'center'
	},
	form: {
		'textAlign': 'center',
		'& > *': {
			margin: theme.spacing(1, 0, 2, 0)
		}
	},
	icon: {
		margin: theme.spacing(2, 0, 2, 0)
	},
	contentBox: {
		padding: theme.spacing(4, 2),
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center'
	}
}));

enum LoginPageState {
	FillingForm,
	LoggingIn,
	Success
}

enum OpenModal {
	None,
	ResendEmail,
	ForgotPassword
}

type FormField = 'forename'|'surname'|'email'|'password';

export default function LoginPage() {
	const dispatch = useDispatch();
	const classes = useStyles();
	const [state, setState] = useState({
		formState: LoginPageState.FillingForm,
		email: '',
		password: '',
		emailError: '',
		passwordError: '',
		formError: ''
	});

	const [openModal, setOpenModal] = useState<OpenModal>(OpenModal.None);

	const changeInput = (key: FormField, value: string) => {
		setState({
			...state,
			[key]: value,
			[`${key}Error`]: ''
		});
	};

	const onSubmit = (e: FormEvent) => {
		e.preventDefault();
		if (state.formState !== LoginPageState.FillingForm) return;
		const newState = { ...state };
		newState.emailError = state.email ? '' : 'Required';
		newState.passwordError = state.password ? '' : 'Required';

		const { emailError, passwordError } = newState;
		if (!(emailError || passwordError)) newState.formState = LoginPageState.LoggingIn;

		setState(newState);
		if (newState.formState !== LoginPageState.LoggingIn) return;

		const { email, password } = newState;
		const login = () => {
			client.authenticate({
				email, password
			})
				.then(jwt => {
					setState({ ...state, formState: LoginPageState.Success });
					setTimeout(() => dispatch(setJWT(jwt)), 1e3);
				})
				.catch(err => {
					console.warn(err);
					setState({
						...state,
						formState: LoginPageState.FillingForm,
						formError: asAPIError(err) ?? 'An unexpected error occurred trying to login to the account.'
					});
				});
		};

		setTimeout(login, 1e3);
	};

	const mainContent = () => {
		const buildProps = (key: FormField, label: string) => ({
			label,
			fullWidth: true,
			error: Boolean(state[`${key}Error`]),
			helperText: state[`${key}Error`],
			onChange: (e: React.ChangeEvent<HTMLInputElement>) => changeInput(key, e.target.value),
			value: state[key]
		});
		switch (state.formState) {
			case LoginPageState.FillingForm:
				return <form noValidate autoComplete="off" className={classes.form} onSubmit={onSubmit}>
					<TextField variant="outlined" InputProps={{ type: 'email' }} { ...buildProps('email', 'Email') }/>
					<TextField variant="outlined" InputProps={{ type: 'password' }} { ...buildProps('password', 'Password') } />
					<Button variant="contained" color="primary" type="submit">
						Login
					</Button>
					<Divider />
					<Link href="#" color="textSecondary" onClick={e => {
						e.preventDefault();
						setOpenModal(OpenModal.ForgotPassword);
					}}>
						Forgot your password?
					</Link>
					{' | '}
					<Link href="#" color="textSecondary" onClick={e => {
						e.preventDefault();
						setOpenModal(OpenModal.ResendEmail);
					}}>
						Resend confirmation email
					</Link>
				</form>;
			case LoginPageState.LoggingIn:
				return <Box textAlign="center">
					<Typography component="p" variant="body1" align="center" color="textPrimary" className={classes.icon}>
						Checking your details...
					</Typography>
					<CircularProgress />
				</Box>;
			case LoginPageState.Success:
				return <Card>
					<CardContent style={{ textAlign: 'center' }}>
						<CheckCircleOutlineIcon fontSize="large" color="primary" className={classes.icon}/>
						<Typography component="p" variant="body1" align="center" color="textPrimary">
							Success! Redirecting now...
						</Typography>
					</CardContent>
				</Card>;
		}
	};

	return (
		<Page>
			<Box component="section" className={classes.mainContent}>
				<Box className={classes.image}></Box>
				<Box className={classes.contentBox}>
					<Container maxWidth="sm">
						<Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
							Login
						</Typography>
						{
							mainContent()
						}
					</Container>
				</Box>
			</Box>
			<NotificationDialog
				title="Failed to login"
				message={state.formError}
				show={Boolean(state.formError)}
				onClose={() => setState({ ...state, formError: '' })}
			/>
			<ResendVerificationEmailModal
				open={openModal === OpenModal.ResendEmail}
				onClose={() => setOpenModal(OpenModal.None)}
			/>
			<ForgotPasswordModal
				open={openModal === OpenModal.ForgotPassword}
				onClose={() => setOpenModal(OpenModal.None)}
			/>
		</Page>
	);
}
