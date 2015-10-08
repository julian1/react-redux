
// ok, lets try to get it running in the browser

var Redux = require('redux');  //import { createStore } from 'redux';
var React = require('react');
var ReactRedux = require('react-redux');

// var $ = require('jquery');
import { createStore } from 'redux'; //babelify




// function counter(state = 0, action) {
function counter(state, action) {
  switch (action.type) {
  case 'INCREMENT':
    return state + 1;
  case 'DECREMENT':
    return state - 1;
  default:
    return state;
  }
}


var store = createStore(counter, 0 );

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


function mapStateToProps(state)  {
  return {
    value: state
  };
}

var App = ReactRedux.connect(
  mapStateToProps
)(Inbox);

//    { function () {
 //     return ( <App/> );
  //  }}


React.render((
  <ReactRedux.Provider store={store}>
     {() => <App />}
  </ReactRedux.Provider>
), document.body)



