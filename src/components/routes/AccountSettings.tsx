import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Footer from '../Footer';
import useStyles from '../util/useStyles';
import PublicAppBar from '../bars/PublicAppBar';
import { useSelector } from 'react-redux';
import { selectJWT } from '../../store/slices/AuthSlice';

export default function AccountSettingsPage() {
	const classes = useStyles();
	const jwt = useSelector(selectJWT);

	return (
		<>
			<CssBaseline />
			<PublicAppBar />
			{/* Hero unit */}
			<Container maxWidth="sm" component="main" className={classes.heroContent}>
				<Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
					Account Settings
				</Typography>
				<h1>Hi, {jwt}</h1>
			</Container>
			{/* End hero unit */}
			<Footer />
		</>
	);
}
