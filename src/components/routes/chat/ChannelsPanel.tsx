import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import { AppBar, Tabs, Tab, Drawer, Box } from '@material-ui/core';
import ChannelListItem from './ChannelListItem';
import clsx from 'clsx';

const dummyUsers = [
	{ name: 'Barack Obama', src: 'https://www.biography.com/.image/t_share/MTE4MDAzNDEwNzg5ODI4MTEw/barack-obama-12782369-1-402.jpg' },
	{ name: 'Azealia Banks', src: 'https://lh3.googleusercontent.com/proxy/4gdPHEtUwkjRLpp08zdJbTPE2Bh8XOwJY_rPpoSl43aqrvMHFdoaIBhq3BYpC4Na6mjbqFB1Zop_1rL6RCi2tcoI7FtLK4vRdb0MKu1Ia9FSPdWI3oohcmoUwm8' },
	{ name: 'Mario', src: 'https://sickr.files.wordpress.com/2017/07/mario.jpg' },
	{ name: 'Luigi', src: 'https://www.mariowiki.com/images/thumb/5/53/Luigi_Mario_Party.png/158px-Luigi_Mario_Party.png' }
];

const dummyEvents = [
	{ name: 'Barack Obama', src: 'https://www.biography.com/.image/t_share/MTE4MDAzNDEwNzg5ODI4MTEw/barack-obama-12782369-1-402.jpg' },
	{ name: 'Azealia Banks', src: 'https://lh3.googleusercontent.com/proxy/4gdPHEtUwkjRLpp08zdJbTPE2Bh8XOwJY_rPpoSl43aqrvMHFdoaIBhq3BYpC4Na6mjbqFB1Zop_1rL6RCi2tcoI7FtLK4vRdb0MKu1Ia9FSPdWI3oohcmoUwm8' },
	{ name: 'Mario', src: 'https://sickr.files.wordpress.com/2017/07/mario.jpg' }
];

export const DRAWER_WIDTH = '20rem';

const useStyles = makeStyles(theme => ({
	root: {
		position: 'absolute',
		left: 0,
		top: 0,
		bottom: 0
	},
	channelsPanel: {
		width: DRAWER_WIDTH
	},
	channelsList: {
		overflow: 'auto'
	},
	tab: {
		height: theme.spacing(8),
		[theme.breakpoints.down('sm')]: {
			height: theme.spacing(7)
		}
	}
}));

interface ChannelsPanelProps {
	onChannelSelected: (channel: { name: string; avatar: string }) => void;
	open: boolean;
	onClose: Function;
}

export default function ChannelsPanel({ onChannelSelected }: ChannelsPanelProps) {
	const classes = useStyles();

	const [chatPanelValue, setChatPanelValue] = React.useState(0);

	const channelList = chatPanelValue === 0 ? dummyUsers : dummyEvents;

	return <Box className={classes.root}>
		<div className={classes.channelsPanel}>
			<AppBar position="static" color="primary">
				<Tabs variant="fullWidth" value={chatPanelValue} onChange={(_, v) => setChatPanelValue(v)} indicatorColor="secondary" textColor="inherit">
					<Tab label="Users" className={classes.tab}/>
					<Tab label="Events" className={classes.tab} />
				</Tabs>
			</AppBar>
			<List component="nav" aria-label="channels" className={classes.channelsList} >
				{channelList.map((channel, index) => <ChannelListItem key={index} {...channel} onClick={() => onChannelSelected({
					name: channel.name,
					avatar: channel.src
				})} />)}
			</List>
		</div>
	</Box>;
}
