import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Footer from '../Footer';
import useStyles from '../util/useStyles';
import PublicAppBar from '../bars/PublicAppBar';

export default function LoginPage() {
	const classes = useStyles();

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
			{/* End hero unit */}
			<Footer />
		</>
	);
}
