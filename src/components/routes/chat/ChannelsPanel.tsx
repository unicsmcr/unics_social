import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import grey from '@material-ui/core/colors/grey';
import ChannelListItem from './ChannelListItem';
import { useSelector, useDispatch } from 'react-redux';
import { selectChannels } from '../../../store/slices/ChannelsSlice';
import { APIDMChannel, APIEventChannel } from '@unicsmcr/unics_social_api_client';
import { fetchUser, selectMe } from '../../../store/slices/UsersSlice';

const dummyUsers = [
	{ name: 'Barack Obama', src: 'https://www.biography.com/.image/t_share/MTE4MDAzNDEwNzg5ODI4MTEw/barack-obama-12782369-1-402.jpg' },
	{ name: 'Mario', src: 'https://sickr.files.wordpress.com/2017/07/mario.jpg' },
	{ name: 'Luigi', src: 'https://www.mariowiki.com/images/thumb/5/53/Luigi_Mario_Party.png/158px-Luigi_Mario_Party.png' }
];

const dummyEvents = [
	{ name: 'Freshers Fair!', src: 'https://static-s.aa-cdn.net/img/ios/1389829402/87e2ba20dce5005d8f856ebbea851ff5?v=1' },
	{ name: 'Virtual Pub Quiz', src: 'https://cdn-b.william-reed.com/var/wrbm_gb_hospitality/storage/images/publications/hospitality/morningadvertiser.co.uk/article/2020/06/24/how-do-pubs-keep-customer-data/3487206-1-eng-GB/How-do-pubs-keep-customer-data_wrbm_large.jpg' }
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
		[theme.breakpoints.down('xs')]: {
			height: theme.spacing(7)
		}
	},
	appBar: {
		background: grey[800]
	}
}));

interface ChannelsPanelProps {
	onChannelSelected: (channel: { name: string; avatar: string }) => void;
	open: boolean;
	onClose: Function;
}

export default function ChannelsPanel({ onChannelSelected }: ChannelsPanelProps) {
	const classes = useStyles();
	const dispatch = useDispatch();
	const [chatPanelValue, setChatPanelValue] = React.useState(0);
	const me = useSelector(selectMe);

	const channels = Object.values(useSelector(selectChannels)).sort((a, b) => new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime());

	const eventChannels: APIEventChannel[] = [];
	const dmChannels: APIDMChannel[] = [];

	for (const channel of channels) {
		if (channel.type === 'dm') {
			dmChannels.push(channel);
			channel.users.filter(userID => userID !== me!.id).forEach(userID => dispatch(fetchUser(userID)));
			// dispatch(fetchUser(channel.users));
		} else {
			eventChannels.push(channel);
		}
	}

	const channelList = chatPanelValue === 0 ? dummyUsers : dummyEvents;

	return <Box className={classes.root}>
		<div className={classes.channelsPanel}>
			<AppBar position="static" className={classes.appBar}>
				<Tabs variant="fullWidth" value={chatPanelValue} onChange={(_, v) => setChatPanelValue(v)} indicatorColor="secondary" textColor="inherit">
					<Tab label="Users" className={classes.tab}/>
					<Tab label="Events" className={classes.tab} />
				</Tabs>
			</AppBar>
			<List component="nav" aria-label="channels" className={classes.channelsList} >
				{channelList.map((channel, index) => (
					<div key={channel.name}>
						{
							index !== 0 && <Divider />
						}
						<ChannelListItem key={index} {...channel} onClick={() => onChannelSelected({
							name: channel.name,
							avatar: channel.src
						})} />
					</div>
				))}
			</List>
		</div>
	</Box>;
}
