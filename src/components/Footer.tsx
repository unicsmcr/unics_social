import React from 'react';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import useStyles from './util/useStyles';
import { Link as RouterLink } from 'react-router-dom';

const footers = [
	{
		title: 'General',
		links: [
			['About', '/'],
			['Contact', '/contact']
		]
	},
	{
		title: 'Resources',
		links: [
			['UniCS', 'https://unicsmcr.com'],
			['GitHub', 'https://github.com/unicsmcr'],
			['Discord', 'https://unicsmcr.com/discord']
		]
	},
	{
		title: 'Legal',
		links: [
			['Privacy policy', 'privacy-policy']
		]
	}
];

const footerList = footers.map(footer => (
	<Grid item xs={6} sm={4} key={footer.title}>
		<Typography variant="h6" color="textPrimary" gutterBottom>
			{footer.title}
		</Typography>
		<ul>
			{footer.links.map(([item, url]) => (
				<li key={item}>
					{
						url.startsWith('http')
							? <Link href={url} variant="subtitle1" color="textSecondary">
								{item}
							</Link>
							: <Link component={RouterLink} to={url} variant="subtitle1" color="textSecondary">
								{item}
							</Link>
					}
				</li>
			))}
		</ul>
	</Grid>
));

export default function Footer() {
	const classes = useStyles();

	return <Container maxWidth="md" component="footer" className={classes.footer}>
		<Grid container spacing={4} justify="space-between">
			{footerList}
		</Grid>
		<Box mt={5}>
			<Copyright />
		</Box>
	</Container>;
}

function Copyright() {
	return (
		<Typography variant="body2" color="textSecondary" align="center">
			{'Copyright © '}
			<Link color="inherit" href="https://unicsmcr.com/">
        UniCS Manchester
			</Link>{' '}
			{new Date().getFullYear()}
			{'.'}
		</Typography>
	);
}
