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
      searchKey: '',
      searchTerm: DEFAULT_QUERY
    }
    this.removeItem = this.removeItem.bind(this);
    this.searchValue = this.searchValue.bind(this);
    this.setTopStories = this.setTopStories.bind(this);
    this.fetchTopStories = this.fetchTopStories.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  checkTopStoriesSearchTerm(searchTerm){
    return !this.state.results[searchTerm];
  }

  setTopStories(result){
    const {hits, page} = result;
    //const oldHits = page !== 0 ? this.state.result.hits : [];
    const { searchKey, results } = this.state;
    const oldHits = results && results[searchKey] ? results[searchKey].hits : [];
    const updatedHits = [...oldHits, ...hits];
    this.setState({ results: {...results, [searchKey]: { hits: updatedHits, page }} });
  }

  fetchTopStories(searchTerm, page){
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}`)
      .then(response => response.json())
      .then(result => this.setTopStories(result))
      .catch(e => e);
  }

  componentDidMount(){
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    this.fetchTopStories(searchTerm, DEFAULT_PAGE);
  }

  onSubmit(event){
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    
    if (this.checkTopStoriesSearchTerm(searchTerm)){
      this.fetchTopStories(searchTerm, DEFAULT_PAGE);  
    }
    event.preventDefault();
  }

  // ES6 
  removeItem(id){
    const { results, searchKey } = this.state;
    const { hits, page } = results[searchKey];
    const isNotId = item => item.objectID !== id;
    const updatedList = hits.filter(isNotId);
    //this.setState({ result: Object.assign({}, result, { hits: updatedList }) });
    this.setState({ results: {...results, [searchKey]: {hits: updatedList}, page} });
  }

  searchValue(event){
    this.setState({ searchTerm: event.target.value });
  }

  render() {
    // Destructing
    const {results, searchTerm, searchKey} = this.state;
    const page = (results && results[searchKey] && results[searchKey].page) || 0;
    const list = (results && results[searchKey] && results[searchKey].hits) || [];
    return (
      <div>
        
        <Grid fluid>
          <Row>
            <div className="jumbotron text-center">
              <Search 
                onChange = {this.searchValue} 
                value = {searchTerm}
                onSubmit = { this.onSubmit }
              >Hack News </Search>
            </div>
          </Row>
        </Grid>
        
        <Grid>
          <Row>
            <Table
              list = {list}
              searchTerm = {searchTerm}
              removeItem = {this.removeItem}
            />
        
          
            <div className = "text-center alert">
              <Button
                className = "btn btn-success"
                onClick = { () => this.fetchTopStories(searchTerm, page + 1) }>
                Load more
              </Button>
            </div>   
          </Row>
        </Grid>
        
          

      </div>

      
      
    );
  }
}

// Stateless functional Component
const Search = ({onChange, value, children, onSubmit}) =>{
  return(
    <form onSubmit = { onSubmit }>
      <FormGroup>
        <h1 style={{color:'#F96D00'}}>{children}</h1>
        <hr style={{color:'#000000', width:'100px'}}/>
        
        <div className = 'input-group'>
          
          <input
            className = 'form-control width100 searchForm'
            type = 'text' 
            onChange = { onChange } 
            value = {value} 
          />
          
          <span 
            className = 'input-group-btn'>
            <Button className = 'btn btn-primary searchBtn' type = 'submit'>
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
    <div className='col-sm-10 col-sm-offset-1'>
      {
        // Don't use index as key : https://medium.com/@robinpokorny/index-as-a-key-is-an-anti-pattern-e0349aece318
        // list.filter( isSearched(searchTerm) ).map((item)=>
        list.map((item)=>
            <div key={item.objectID}>
              <h2><a href ={item.url}>{item.title}</a></h2>
              <h4>
                
                { item.author } | {item.num_comments} comments | {item.points} points
                
                <Button
                  className = 'btn btn-danger btn-xs'
                  type = 'button'
                  onClick = {()=>removeItem(item.objectID)}>
                  Remove
                </Button>
              
              </h4><hr/>
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
