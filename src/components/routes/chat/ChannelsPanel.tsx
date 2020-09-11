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
import DMListItem from './DMListItem';

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
	onChannelSelected: (channel: { id: string }) => void;
	open: boolean;
	onClose: Function;
}

export default function ChannelsPanel({ onChannelSelected }: ChannelsPanelProps) {
	const classes = useStyles();
	const [chatPanelValue, setChatPanelValue] = React.useState(0);

	const channels = Object.values(useSelector(selectChannels)).sort((a, b) => new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime());

	const eventChannels: APIEventChannel[] = [];
	const dmChannels: APIDMChannel[] = [];

	for (const channel of channels) {
		if (channel.type === 'dm') {
			dmChannels.push(channel);
		} else {
			eventChannels.push(channel);
		}
	}

	const generateList = () => {
		if (chatPanelValue === 0) {
			return dmChannels.map((channel, index) => (
				<div key={channel.id}>
					{
						index !== 0 && <Divider />
					}
					<DMListItem key={channel.id} onClick={console.log} channel={channel} />
				</div>
			));
		}
		return <h2>nope</h2>;
	};

	return <Box className={classes.root}>
		<div className={classes.channelsPanel}>
			<AppBar position="static" className={classes.appBar}>
				<Tabs variant="fullWidth" value={chatPanelValue} onChange={(_, v) => setChatPanelValue(v)} indicatorColor="secondary" textColor="inherit">
					<Tab label="Users" className={classes.tab}/>
					<Tab label="Events" className={classes.tab} />
				</Tabs>
			</AppBar>
			<List component="nav" aria-label="channels" className={classes.channelsList} >
				{
					generateList()
				}
			</List>
		</div>
	</Box>;
}
