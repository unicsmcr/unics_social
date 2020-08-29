import React, { FormEvent, useState } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Footer from '../Footer';
import PublicAppBar from '../bars/PublicAppBar';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import makeClient from '../util/makeClient';
import asAPIError from '../util/asAPIError';
import NotificationDialog from '../util/NotificationDialog';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import { useDispatch } from 'react-redux';
import { setJWT } from '../../store/slices/AuthSlice';

const useStyles = makeStyles(theme => ({
	heroContent: {
		padding: theme.spacing(28, 2, 8, 2)
	},
	mainContent: {
		padding: theme.spacing(8, 2, 28, 2)
	},
	form: {
		'textAlign': 'center',
		'& > *': {
			margin: theme.spacing(1, 0, 2, 0)
		}
	},
	icon: {
		margin: theme.spacing(2, 0, 2, 0)
	}
}));

enum LoginPageState {
	FillingForm,
	LoggingIn,
	Success
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

		const client = makeClient();
		const { email, password } = newState;
		const login = () => {
			client.authenticate({
				email, password
			})
				.then(jwt => {
					dispatch(setJWT({ jwt }));
					setState({ ...state, formState: LoginPageState.Success });
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
							Success! Once this is finished, this will actually lead somewhere :)
						</Typography>
					</CardContent>
				</Card>;
		}
	};

	return (
		<>
			<CssBaseline />
			<PublicAppBar />
			{/* Hero unit */}
			<Container maxWidth="sm" component="main" className={classes.heroContent}>
				<Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
          Login
				</Typography>
				<Typography variant="h5" align="center" color="textSecondary" component="p">
          Login to your account here
				</Typography>
			</Container>
			<Container maxWidth="sm" component="section" className={classes.mainContent}>
				{
					mainContent()
				}
			</Container>
			{/* End hero unit */}
			<NotificationDialog
				title="Failed to login"
				message={state.formError}
				show={Boolean(state.formError)}
				onClose={() => setState({ ...state, formError: '' })}
			/>
			<Footer />
		</>
	);
}
