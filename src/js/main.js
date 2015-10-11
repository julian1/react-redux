
// ok, lets try to get it running in the browser

 var React = require('react');
// import { createClass } from 'react';

import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider, connect } from "react-redux";

import { Button, Alert } from 'react-bootstrap';
// import { fetch, then } from 'whatwg-fetch';
import 'whatwg-fetch';

// require('es6-promise').polyfill();
// fetch(...);


// function counter(state = 0, action) {
function counter(state, action) {
  switch (action.type) {

    case 'INITIAL_STATE':
      // we load initial state on an action, so we include dispatch() in state 
      return action.state;

    case 'INCREMENT':
      return Object.assign({}, state, {
        value: state.value + 1
      });
    case 'RESET':
      return Object.assign({}, state, {
        value: 0
      });
    case 'WHOOT':
      console.log( action.children);
      return Object.assign({}, state, {
        children: action.children
      });

      return state;


    default:
      return state;
  }
}


// let store = applyMiddleware(thunk)(createStore)(counter, initialState);
let store = applyMiddleware(thunk)(createStore)(counter);


let initialState = ({ 
  dispatch: (a) => store.dispatch(a),
  value: 0, // change name counter...
  inputHandler : (a) => console.log("my handler " + a),
  children: []
});



function doSomething( dispatch ){
  dispatch({ type: 'INCREMENT' });
  setTimeout( () => dispatch(doSomething), 1000);            // this just sides inside the redux forever...
}


store.dispatch({ type: 'INITIAL_STATE', state: initialState });  // might be easier...
store.dispatch({ type: 'DECREMENT' });

// initial...
store.dispatch( doSomething );

// should i be using store.dispatch() or have a globalish function dispatch() ?
// ok, redux is neat.
// ok, lets try to fatten the model up. 
// should try to upgrade to react 0.14, which has support for refs  

// IMPORTANT - we should pass dispatch explicity down as a prop - and avoid doing it for dumb-components. 

// note that react-bootstrap is not an inline style approch.
// inline styles with javascript attributes are supported in react. could just use this.

// actually we want to put it on the props...

function asyncAction(dispatch) {
  // important we get dispatch given to us...
  // console.log("we got dispatch " + dispatch );
  
  fetch('https://www.reddit.com/r/worldnews.json')
    .then((response) => response.json())
    .then((json) => {
      console.log(json.data.children[0].data.author);

      dispatch({ type: 'WHOOT', children: json.data.children });
      // store.dispatch({ type: 'RESET' })
    })
    .catch((error) => {
      console.warn(error);
    });
}


const Inbox = React.createClass({
  render() {

   var commentNodes = this.props.children.map( (comment, i) => {
      return (
        <div key={i}>
          <span>{comment.data.title }</span>
          <span> - </span>
          <span>{comment.data.author}</span> 
        </div>
      );
    });

    return (
      <div>
        <div>
          <h2>Inbox</h2>
          <h2>{this.props.value}</h2>
        </div>
        <div>
          <input onChange={ e => this.props.inputHandler(e.target.value) } />  
        </div>
        <div>
          <Button bsStyle="success" bsSize="medium" onClick={ () => store.dispatch({ type: 'RESET' }) } >Save</Button>
          <Button bsStyle="success" bsSize="medium" onClick={ () => store.dispatch( asyncAction ) } >Async Save</Button>
        </div>

        <div>{ commentNodes }</div>

      </div>
    )   
  }
})



/*function mapStateToProps(state)  {
  return {
    value: state
  };
}*/

// need an identity function...

var App = connect(
  state => state
)(Inbox);


React.render((
  <Provider store={store}>
     {() => <App />}
  </Provider>
), document.body)

// store.subscribe( () => console.log(store.getState()) );


// jquery async ? time
// this doSomething function can be put on the state

// should make this dispatchable...

