import React, { PropTypes, Component } from 'react'
import Ticket from './ticket'

export default class List extends Component {
  render() {
    const { tickets } = this.props,
          list = tickets.map((ticket, index) => {
            return  <div className='list__ticket card' key={index}>
              <Ticket ticket={ticket} />
            </div>
          })

    return <div className='list'>
      {list}
    </div>
  }
}

List.propTypes = {
  tickets: PropTypes.array.isRequired
}
