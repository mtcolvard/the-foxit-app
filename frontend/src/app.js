import React from 'react'
import ReactDOM from 'react-dom'
import {HashRouter, Route, Switch} from 'react-router-dom'

import './scss/style.scss'
import Map from './components/Map'
import DropDownDisplay from './components/DropDownDisplay'

class App extends React.Component {
  render () {
    return(
      <HashRouter>
        <Switch>
          <Route path="/" component={Map} />
        </Switch>
      </HashRouter>
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
)
