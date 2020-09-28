import { Box, Container, Link, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import Page from '../Page';

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
		background: `url(${require('../../assets/backdrop_2.jpg')})`,
		backgroundSize: 'cover',
		backgroundPosition: 'center'
	},
	contentBox: {
		padding: theme.spacing(8, 2),
		[theme.breakpoints.down('sm')]: {
			padding: theme.spacing(4, 2)
		}
	},
	paragraph: {
		fontSize: '1rem'
	}
}));

export default function ContactUsPage() {
	const classes = useStyles();

	return <Page>
		<Box component="section" className={classes.mainContent}>
			<Box className={classes.image}></Box>
			<Box className={classes.contentBox}>
				<Container maxWidth="sm">
					<Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
					Contact Us
					</Typography>
					<p className={classes.paragraph}>
						Got a question about KB or anything else UniCS related? Feel free to reach out to us at <Link href="mailto:contact@unicsmcr.com">contact@unicsmcr.com</Link>, or visit <Link href="https://unicsmcr.com">unicsmcr.com</Link> to find out more about what we're up to!
					</p>
					<p className={classes.paragraph}>
						Interested in sponsoring UniCS? Contact us at <Link href="mailto:sponsors@unicsmcr.com">sponsors@unicsmcr.com</Link>.
					</p>
					<p style={{ textAlign: 'center', marginTop: '4rem' }}>
						<a href="https://unicsmcr.com"><img src={require('../../assets/unics_logo.png')} alt="UniCS Logo"/></a>
					</p>
				</Container>
			</Box>
		</Box>
	</Page>;
}
