import { Avatar, Button, Fab, IconButton, Paper, Typography } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import { APIDMChannel, APIUser } from '@unicsmcr/unics_social_api_client';
import React, { useLayoutEffect, useState } from 'react';
import getIcon from '../../util/getAvatar';
import InstagramIcon from '@material-ui/icons/Instagram';
import FacebookIcon from '@material-ui/icons/Facebook';
import TwitterIcon from '@material-ui/icons/Twitter';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import VideocamOutlinedIcon from '@material-ui/icons/VideocamOutlined';
import { useSelector } from 'react-redux';
import { selectMe } from '../../../store/slices/UsersSlice';
import { useHistory } from 'react-router-dom';
import pickQuestions from '../../util/SampleQuestions';
import { grey } from '@material-ui/core/colors';
import { ReportModal } from './ReportModal';

const useStyles = makeStyles(theme => ({
	root: {
		padding: theme.spacing(2),
		display: 'flex',
		alignItems: 'center',
		flexDirection: 'column',
		height: '100%',
		width: '100%',
		background: grey[200],
		overflow: 'auto'
	},
	avatar: {
		width: theme.spacing(18),
		height: theme.spacing(18),
		margin: theme.spacing(4, 0)
	},
	videoBox: {
		margin: theme.spacing(1, 0, 4, 0)
	},
	sampleQuestions: {
		'width': '100%',
		'margin': theme.spacing(2, 0),
		'padding': theme.spacing(1),
		'textAlign': 'left',
		'& ul': {
			paddingLeft: theme.spacing(3)
		},
		'& li': {
			padding: theme.spacing(1, 0, 0, 1)
		}
	},
	questionsTitle: {
		textAlign: 'center',
		display: 'block',
		paddingTop: theme.spacing(1)
	}
}));

interface UserInfoPanelProps {
	channel: APIDMChannel;
	user: APIUser;
	onClose: Function;
}

type SocialMedia = 'instagram' | 'facebook' | 'twitter' | 'linkedin';

function getSocialMediaIcon(type: SocialMedia) {
	switch (type) {
		case 'facebook':
			return FacebookIcon;
		case 'instagram':
			return InstagramIcon;
		case 'twitter':
			return TwitterIcon;
		case 'linkedin':
			return LinkedInIcon;
	}
}

function formatURL(handle: string, type: SocialMedia): string {
	switch (type) {
		case 'facebook':
			return `https://www.facebook.com/${handle}`;
		case 'instagram':
			return `https://www.instagram.com/${handle}`;
		case 'twitter':
			return `https://twitter.com/${handle}`;
		case 'linkedin':
			return `https://linkedin.com/in/${handle}`;
	}
}

export function SocialMediaIcon({ handle, type }: { handle: string; type: SocialMedia }) {
	const Icon = getSocialMediaIcon(type);
	return <a href={formatURL(handle, type)} rel="noopener noreferrer" target="_blank"><IconButton>
		<Icon />
	</IconButton></a>;
}

export default function UserInfoPanel({ user, channel, onClose }: UserInfoPanelProps) {
	const classes = useStyles();
	const history = useHistory();

	const [questions, setQuestions] = useState<string[]>([]);
	const [reportOpen, setReportOpen] = useState<boolean>(false);

	useLayoutEffect(() => {
		setQuestions(pickQuestions(3));
	}, [user.id]);

	const me = useSelector(selectMe);

	const renderSocialMedia = () => {
		if (!user.profile) return undefined;
		const output: JSX.Element[] = [];
		if (user.profile.facebook) output.push(<SocialMediaIcon type="facebook" handle={user.profile.facebook} key="facebook" />);
		if (user.profile.instagram) output.push(<SocialMediaIcon type="instagram" handle={user.profile.instagram} key="instagram" />);
		if (user.profile.twitter) output.push(<SocialMediaIcon type="twitter" handle={user.profile.twitter} key="twitter" />);
		if (user.profile.linkedin) output.push(<SocialMediaIcon type="linkedin" handle={user.profile.linkedin} key="linkedin" />);
		return output;
	};

	const hasVideo = () => {
		if (!me) return false;
		if (!channel.video) return false;
		const now = Date.now();
		if (!channel.video.users) return false;
		if (now < new Date(channel.video.creationTime).getTime() || now > new Date(channel.video.endTime).getTime()) {
			return false;
		}
		const details = channel.video.users.find(user => user.id === me.id);
		return Boolean(details?.accessToken);
	};

	return <Box className={classes.root}>
		<Avatar className={classes.avatar} src={getIcon(user)} />
		<Typography variant="subtitle1" gutterBottom>
			{user.forename} {user.surname}
		</Typography>
		{
			hasVideo() && <Box className={classes.videoBox}>
				<Fab color="primary" onClick={() => {
					onClose();
					history.push(`${history.location.pathname.replace(/\/video/g, '')}/video`);
				}}>
					<VideocamOutlinedIcon />
				</Fab>
			</Box>
		}
		<Box>
			{
				renderSocialMedia()
			}
		</Box>
		{
			user.profile && <>
				<Typography variant="subtitle2">
					{user.profile.course}
				</Typography>
				<Typography variant="subtitle2" gutterBottom>
					{user.profile.yearOfStudy}
				</Typography>
			</>
		}
		<Paper elevation={1} className={classes.sampleQuestions}>
			<Typography variant="overline" align="center" className={classes.questionsTitle}>
			Questions to ask
			</Typography>
			<ul>
				{
					questions.map(question => (
						<li key={question}><Typography gutterBottom>
							{question}
						</Typography></li>))
				}
			</ul>
		</Paper>

		<ReportModal open={reportOpen} onClose={() => setReportOpen(false)} againstUser={user} />

		<Button variant="outlined" onClick={() => setReportOpen(true)}>
				Report User
		</Button>
	</Box>;
}
