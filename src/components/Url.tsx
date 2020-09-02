import React from 'react';
import { Link, Typography } from '@material-ui/core';
const Url = ({ link }: {link: string}) => (
	<div className="outerBox" style={{ height: 55 }}>
		<div className="innerBox">
			<Typography style={{ color: 'white' }}>
				<Link href={link} color="inherit">
					{link}
				</Link>
			</Typography>
		</div>
	</div>
);
export default Url;
