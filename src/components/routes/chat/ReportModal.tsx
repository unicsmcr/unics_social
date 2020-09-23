import { Box, Button, CircularProgress, Dialog, DialogContent, DialogContentText, DialogTitle, makeStyles, TextField } from '@material-ui/core';
import { APIUser } from '@unicsmcr/unics_social_api_client';
import React, { useEffect, useRef, useState } from 'react';
import asAPIError from '../../util/asAPIError';
import { client } from '../../util/makeClient';

interface ReportModalProps {
	open: boolean;
	onClose: () => void;
	againstUser: APIUser;
}

const useStyles = makeStyles(theme => ({
	textField: {
		width: '100%',
		margin: theme.spacing(1, 0)
	},
	buttonBox: {
		textAlign: 'right',
		margin: theme.spacing(1, 0)
	},
	centered: {
		textAlign: 'center'
	}
}));

enum ReportState {
	Waiting,
	Reporting,
	Finished
}

export function ReportModal(props: ReportModalProps) {
	const classes = useStyles();

	const [state, setState] = useState<{
		state: ReportState;
		message?: string;
	}>({ state: ReportState.Waiting });

	const textfieldRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		setState({ state: ReportState.Waiting });
	}, [props.againstUser.id]);

	const generateBody = () => {
		switch (state.state) {
			case ReportState.Waiting:
				return <>
					<DialogContentText>
				Please tell us why you'd like to report {props.againstUser.forename}. We'll review your report ourselves, and if we deem that it's necessary, we'll also forward the report on to the Student Support Office (SSO) for further action.
					</DialogContentText>
					<TextField
						label="Report"
						multiline
						rows={4}
						variant="outlined"
						className={classes.textField}
						ref={textfieldRef}/>
					<Box className={classes.buttonBox}>
						<Button variant="contained" color="primary" onClick={() => {
							if (!textfieldRef.current) return;
							const textarea = textfieldRef.current.querySelector('textarea');
							if (!textarea) return;
							const description = textarea.value.trim();
							setState({ state: ReportState.Reporting });
							setTimeout(() => {
								client.reportUser({
									description,
									reportedUserID: props.againstUser.id
								})
									.then(() => {
										setState({
											state: ReportState.Finished,
											message: 'Your report has been submitted. We will try to review it as soon as possible.'
										});
									})
									.catch(err => {
										console.error(err);
										const message = asAPIError(err) ?? 'An unknown error occurred trying to submit the report. Please try again later.';
										setState({
											state: ReportState.Finished,
											message
										});
									});
							}, 1e3);
						}}>Submit Report</Button>
					</Box>
				</>;
			case ReportState.Reporting:
				return <Box className={classes.centered}>
					<DialogContentText>
						Submitting report...
					</DialogContentText>
					<CircularProgress />
				</Box>;
			case ReportState.Finished:
				return <>
					<DialogContentText>
						{state.message}
					</DialogContentText>
					<Box className={classes.buttonBox}>
						<Button variant="contained" color="primary" onClick={(() => {
							props.onClose();
							setTimeout(() => setState({ state: ReportState.Waiting }), 250);
						})}>Close</Button>
					</Box>
				</>;
		}
	};

	return <Dialog open={props.open} onClose={props.onClose}>
		<DialogTitle>Report {props.againstUser.forename}</DialogTitle>
		<DialogContent>
			{ generateBody() }
		</DialogContent>
	</Dialog>;
}
