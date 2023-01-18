import React,{Component} from "react";
import axios from 'axios'
import "./style.css";

const URL = 'https://60cb684021337e0017e44b46.mockapi.io/characters'

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      characters :[],
      sort:{
        name:"",
        upvotes:"",
        born:""
      },
      currentPage:1,
      itemPerPage : 10
    }
  }

  componentDidMount() {
    axios.get(URL).then((res) => {
      this.setState((state,props) => (
        {
          characters:res.data,
          sort:state.sort
        }
      ))
    })
  }

  onPageChange = (e) => {
    this.setState((state,props) => (
      {
        currentPage:Number(e.target.innerHTML)
      }
    ))
  }

  nameSort = (e) => {
    let order = e.target.value;
    let sortedCharacters = [...this.state.characters];
    if (order  === 'ASC') {
      sortedCharacters.sort((a,b) => (a.name.localeCompare(b.name)))
    }
    else if (order === 'DESC') {
      sortedCharacters.sort((a,b) => (b.name.localeCompare(a.name)))
    }
    this.setState((state,props) => (
      {
        sort:{
          name:order,
          upvotes:state.sort.upvotes,
          born:state.sort.born
        },
        characters:sortedCharacters
      }
    ))
  }

  upvoteSort = (e) => {
    let order = e.target.value;
    let sortedCharacters = [...this.state.characters]
    if (order  === 'LEAST') {
      sortedCharacters.sort((a,b) => (a.upvotes - b.upvotes))
    }
    else if (order === 'MOST') {
      sortedCharacters.sort((a,b) => (b.upvotes - a.upvotes))
    }
    this.setState((state,props) => (
      {
        sort:{
          name:state.sort.name,
          upvotes:order,
          born:state.sort.born
        },
        characters:sortedCharacters
      }
    ))
  }
  bornSort = (e) => {
    let order = e.target.value;
    let sortedCharacters = [...this.state.characters]
    if (order  === 'OLDEST') {
      sortedCharacters.sort((a,b) => (new Date(a.born) - new Date(b.born)))
    }
    else if (order === 'RECENT') {
      sortedCharacters.sort((a,b) => (new Date(b.born) - new Date(a.born)))
    }
    this.setState((state,props) => (
      {
        sort:{
          name:state.sort.name,
          upvotes:state.sort.upvotes,
          born:order
        },
        characters:sortedCharacters
      }
    ))
  }

  render() {
    let data;
    if (this.state.characters.length < 1 ) {
      data = <h3>No data</h3>
    }
    else {
        //logic for current page items
        let lastIndex = this.state.currentPage * this.state.itemPerPage
        let firstIndex = lastIndex - this.state.itemPerPage
        let currentPageData = [...this.state.characters].slice(firstIndex,lastIndex)

        //mapping into JSX
        data = currentPageData.map((item) => {
        return (
          <tr key={item.id}>
            <td>{item.id}</td>
            <td>{item.name}</td>
            <td>{item.upvotes}</td>
            <td>{new Date(item.born).toLocaleDateString()}</td>
          </tr>
        )
      })
    }

    let pageNumbers = Array.from({length: (Math.ceil(this.state.characters.length/this.state.itemPerPage))}, (_, i) => i + 1).map((page,idx) => (
      <li key={idx} className={this.state.currentPage === page ? "active":""} onClick={(e) => (this.onPageChange(e))}>{page}</li>
    ))
    return (
    <div>
      <h2 className='heading'>React Data Sorting & Pagination</h2>
      <table >
      <thead>
        <tr className='table-head'>
          <th>ID
          </th>
          <th>Name
            <select value={this.state.sort.name} onChange={(e) => this.nameSort(e)}>
            <option value="">SORT</option>
              <option value="ASC">ASC</option>
              <option value="DESC">DESC</option>
            </select>
          </th>
          <th>Upvotes
            <select value={this.state.sort.upvotes} onChange={(e) => this.upvoteSort(e)}>
              <option value="">SORT</option>
              <option value="MOST">MOST</option>
              <option value="LEAST">LEAST</option>
            </select>
          </th>
          <th>Born
            <select value={this.state.sort.born} onChange={(e) => this.bornSort(e)}>
              <option value="">SORT</option>
              <option value="OLDEST">OLDEST</option>
              <option value="RECENT">RECENT</option>
            </select>
           </th>
        </tr>
      </thead>
      <tbody>
        {data}
      </tbody>
      </table>
      <ul className="pageNumbers">
        {pageNumbers}
      </ul>
    </div>
  );
  }
  
}

export default App

