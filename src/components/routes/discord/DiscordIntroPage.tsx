import { Button, CircularProgress, Container, makeStyles, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import Page from '../../Page';
import asAPIError from '../../util/asAPIError';
import { client } from '../../util/makeClient';
import NotificationDialog from '../../util/NotificationDialog';

const useStyles = makeStyles(theme => ({
	heroContent: {
		padding: theme.spacing(8, 2, 0, 2)
	},
	mainContent: {
		padding: theme.spacing(0, 2, 8, 2),
		textAlign: 'center',
		minHeight: '40vh'
	},
	topText: {
		marginBottom: theme.spacing(4)
	}
}));

enum PageState {
	Loading,
	Loaded,
	Failed
}

export default function DiscordIntroPage() {
	const classes = useStyles();

	const [state, setState] = useState<PageState>(PageState.Loading);
	const [error, setError] = useState<{ show: boolean; message?: string }>({
		show: false
	});

	const [url, setURL] = useState<string>('');

	useEffect(() => {
		client.getDiscordOAuth2URL()
			.then(url => {
				setURL(url);
				setState(PageState.Loaded);
			})
			.catch(err => {
				const message = asAPIError(err) ?? 'Unknown error occurred';
				setState(PageState.Failed);
				setError({ show: true, message });
			});
	}, []);

	const generateBody = () => {
		switch (state) {
			case PageState.Loading:
				return <CircularProgress />;
			case PageState.Loaded:
				return <Button variant="contained" color="primary" onClick={() => {
					window.open(url, '_blank');
				}}>Join the Discord</Button>;
			case PageState.Failed:
				return <Typography variant="body1" align="center" color="textPrimary">
					Something went wrong!
				</Typography>;
		}
	};

	return <Page>
		{/* Hero unit */}
		<Container maxWidth="sm" component="main" className={classes.heroContent}>
			<Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
				Discord
			</Typography>
		</Container>
		<Container maxWidth="sm" component="section" className={classes.mainContent}>
			<Typography variant="body1" align="center" color="textPrimary" className={classes.topText}>
				You can link your Discord account to UniCS KB and join our server to discover even more people and keep up-to-date with the latest UniCS news!
			</Typography>
			{ generateBody() }
		</Container>
		<NotificationDialog
			message={error.message ?? ''}
			onClose={() => setError({ show: false })}
			show={error.show}
			title="An error occurred" />
		{/* End hero unit */}
	</Page>;
}
