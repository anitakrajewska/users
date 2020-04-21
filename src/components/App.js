/*
API URL: http://www.mocky.io/v2/5e9c118930000056000a7d5b
Zadania:
wyświetlić wszystkie rekordy jako lista: imie i nazwisko   ->  wyświetlić jako fullname
sortowania rekordów po ID Obiektu po wciśnięciu ikonki
po wciśnięciu ikonki wyświetlić tylko nie usunięte rekordy
dodać możliwość usunięcia danego rekordu
serach: imie lub nazwisko lub fullname i automatycznie szuka bez klikania w button
*/
import React, { Component } from 'react';
import './App.css';
import User from './User';

const API = 'http://www.mocky.io/v2/5e9c118930000056000a7d5b';

class App extends Component {
  state = {
    firstname: '',
    lastname: '',
    gender: '',
    isActive: false,
    search: '',
    users: [],
    isNumericSorted: true,
  }

  handleFetchData = async () => {
    try {
      const users = await fetch(API)
        .then(response => {
          if (!response.ok) {
            throw Error(response.status)
          }
          return response;
        })
        .then(response => response.json())

      this.setState({ users })
    } catch (e) {
      console.error(e)
      this.setState({ users: [] })
    }


    // fetch(API)

    //   .then(response => response.json())
    //   .then(response => {
    //     this.setState({
    //       users: response
    //     })
    //   })
    //   .catch(error => {
    //     alert('API incorrect')
    //     this.setState({
    //       users: []
    //     })
    //   })
  }

  /*
    handleFetchData = () => {
      fetch(API)
        .then(response => {
          if (!response.ok) {
            throw Error(response.status)
          }
          return response;
        })
        .then(response => response.json())
        .then(response => {
          this.setState({
            users: response
          })
        })
        .catch(error => {
          alert('API incorrect')
          this.setState({
            users: []
          })
        })
    }*/

  componentDidMount() {
    this.handleFetchData();
  }

  // controlled component form fields
  handleChange = (e) => {
    const name = e.target.name;

    if (e.target.type === 'checkbox') {
      this.setState({
        [name]: e.target.checked
      })
    } else {
      this.setState({
        [name]: e.target.value
      })
    }
    //console.log(e.target.name, e.target.value, e.target.type)
  }

  handleClick = () => {
    const newUser = {
      id: this.state.users.length + 1,
      firstName: this.state.firstname,
      lastName: this.state.lastname,
      gender: this.state.gender,
      deleted: this.state.isActive
    }

    const users = [...this.state.users];
    users.push(newUser);

    //console.log(newUser)

    this.setState({
      users
    })

    console.log('handleClick - works')
  }

  handleSubmit = (e) => {
    e.preventDefault();
  }

  // delete User form the list
  handleDeleteUserClick = (id) => {
    const users = [...this.state.users]
    const index = users.findIndex(user => user.id === id);

    //array.splice(start, deleteCount[, item1[, item2[, ...]]])
    users.splice(index, 1);

    this.setState({
      users
    })
  }

  handleShowActiveUsersClick = () => {
    const users = this.state.users.filter(user => !user.deleted)

    this.setState({
      users
    })
  }

  handleBackClick = () => {
    this.handleFetchData();
  }

  handleSortListChange = (e) => {
    this.handleChange(e);
    let users = [];

    if (this.state.isNumericSorted) {
      //default sort
      users = this.state.users.sort((current, next) => next.id - current.id);
    } else {
      //reverse
      users = this.state.users.sort((current, next) => current.id - next.id);
    }
    this.setState({
      users,
      isNumericSorted: !this.state.isNumericSorted
    });
  }

  handleSearchUserChange = (e) => {
    this.handleChange(e);
    //const searchString = this.state.search;  //delay of 1 letter
    const searchString = e.target.value;
    const regex = new RegExp(searchString, 'gi');

    const users = this.state.users.filter(user => {
      const res = user.firstName.match(regex);
      return !!res;  // true
    });

    this.setState({
      users
    })
  }

  render() {

    const users = this.state.users.map(user => (
      <User
        key={user.id}
        id={user.id}
        firstName={user.firstName}
        lastName={user.lastName}
        delete={() => this.handleDeleteUserClick(user.id)} />
    ));

    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <input placeholder="First name" type="text" id="firstname" name="firstname" value={this.state.firstname} onChange={this.handleChange} />
          <input placeholder="Last name" type="text" id="lastname" name="lastname" value={this.state.lastname} onChange={this.handleChange} />
          <select name="gender" value={this.state.gender} onChange={this.handleChange}>
            <option value="">Gender</option>
            <option value="f">female</option>
            <option value="m">male</option>
            <option value="nd">other</option>
          </select>
          <label htmlFor="isActive">
            <input type="checkbox" name="isActive" id="isActive" checked={this.state.isActive} onChange={this.handleChange} />
            is user active?
          </label>
          <button onClick={this.handleClick}>Add</button>
        </form>

        <input placeholder="Search by name..." type="input" id="searchInput" name="search" value={this.state.search} onChange={this.handleSearchUserChange} />

        <label htmlFor="isNumericSorted">
          <input type="checkbox" name="isNumericSorted" id="isNumericSorted" checked={this.state.isNumericSorted} onChange={this.handleSortListChange} />
          <span>Sort numeric : sort reverse</span>
        </label>

        {users ? <ul>{users}</ul> : ''}
        <button onClick={this.handleShowActiveUsersClick}>Show only active users</button>
        <button onClick={this.handleBackClick}>Back</button>
      </div>
    );
  }
}

export default App;
