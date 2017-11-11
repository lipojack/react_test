import React, { Component } from 'react';
//import list from './list';
import { Grid, Row } from 'react-bootstrap';
import './App.css';

const DEFAULT_QUERY = 'react';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
//const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}`;

function isSearched(searchTerm){
  return function(item){
    return !searchTerm || item.title.toLowerCase().includes(searchTerm.toLowerCase());
  }
}

class App extends Component {
  
  // Set up component state
  // ES6 can use constructor to initialize internal state
  constructor(props){
    super(props);
    this.state = {
      result: null,
      searchTerm: DEFAULT_QUERY
    }
    this.removeItem = this.removeItem.bind(this);
    this.searchValue = this.searchValue.bind(this);
    this.setTopStories = this.setTopStories.bind(this);
    this.fetchTopStories = this.fetchTopStories.bind(this);
  }

  setTopStories(result){
    this.setState({ result: result });
  }

  fetchTopStories(searchTerm){
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}`)
      .then(response => response.json())
      .then(result => this.setTopStories(result))
      .catch(e => e);
  }

  componentDidMount(){
    this.fetchTopStories(this.state.searchTerm);
  }

  // ES6 
  removeItem(id){
    const { result } = this.state;
    const isNotId = item => item.title != id;
    const updatedList = result.hits.filter(isNotId);
    //this.setState({ result: Object.assign({}, result, { hits: updatedList }) });
    this.setState({ result: {...result, hits: updatedList} });
  }

  searchValue(event){
    this.setState({ searchTerm: event.target.value });
  }

  render() {
    // Destructing
    const {result, searchTerm} = this.state;
    if (!result) return null;
    return (
      <div className = "App">
        
        <Grid>
          <Row>
            <div className="jumbotron">
              <Search 
                onChange = {this.searchValue} 
                value = {searchTerm}
              >Search : </Search>
            </div>
          </Row>
        </Grid>

        <Table
          list = {result.hits}
          searchTerm = {searchTerm}
          removeItem = {this.removeItem}
        />
      </div>
    );
  }
}

// Stateless functional Component
const Search = ({onChange, value, children}) =>{
  return(
    <form>
      {children}
      <input 
        type="text" 
        onChange = { onChange } 
        value = {value} 
      />
    </form>
  )
}

// Stateless functional Component
const Table = ({list, searchTerm, removeItem}) =>{
  return(
    <div>
      {
        // Don't use index as key : https://medium.com/@robinpokorny/index-as-a-key-is-an-anti-pattern-e0349aece318
        list.filter( isSearched(searchTerm) ).map((item)=>
            <div key={item.title}>
              <h1><a href ={item.url}>{item.title}</a> by {item.author}</h1>
              <h2>comment : {item.comment} | point : {item.point}</h2>
              <Button
                type = 'button'
                onClick = {()=>removeItem(item.title)}>
                Remove
              </Button>
            </div>
        )
      }
    </div>  
  )
}

// Stateless functional Component
const Button = ({ onClick, children }) =>
  <button 
    onClick = {onClick}>
    {children}
  </button>

export default App;
