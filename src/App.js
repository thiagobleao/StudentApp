import React, { Component } from 'react';
import StudentList from './containers/index';

export default class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      _bHasError: false
    }
  }

  componentDidCatch(){

  }
  render() {
    return(
      <StudentList/>
    )
  }
}
