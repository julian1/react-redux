
// ok, lets try to get it running in the browser

 var React = require('react');
// import { createClass } from 'react';

import { createStore } from 'redux';
import { Provider, connect } from "react-redux";


import { Button, Alert } from 'react-bootstrap';


// function counter(state = 0, action) {
function counter(state, action) {
  switch (action.type) {
  case 'INCREMENT':
    return Object.assign({}, state, {
      value: state.value + 1
    });
  case 'RESET':
    return Object.assign({}, state, {
      value: 0
    });
  default:
    return state;
  }
}

var store = createStore(counter, (
  { value: 0 ,
    inputHandler : (a => console.log("my handler " + a))
  }) );


store.subscribe( function() {
    // console.log(store.getState())
  }
);

// jquery async ? time
// this doSomething function can be put on the state

function doSomething(){
  store.dispatch({ type: 'INCREMENT' });
  // alert("Boom!");
  setTimeout(doSomething, 1000);
}

doSomething();

store.dispatch({ type: 'INCREMENT' });
store.dispatch({ type: 'INCREMENT' });
store.dispatch({ type: 'DECREMENT' });
store.dispatch({ type: 'WHOOT' });

// ok, redux is neat.
// ok, lets try to fatten the model up. 
// should try to upgrade to react 0.14, which has support for refs  

// <input onChange={ a => this.props.inputHandler a console.log( 'whoot ' + a.target.value ) } />  
//  <Button bsStyle="primary" bsSize="medium">Medium button</Button>

//           <h2>{this.props.value || "Welcome to your Inbox"}</h2>
/*
  where do the action creators go? 
    in the react component 
    on the store?? (can be dynamic)
    file scope

    or even this.props.dispatch, no because we'd have to pass it down in everything...

*/

const Inbox = React.createClass({
  render() {
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
        </div>
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
  //mapStateToProps
  // (state) => ({ value: state })
  state => state
)(Inbox);



React.render((
  <Provider store={store}>
     {() => <App />}
  </Provider>
), document.body)



