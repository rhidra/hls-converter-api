import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './pages/home/Home';
import UploadTrack from './pages/upload-track/UploadTrack';

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/status/:filename/:uploadId">
          <UploadTrack/>
        </Route>

        <Route path="/">
          <Home/>
        </Route>
      </Switch>
    </Router>
  );
}
