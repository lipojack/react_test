import React, { Component } from 'react';
//import list from './list';
import { Grid, Row, FormGroup } from 'react-bootstrap';
import './App.css';

const DEFAULT_QUERY = 'react';
const DEFAULT_PAGE = 0;
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page='

const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}&${PARAM_PAGE}${DEFAULT_PAGE}`;
console.log(url);

// function isSearched(searchTerm){
//   return function(item){
//     return !searchTerm || item.title.toLowerCase().includes(searchTerm.toLowerCase());
//   }
// }

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
    this.onSubmit = this.onSubmit.bind(this);
  }

  setTopStories(result){
    const {hits, page} = result;
    const oldHits = page !== 0 ? this.state.result.hits : [];
    const updatedHits = [...oldHits, ...hits];
    this.setState({ result: { hits: updatedHits, page } });
  }

  fetchTopStories(searchTerm, page){
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}`)
      .then(response => response.json())
      .then(result => this.setTopStories(result))
      .catch(e => e);
  }

  componentDidMount(){
    this.fetchTopStories(this.state.searchTerm, DEFAULT_PAGE);
  }

  onSubmit(event, DEFAULT_PAGE){
    this.fetchTopStories(this.state.searchTerm);
    event.preventDefault();
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
    const page = (result && result.page) || 0;
    return (
      <div className = "App">
        
        <Grid fluid>
          <Row>
            <div className="jumbotron">
              <Search 
                onChange = {this.searchValue} 
                value = {searchTerm}
                onSubmit = { this.onSubmit }
              >Search : </Search>
            </div>
          </Row>
        </Grid>
        
        { result &&
          <Table
            list = {result.hits}
            searchTerm = {searchTerm}
            removeItem = {this.removeItem}
          />
        }
          
          <div className = "text-center alert">
            <Button
              className = "btn btn-success"
              onClick = { () => this.fetchTopStories(searchTerm, page + 1) }>
              Load more
            </Button>
          </div>
          

      </div>

      
      
    );
  }
}

// Stateless functional Component
const Search = ({onChange, value, children, onSubmit}) =>{
  return(
    <form onSubmit = { onSubmit }>
      <FormGroup>
        <div className = 'input-group'>
          <input
            className = 'form-control width100'
            type = 'text' 
            onChange = { onChange } 
            value = {value} 
          />
          <span className = 'input-group-btn'>
            <Button className = 'btn btn-primary' type = 'submit'>
              Search
            </Button>
          </span>
        </div>
      </FormGroup>
    </form>
  )
}

// Stateless functional Component
const Table = ({list, searchTerm, removeItem}) =>{
  return(
    <div>
      {
        // Don't use index as key : https://medium.com/@robinpokorny/index-as-a-key-is-an-anti-pattern-e0349aece318
        // list.filter( isSearched(searchTerm) ).map((item)=>
        list.map((item)=>
            <div key={item.title}>
              <h1><a href ={item.url}>{item.title}</a> by {item.author}</h1>
              <h2>comment : {item.num_comments} | point : {item.points}</h2>
              <Button
                className = 'btn btn-danger'
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
const Button = ({ onClick, children, className }) =>
  <button 
    onClick = { onClick }
    className = { className }
    >
    {children}
  </button>

export default App;
