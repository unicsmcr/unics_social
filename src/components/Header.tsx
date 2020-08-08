import * as React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    return <div>
        <Link to='/'>Home </Link>
        <Link to='/events'>Events </Link>
        <Link to='/friends'>Friends </Link>
        <Link to='/networking'>Networking</Link>
    </div>
}

export default Header;