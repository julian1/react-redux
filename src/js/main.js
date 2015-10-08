
// ok, lets try to get it running in the browser

 var React = require('react');
// import { createClass } from 'react';

import { createStore } from 'redux';
import { Provider, connect } from "react-redux";




// function counter(state = 0, action) {
function counter(state, action) {
  switch (action.type) {
  case 'INCREMENT':
    // how do we perform an 'update with', like 
    return { value : state.value + 1 };
  case 'DECREMENT':
    return state ;
  default:
    return state;
  }
}


var store = createStore(counter, ({ value: 0 }) );

store.subscribe( function() {
    console.log(store.getState())
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

const Inbox = React.createClass({
  render() {
    return (
      <div>
        <h2>Inbox</h2>
        {this.props.value || "Welcome to your Inbox"}
      </div>
    )   
  }
})

// ok, lets try to fatten the model up. 


/*function mapStateToProps(state)  {
  return {
    value: state
  };
}*/


var App = connect(
  //mapStateToProps
  // (state) => ({ value: state })
  (state) => (state)
)(Inbox);



React.render((
  <Provider store={store}>
     {() => <App />}
  </Provider>
), document.body)



