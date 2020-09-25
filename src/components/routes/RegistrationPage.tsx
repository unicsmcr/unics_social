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
import Page from '../Page';

const EMAIL_REGEX = new RegExp(/^[-!#$%&'*+/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~])*@(\w+\.)?manchester\.ac\.uk$/);

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
		background: `url(${require('../../assets/homepage_bg.jpg')})`,
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

enum RegistrationState {
	FillingForm,
	Registering,
	Success
}

type FormField = 'forename'|'surname'|'email'|'password'|'confirmPassword';

export default function RegistrationPage() {
	const classes = useStyles();
	const [state, setState] = useState({
		formState: RegistrationState.FillingForm,
		forename: '',
		surname: '',
		email: '',
		password: '',
		confirmPassword: '',
		forenameError: '',
		surnameError: '',
		emailError: '',
		passwordError: '',
		formError: '',
		confirmPasswordError: ''
	});

	const inputChanged = (key: FormField) => {
		const errorKey = `${key}Error`;
		if (state[errorKey]) {
			setState({ ...state, [errorKey]: '' });
		}
	};

	const onSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (state.formState !== RegistrationState.FillingForm) return;
		const newState = { ...state, ...Object.fromEntries(new FormData(e.target as any).entries()) };
		newState.forenameError = newState.forename ? '' : 'Required';
		newState.surnameError = newState.surname ? '' : 'Required';
		newState.emailError = EMAIL_REGEX.exec(newState.email) ? '' : 'Valid student email required';
		newState.passwordError = newState.password ? '' : 'Required';
		newState.confirmPasswordError = newState.password === newState.confirmPassword ? '' : 'Passwords do not match';

		const { forenameError, surnameError, emailError, passwordError, confirmPasswordError } = newState;
		if (!(forenameError || surnameError || emailError || passwordError || confirmPasswordError)) newState.formState = RegistrationState.Registering;

		setState(newState);
		if (newState.formState !== RegistrationState.Registering) return;

		const { forename, surname, password, email } = newState;
		const register = () => {
			client.register({
				forename, surname, password, email
			})
				.then(() => setState({ ...state, formState: RegistrationState.Success }))
				.catch(err => {
					console.warn(err);
					setState({
						...state,
						formState: RegistrationState.FillingForm,
						formError: asAPIError(err) ?? 'An unexpected error occurred trying to register your account.'
					});
				});
		};

		setTimeout(register, 1e3);
	};

	const mainContent = () => {
		const buildProps = (key: FormField, label: string) => ({
			name: key,
			label,
			fullWidth: true,
			error: Boolean(state[`${key}Error`]),
			helperText: state[`${key}Error`],
			onChange: () => inputChanged(key)
		});
		switch (state.formState) {
			case RegistrationState.FillingForm:
				return <form noValidate autoComplete="off" className={classes.form} onSubmit={onSubmit}>
					<TextField variant="outlined" { ...buildProps('forename', 'Forename') } />
					<TextField variant="outlined" { ...buildProps('surname', 'Surname') } />
					<TextField variant="outlined" InputProps={{ type: 'email' }} { ...buildProps('email', 'Email') }/>
					<TextField variant="outlined" InputProps={{ type: 'password' }} { ...buildProps('password', 'Password') } />
					<TextField variant="outlined" InputProps={{ type: 'password' }} { ...buildProps('confirmPassword', 'Confirm Password') } />
					<Button variant="contained" color="primary" type="submit">
						Register
					</Button>
				</form>;
			case RegistrationState.Registering:
				return <Box textAlign="center">
					<Typography component="p" variant="body1" align="center" color="textPrimary" className={classes.icon}>
						Registering your account...
					</Typography>
					<CircularProgress />
				</Box>;
			case RegistrationState.Success:
				return <Card>
					<CardContent style={{ textAlign: 'center' }}>
						<CheckCircleOutlineIcon fontSize="large" color="primary" className={classes.icon}/>
						<Typography component="p" variant="body1" align="center" color="textPrimary">
							Success! Check your email to confirm your UniCS KB account!
						</Typography>
					</CardContent>
				</Card>;
		}
	};

	return (
		<Page>
			{/* Hero unit */}
			<Box component="section" className={classes.mainContent}>
				<Box className={classes.image}></Box>
				<Box className={classes.contentBox}>
					<Container maxWidth="sm">
						<Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
							Register
						</Typography>
						<Typography variant="h5" align="center" color="textSecondary" component="p" gutterBottom>
							Register a new account here
						</Typography>
						{
							mainContent()
						}
					</Container>
				</Box>
			</Box>
			{/* End hero unit */}
			<NotificationDialog
				title="Failed to register your account"
				message={state.formError}
				show={Boolean(state.formError)}
				onClose={() => setState({ ...state, formError: '' })}
			/>
		</Page>
	);
}
