
// ok, lets try to get it running in the browser

 var React = require('react');
// import { createClass } from 'react';

import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider, connect } from "react-redux";
import { Button, Alert, Table } from 'react-bootstrap';
import 'whatwg-fetch';

// require('es6-promise').polyfill();
// fetch(...);


function reducer(state, action) {
  switch (action.type) {
    case 'INITIAL_STATE':
      // load initial state in an action, to allow including dispatch() binding in initial state
      return action.state;

    case 'GOT_RP_ITEMS':
      return Object.assign({}, state, { items : action.items });

    default:
      return state;
  }
}


let store = applyMiddleware(thunk)(createStore)(reducer);

let initialState = ({
  dispatch: (a) => store.dispatch(a),
  items: []
});



function getData(dispatch) {
  var query = `
      select
        -- *
        rp.id as rp_id,
        p.name as person_name,
        o.name as organisation_name ,
        p.id as person_id
      from responsible_party rp
      join person p on p.id = rp.person_id
      join organisation o on o.id = rp.organisation_id
      order by rp.id
  `
  fetch('http://127.0.0.1:8081/myendpoint?query=' + encodeURIComponent(query ))
    .then((response) => response.json())
    .then((json) => {
      console.log(json );
      dispatch({ type: 'GOT_RP_ITEMS', items : json });
    })
    .catch((error) => {
      console.warn(error);
    });
}




const Form2 = React.createClass({

  render() {
    var dispatch = this.props.dispatch;
    return (
      <div>
        Form 2
      </div>
    )
    }
})



const Form1 = React.createClass({

  componentDidMount() {
    console.log('component did mount');
  },

  render() {

    var dispatch = this.props.dispatch;

    var firstRowKeys = this.props.items.length > 0 ? Object.keys(this.props.items[0]) : [];
    var rowHeaders = firstRowKeys.map( function( key, i) {
        return (
          <th key={i}>{ key} </th>
        );
      });

    var rows = this.props.items.map( (item, i) => {

      // ok, we don't want the keys except for thead.
      var keys = Object.keys(item);
      var values = keys.map(function(k) { return item[k]; });
      var valueNodes = values.map( (value, i) => {
        return (
          <td key={i} >{ value} </td>
        );
      });

      return (
        <tr key={i}>
          { valueNodes }
        </tr>
      );
    });

    return (
      <div>
        <Table striped bordered condensed hover>
            <thead>
              <tr>
                { rowHeaders }
              </tr>
            </thead>
            <tbody>
              { rows }
            </tbody>
        </Table>
        <div>
          <Button bsStyle="success" bsSize="medium" onClick={ () => dispatch( getData ) } >Async Save</Button>
        </div>
      </div>
    )
    }
});

// change name to view...
const Page = React.createClass({

  render() {

    return (
      <div>
        { <Form2 dispatch={this.props.dispatch}  items={this.props.items}  /> }
        { <Form1 dispatch={this.props.dispatch}  items={this.props.items}  /> }
      </div>
    )
    }
});


// seems to be an issue with the render ... items... 

store.dispatch({ type: 'INITIAL_STATE', state: initialState });
store.dispatch( getData );

var App = connect(
  state => state
)(Page);


React.render((
  <Provider store={store}>
     {() => <App />}
  </Provider>
), document.body)


