import React, { FormEvent, useState } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Footer from '../Footer';
import PublicAppBar from '../bars/PublicAppBar';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import makeClient from '../util/makeClient';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import asAPIError from '../util/asAPIError';

const EMAIL_REGEX = new RegExp(/^[-!#$%&'*+/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~])*@(\w+\.)?manchester\.ac\.uk$/);

const useStyles = makeStyles(theme => ({
	heroContent: {
		padding: theme.spacing(28, 2, 8, 2)
	},
	form: {
		'textAlign': 'center',
		'& > *': {
			margin: theme.spacing(1, 0, 2, 0)
		}
	}
}));

enum RegistrationState {
	FillingForm,
	Registering,
	Success
}

export default function RegistrationPage() {
	const classes = useStyles();
	const [state, setState] = useState({
		formState: RegistrationState.FillingForm,
		forename: '',
		surname: '',
		email: '',
		password: '',
		forenameError: '',
		surnameError: '',
		emailError: '',
		passwordError: '',
		formError: ''
	});

	const changeInput = (key: 'forename'|'surname'|'email'|'password', value: string) => {
		setState({
			...state,
			[key]: value,
			[`${key}Error`]: ''
		});
	};

	const onSubmit = (e: FormEvent) => {
		e.preventDefault();
		if (state.formState !== RegistrationState.FillingForm) return;
		const newState = { ...state };
		newState.forenameError = state.forename ? '' : 'Required';
		newState.surnameError = state.surname ? '' : 'Required';
		newState.emailError = EMAIL_REGEX.exec(state.email) ? '' : 'Valid student email required';
		newState.passwordError = state.password ? '' : 'Required';

		const { forenameError, surnameError, emailError, passwordError } = newState;
		if (!(forenameError || surnameError || emailError || passwordError)) newState.formState = RegistrationState.Registering;

		setState(newState);
		if (newState.formState !== RegistrationState.Registering) return;

		const client = makeClient();
		const { forename, surname, password, email } = newState;
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

	return (
		<>
			<CssBaseline />
			<PublicAppBar />
			{/* Hero unit */}
			<Container maxWidth="sm" component="main" className={classes.heroContent}>
				<Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
          Register
				</Typography>
				<Typography variant="h5" align="center" color="textSecondary" component="p">
          Register a new account here
				</Typography>
			</Container>
			<Container maxWidth="sm" component="section">
				<form noValidate autoComplete="off" className={classes.form} onSubmit={onSubmit}>
					<TextField label="Forename" variant="outlined" fullWidth error={Boolean(state.forenameError)} helperText={state.forenameError} onChange={e => changeInput('forename', e.target.value)}/>
					<TextField label="Surname" variant="outlined" fullWidth error={Boolean(state.surnameError)} helperText={state.surnameError} onChange={e => changeInput('surname', e.target.value)} />
					<TextField label="Email" variant="outlined" fullWidth InputProps={{ type: 'email' }} error={Boolean(state.emailError)} helperText={state.emailError} onChange={e => changeInput('email', e.target.value)} />
					<TextField label="Password" variant="outlined" fullWidth InputProps={{ type: 'password' }} error={Boolean(state.passwordError)} helperText={state.passwordError} onChange={e => changeInput('password', e.target.value)} />
					<Button variant="contained" color="primary" type="submit">
						Register
					</Button>
				</form>
			</Container>
			{/* End hero unit */}
			<Dialog
				open={state.formError.length > 0}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title">Failed to register your account</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-description">
						{ state.formError }
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setState({ ...state, formError: '' })} color="primary">
						Ok
					</Button>
				</DialogActions>
			</Dialog>
			<Footer />
		</>
	);
}
