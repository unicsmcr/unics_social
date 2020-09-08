import React from 'react';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import useStyles from '../util/useStyles';
import Page from '../Page';
export default function Homepage() {
	const classes = useStyles();

	return (
		<Page>
			{/* Hero unit */}
			<Container maxWidth="sm" component="main" className={classes.heroContent}>
				<Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
					UniCS KB
				</Typography>
				<Typography variant="h5" align="center" color="textSecondary" component="p">
					We're helping to connect University of Manchester students with each other online in light of the COVID-19 pandemic!
				</Typography>
			</Container>
			{/* End hero unit */}
		</Page>
	);
}
