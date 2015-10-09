
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
  //  return { value : state.value + 1 };

    return Object.assign({}, state, {
      value: state.value + 1
    });

  case 'DECREMENT':
    return state ;
  default:
    return state;
  }
}


var store = createStore(counter, ({ value: 0 }) );

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

const Inbox = React.createClass({
  render() {
    return (
      <div>
        <h2>Inbox</h2>
        <h2>{this.props.value || "Welcome to your Inbox"}</h2>
        <input onChange={ a => console.log( 'whoot ' + a.target.value ) } />  
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



