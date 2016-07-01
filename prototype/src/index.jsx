import React from 'react';
import ReactDOM from 'react-dom';

import Layout from './components/layout';
import Map from './components/map';

const App = ({store}) => (
  <Layout>
    <Map />
  </Layout>
);

// render app
ReactDOM.render(<App />, document.getElementById('app'));
