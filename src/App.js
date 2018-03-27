import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Layout } from 'antd';
import './App.css';

import HomePage from './pages/HomePage';
import DiseasePage from './pages/DiseasePage';
import GenePage from './pages/GenePage';
import VariantPage from './pages/VariantPage';
import LocusPage from './pages/LocusPage';
import Footer from './Footer';
import Banner from './Banner';

class App extends React.Component {
  render() {
    return (
      <Router>
        <Layout>
          <Switch>
            <Route exact path="/" component={null} />
            <Route path="/*" component={Banner} />
          </Switch>

          <Layout.Content
            style={{
              background: '#ECECEC',
              minHeight: 'calc(100vh - 106px - 40px)',
            }}
          >
            <Route exact path="/" component={HomePage} />
            <Route path="/disease/:efoId" component={DiseasePage} />
            <Route path="/gene/:geneId" component={GenePage} />
            <Route path="/variant/:variantId" component={VariantPage} />
            <Route path="/locus" component={LocusPage} />
          </Layout.Content>

          <Switch>
            <Route exact path="/" component={null} />
            <Route path="/*" component={Footer} />
          </Switch>
        </Layout>
      </Router>
    );
  }
}

export default App;
