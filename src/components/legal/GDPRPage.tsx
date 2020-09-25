import { Container, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import Page from '../Page';
import GDPR from './GDPR';

const useStyles = makeStyles(theme => ({
	container: {
		padding: theme.spacing(2),
		fontSize: '1rem'
	},
	gdpr: {
		'fontSize': '1em',
		'textAlign': 'left',
		'& ul': {
			'listStyleType': 'disc',
			'marginLeft': theme.spacing(3),
			'& li': {
				paddingLeft: theme.spacing(1)
			}
		}
	}
}));

export default function GDPRPage() {
	const classes = useStyles();

	return <Page>
		<Container maxWidth="sm" className={classes.container}>
			<Typography variant="h2">
				Privacy Policy
			</Typography>
			<ReactMarkdown source={GDPR} className={classes.gdpr} />
		</Container>
	</Page>;
}
