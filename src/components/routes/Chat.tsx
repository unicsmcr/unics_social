import React from 'react';

import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import Page from '../Page';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { Paper, AppBar, Tabs, Tab, Avatar, ListItemAvatar } from '@material-ui/core';

const dummyUsers = [
	{ name: 'Barack Obama', src: 'https://www.biography.com/.image/t_share/MTE4MDAzNDEwNzg5ODI4MTEw/barack-obama-12782369-1-402.jpg' },
	{ name: 'Azealia Banks', src: 'https://lh3.googleusercontent.com/proxy/4gdPHEtUwkjRLpp08zdJbTPE2Bh8XOwJY_rPpoSl43aqrvMHFdoaIBhq3BYpC4Na6mjbqFB1Zop_1rL6RCi2tcoI7FtLK4vRdb0MKu1Ia9FSPdWI3oohcmoUwm8' },
	{ name: 'Mario', src: 'https://sickr.files.wordpress.com/2017/07/mario.jpg' },
	{ name: 'Luigi', src: 'https://www.mariowiki.com/images/thumb/5/53/Luigi_Mario_Party.png/158px-Luigi_Mario_Party.png' }
];

const useStyles = makeStyles(theme => ({
	mainContent: {
		padding: theme.spacing(6, 2, 14, 2),
		textAlign: 'center'
	},
	chatsRoot: {
		display: 'flex'
	},
	channelsPanel: {
		width: theme.spacing(40)
	},
	channelsList: {
		minHeight: '80vh',
		maxHeight: '80vh',
		overflow: 'auto'
	},
	flexGrow: {
		flexGrow: 1
	}
}));

function UserListItem({ name, src }: {name: string; src: string}) {
	return <ListItem button>
		<ListItemAvatar>
			<Avatar alt={name} src={src}/>
		</ListItemAvatar>
		<ListItemText primary={name} />
	</ListItem>;
}

export function ChannelsPanel() {
	const classes = useStyles();

	const [chatPanelValue, setChatPanelValue] = React.useState(0);

	return <Paper elevation={2}>
		<div className={classes.channelsPanel}>
			<AppBar position="static" color="primary">
				<Tabs variant="fullWidth" value={chatPanelValue} onChange={(_, v) => setChatPanelValue(v)} indicatorColor="secondary" textColor="inherit">
					<Tab label="Users" />
					<Tab label="Events" />
				</Tabs>
			</AppBar>
			<List component="nav" aria-label="main mailbox folders" className={classes.channelsList} >
				{dummyUsers.map(user => <UserListItem {...user} />)}
			</List>
		</div>
	</Paper>;
}

export default function ChatPage() {
	const classes = useStyles();

	return (
		<Page>
			<Container maxWidth="xl" component="main" className={classes.mainContent}>
				<Paper elevation={3} className={classes.chatsRoot}>
					<ChannelsPanel />
					<div className={classes.flexGrow}>
						<Typography>hi</Typography>
					</div>
				</Paper>
			</Container>
		</Page>
	);
}
