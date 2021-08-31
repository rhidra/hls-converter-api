import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Layout from './layouts/Layout';
import Home from './pages/home/Home';
import UploadTracker from './pages/upload-tracker/UploadTracker';

export default function App() {
  return (
      <Layout>
    <Router>
      <Switch>
        <Route path="/status/:filename/:uploadId">
          <UploadTracker/>
        </Route>

        <Route path="/">
          <Home/>
        </Route>
      </Switch>
    </Router>
      </Layout>
  );
}
