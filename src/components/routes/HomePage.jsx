import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Footer from '../../components/Footer';
import useStyles from '../../components/util/useStyles';
import PublicAppBar from '../bars/PublicAppBar';
import EventCard from '../EventCard';
import LoadingEventCard from '../LoadingEventCard';

export default function Homepage() {
	const classes = useStyles();

	return (
		<>
			<CssBaseline />
			<PublicAppBar />
			{/* Hero unit */}
			<Container maxWidth="sm" component="main" className={classes.heroContent}>
				<Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
          UniCS KB
				</Typography>
				<Typography variant="h5" align="center" color="textSecondary" component="p">
          We're helping to connect University of Manchester students with each other online in light of the COVID-19 pandemic!
				</Typography>
				<EventCard title="Event" description="dsdsd" startDate="23/12" endDate="12/12"/>
				<LoadingEventCard/>
				<EventCard title="Event" description="dsds" startDate="22/12" endDate="12/12" expired={true}/>
			</Container>
			{/* End hero unit */}
			<Footer />
		</>
	);
}
