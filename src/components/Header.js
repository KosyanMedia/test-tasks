import React, { Component } from 'react'
import logo from './../../images/logo.svg'

export default class Header extends Component {
  render() {
    return <div className='header'>
        <a href='/' className='header__logo' dangerouslySetInnerHTML={{__html: logo}}></a>
    </div>
  }
}
