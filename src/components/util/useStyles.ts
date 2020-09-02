import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
	'@global': {
		ul: {
			margin: 0,
			padding: 0,
			listStyle: 'none'
		}
	},
	'appBar': {
		borderBottom: `1px solid ${theme.palette.divider}`
	},
	'toolbar': {
		flexWrap: 'wrap'
	},
	'toolbarTitle': {
		flexGrow: 1
	},
	'link': {
		margin: theme.spacing(1, 1.5)
	},
	'heroContent': {
		padding: theme.spacing(28, 2, 28, 2)
	},
	'paddedCaption': {
		padding: theme.spacing(2, 0, 2, 0)
	},
	'eventContainer': {
		display: 'flex', justifyContent: 'center'
	},
	'eventPaper': {
		height: '98vh', width: '70vh', alignSelf: 'center', overflow: 'auto'
	},
	'iconMargin': {
		margin: theme.spacing(0, 1, 0, 0)
	},
	'eventInnerContainer': {
		margin: theme.spacing(2, 0),
		display: 'flex',
		flexDirection: 'column'
	},
	'eventButton': {
		alignSelf: 'center',
		margin: 2
	},
	'eventOptionText': {
		margin: theme.spacing(3, 0)
	},
	'eventGrid': {
		margin: theme.spacing(2, 0, 0, 0)
	},
	'footer': {
		borderTop: `1px solid ${theme.palette.divider}`,
		marginTop: theme.spacing(8),
		paddingTop: theme.spacing(3),
		paddingBottom: theme.spacing(3),
		[theme.breakpoints.up('sm')]: {
			paddingTop: theme.spacing(6),
			paddingBottom: theme.spacing(6)
		}
	}
}));

export default useStyles;
