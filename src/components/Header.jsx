import * as React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { signIn, signOut } from '../actions'; // FOR TESTING

const Header = (props) => {
    console.log(props.auth);
    const { auth, SignIn, SignOut } = props;
    return <div>
        <Link to='/'>Home </Link>
        <Link to='/events'>Events </Link>
        <Link to='/friends'>Friends </Link>
        <Link to='/networking'>Networking</Link>
        <button onClick={() => { auth.isSignedIn ? SignOut() : SignIn() }}>
            {auth.isSignedIn.toString()}
        </button>

    </div>
}

const mapStateToProps = (state) => {
    return {
        auth: state.auth
    }
};

export default connect(mapStateToProps, { SignIn: signIn, SignOut: signOut })(Header);
