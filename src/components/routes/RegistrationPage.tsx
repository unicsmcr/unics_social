import React, { FormEvent } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Footer from '../Footer';
import PublicAppBar from '../bars/PublicAppBar';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';

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

function onSubmit(e: FormEvent) {
	e.preventDefault();
}

export default function RegistrationPage() {
	const classes = useStyles();

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
					<TextField label="Forename" variant="outlined" fullWidth />
					<TextField label="Surname" variant="outlined" fullWidth />
					<TextField label="Email" variant="outlined" fullWidth InputProps={{ type: 'email' }} />
					<TextField label="Password" variant="outlined" fullWidth InputProps={{ type: 'password' }} />
					<Button variant="contained" color="primary" type="submit">
						Register
					</Button>
				</form>
			</Container>
			{/* End hero unit */}
			<Footer />
		</>
	);
}
