import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Filters from '../components/Filters'
import List from '../components/List'
import Header from '../components/Header'
import * as pageActions from '../actions/PageActions'

class App extends Component {
  render() {
    const { tickets } = this.props
    const { setFilter } = this.props.pageActions

    return <div className='page'>
      <div className='page_header'>
        <Header />
      </div>
      <div className='page__body'>
        <div className='page__filters' >
          <Filters setFilter={setFilter} />
        </div>
        <div className='page__list'>
          <List tickets={tickets} />
        </div>
      </div>
    </div>
  }
}

function mapStateToProps(state) {
  return {
    tickets: state.page.tickets
  }
}

function mapDispatchToProps(dispatch) {
  return {
    pageActions: bindActionCreators(pageActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
