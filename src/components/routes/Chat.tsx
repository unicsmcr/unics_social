import React from 'react';

import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Page from '../Page';
import List from '@material-ui/core/List';
import ListItem, { ListItemProps } from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import InboxIcon from '@material-ui/icons/Inbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import { Paper, AppBar, Tabs, Tab } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
	mainContent: {
		padding: theme.spacing(6, 2, 14, 2),
		textAlign: 'center'
	},
	chatsRoot: {
		height: '80vh',
		display: 'flex'
	},
	channelsList: {
		width: theme.spacing(40)
	},
	flexGrow: {
		flexGrow: 1
	}
}));

function ListItemLink(props: ListItemProps<'a', { button?: true }>) {
	return <ListItem button component="a" {...props} />;
}

export default function ChatPage() {
	const classes = useStyles();

	const [chatPanelValue, setChatPanelValue] = React.useState(0);

	const chatsPanel = <Paper elevation={2}>
		<div className={classes.channelsList}>
			<AppBar position="static" color="primary">
				<Tabs variant="fullWidth" value={chatPanelValue} onChange={(_, v) => setChatPanelValue(v)} indicatorColor="secondary" textColor="inherit">
					<Tab label="Users" />
					<Tab label="Events" />
				</Tabs>
			</AppBar>
			<List component="nav" aria-label="main mailbox folders">
				<ListItem button>
					<ListItemIcon>
						<InboxIcon />
					</ListItemIcon>
					<ListItemText primary="Inbox" />
				</ListItem>
				<ListItem button>
					<ListItemIcon>
						<DraftsIcon />
					</ListItemIcon>
					<ListItemText primary="Drafts" />
				</ListItem>
			</List>
			<Divider />
			<List component="nav" aria-label="secondary mailbox folders">
				<ListItem button>
					<ListItemText primary="Trash" />
				</ListItem>
				<ListItemLink href="#simple-list">
					<ListItemText primary="Spam" />
				</ListItemLink>
			</List>
		</div>
	</Paper>;

	return (
		<Page>
			<Container maxWidth="xl" component="main" className={classes.mainContent}>
				<Paper elevation={3} className={classes.chatsRoot}>
					{ chatsPanel }
					<div className={classes.flexGrow}>
						<Typography>hi</Typography>
					</div>
				</Paper>
			</Container>
		</Page>
	);
}
