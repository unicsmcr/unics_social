import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import { Paper, AppBar, Tabs, Tab } from '@material-ui/core';
import ChannelListItem from './ChannelListItem';

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

const useStyles = makeStyles(theme => ({
	channelsPanel: {
		width: theme.spacing(40)
	},
	channelsList: {
		minHeight: '80vh',
		maxHeight: '80vh',
		overflow: 'auto'
	}
}));

interface ChannelsPanelProps {
	onChannelSelected: (channel: string) => void;
}

export default function ChannelsPanel({ onChannelSelected }: ChannelsPanelProps) {
	const classes = useStyles();

	const [chatPanelValue, setChatPanelValue] = React.useState(0);

	const channelList = chatPanelValue === 0 ? dummyUsers : dummyEvents;

	return <Paper elevation={2}>
		<div className={classes.channelsPanel}>
			<AppBar position="static" color="primary">
				<Tabs variant="fullWidth" value={chatPanelValue} onChange={(_, v) => setChatPanelValue(v)} indicatorColor="secondary" textColor="inherit">
					<Tab label="Users" />
					<Tab label="Events" />
				</Tabs>
			</AppBar>
			<List component="nav" aria-label="channels" className={classes.channelsList} >
				{channelList.map((channel, index) => <ChannelListItem key={index} {...channel} onClick={() => onChannelSelected(channel.name)} />)}
			</List>
		</div>
	</Paper>;
}
