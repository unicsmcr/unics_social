import { Avatar, Fab, IconButton, Typography } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import { APIDMChannel, APIUser } from '@unicsmcr/unics_social_api_client';
import React from 'react';
import getIcon from '../../util/getAvatar';
import InstagramIcon from '@material-ui/icons/Instagram';
import FacebookIcon from '@material-ui/icons/Facebook';
import TwitterIcon from '@material-ui/icons/Twitter';
import VideocamOutlinedIcon from '@material-ui/icons/VideocamOutlined';
import { useSelector } from 'react-redux';
import { selectMe } from '../../../store/slices/UsersSlice';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
	root: {
		padding: theme.spacing(2),
		display: 'flex',
		alignItems: 'center',
		flexDirection: 'column',
		height: '100%',
		width: '100%'
	},
	avatar: {
		width: theme.spacing(18),
		height: theme.spacing(18),
		margin: theme.spacing(4, 0)
	},
	videoBox: {
		margin: theme.spacing(1, 0, 4, 0)
	}
}));

interface UserInfoPanelProps {
	channel: APIDMChannel;
	user: APIUser;
}

function getSocialMediaIcon(type: 'instagram' | 'facebook' | 'twitter') {
	switch (type) {
		case 'facebook':
			return FacebookIcon;
		case 'instagram':
			return InstagramIcon;
		case 'twitter':
			return TwitterIcon;
	}
}

function formatURL(handle: string, type: 'instagram' | 'facebook' | 'twitter'): string {
	switch (type) {
		case 'facebook':
			return `https://www.facebook.com/${handle}`;
		case 'instagram':
			return `https://www.instagram.com/${handle}`;
		case 'twitter':
			return `https://twitter.com/${handle}`;
	}
}

export function SocialMediaIcon({ handle, type }: { handle: string; type: 'instagram' | 'facebook' | 'twitter' }) {
	const Icon = getSocialMediaIcon(type);
	return <a href={formatURL(handle, type)} rel="noopener noreferrer" target="_blank"><IconButton>
		<Icon />
	</IconButton></a>;
}

export default function UserInfoPanel({ user, channel }: UserInfoPanelProps) {
	const classes = useStyles();
	const history = useHistory();

	const me = useSelector(selectMe);

	const renderSocialMedia = () => {
		if (!user.profile) return undefined;
		const output: JSX.Element[] = [];
		if (user.profile.facebook) output.push(<SocialMediaIcon type="facebook" handle={user.profile.facebook} />);
		if (user.profile.instagram) output.push(<SocialMediaIcon type="instagram" handle={user.profile.instagram} />);
		if (user.profile.twitter) output.push(<SocialMediaIcon type="twitter" handle={user.profile.twitter} />);
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
				<Typography variant="subtitle2">
					{user.profile.yearOfStudy}
				</Typography>
			</>
		}
	</Box>;
}
