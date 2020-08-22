import React from 'react';
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import HomePage from './components/routes/HomePage';
import EventsPage from './components/routes/EventsPage';
import ChatPage from './components/routes/ChatPage';
import NetworkingPage from './components/routes/NetworkingPage';
import Header from './components/Header';
import FriendsPage from './components/routes/FriendsPage';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Header />
        <Switch>
          <Route path='/' exact component={HomePage} />
          <Route path='/events' component={EventsPage} />
          <Route path='/chat' component={ChatPage} />
          <Route path='/friends' component={FriendsPage} />
          <Route path='/networking' component={NetworkingPage} />

          <Redirect to='/' />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
