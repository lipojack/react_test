import React, { Component } from 'react';
import list from './list';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  
  // Set up component state
  // ES6 can use constructor to initialize internal state
  constructor(props){
    super(props);
    this.state = {
      list: list
    }
    this.removeItem = this.removeItem.bind(this);
  }
  
  removeItem(id){
    
    //console.log(id);
    
    function isNotId(item){
      return item.title != id;
    }
    const updatedList = this.state.list.filter(isNotId);
    this.setState({list: updatedList});
  }

  render() {
    return (
      <div className = "App">
        {
          // ES6 Arrow function
          // Don't use index as key : https://medium.com/@robinpokorny/index-as-a-key-is-an-anti-pattern-e0349aece318
          this.state.list.map((item)=>
              <div key={item.title}>
                <h1><a href ={item.url}>{item.title}</a> by {item.author}</h1>
                <h2>comment : {item.comment} | point : {item.point}</h2>
                <button type = "button" onClick = {()=>this.removeItem(item.title)}>remove</button>
              </div>
          )
        }
      </div>
    );
  }
}

export default App;
