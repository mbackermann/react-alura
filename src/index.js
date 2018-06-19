import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {BrowserRouter as Router,Route,Switch,Link} from 'react-router-dom';
import App from './App';
import Autor from './Autor';
import Home from './Home';
import Livro from './Livro';

import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  (
    <Router>
      <App>
        <Switch>
          <Route exact path ="/" component={Home} />
          <Route path ="/autor" component={Autor} />
          <Route path ="/livro" component={Livro}/>
        </Switch>
      </App>
    </Router>
  ),
  document.getElementById('root')
  );
registerServiceWorker();
