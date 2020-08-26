import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Footer from './components/Footer';
import useStyles from './components/util/useStyles';

export default function Homepage() {
  const classes = useStyles();

  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar position="static" color="default" elevation={0} className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <Typography variant="h6" color="textPrimary" noWrap className={classes.toolbarTitle}>
            UniCS KB
          </Typography>
          <nav>
            <Button color="inherit">About</Button>
            <Button color="inherit">Register</Button>
          </nav>
          <Button href="#" color="primary" variant="outlined" className={classes.link}>
            Login
          </Button>
        </Toolbar>
      </AppBar>
      {/* Hero unit */}
      <Container maxWidth="sm" component="main" className={classes.heroContent}>
        <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
          UniCS KB
        </Typography>
        <Typography variant="h5" align="center" color="textSecondary" component="p">
          We're helping to connect University of Manchester students with each other online in light of the COVID-19 pandemic!
        </Typography>
      </Container>
      {/* End hero unit */}
      <Container maxWidth="md" component="main">

      </Container>
      <Footer />
    </React.Fragment>
  );
}
