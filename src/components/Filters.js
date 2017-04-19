import React, { Component } from 'react'

export default class Filters extends Component {
  constructor(props) {
    super(props);
    
    this.state = { currentFilters: [] };
  }

  setFilter(stops, multiple = true) {
    let { currentFilters } = this.state

    if (stops === null) {
      currentFilters = []
    } else {
      if (!multiple) {
        currentFilters = [stops]
      } else {
        let index = currentFilters.indexOf(stops)

        if (index === -1) {
          currentFilters.push(stops)
        } else {
          currentFilters.splice(index, 1)
        }
      }
    }

    this.props.setFilter({ currentFilters })
    this.setState({ currentFilters })
  }

  render() {
    let filterList = [
      { stops: null, text: 'Все' }, 
      { stops: 0, text: 'Без пересадок' }, 
      { stops: 1, text: '1 пересадка' }, 
      { stops: 2, text: '2 пересадки'}, 
      { stops: 3, text: '3 пересадки' }
    ]

    let inputs = filterList.map((filter, index) => {
      return <div className='filters__input' key={index}>
        <input
          id={`filter-id-${index}`}
          className='hidden-input'
          type='checkbox'
          checked={
            this.state.currentFilters.length === 0 && index === 0
            || this.state.currentFilters.indexOf(filter.stops) > -1
          }
          onChange={this.setFilter.bind(this, filter.stops)} />
        <label
          htmlFor={`filter-id-${index}`}
          className='pseudo-input'>
          {filter.text}
        </label>
        {index !== 0 &&
          <span className='filters__only' onClick={this.setFilter.bind(this, filter.stops, false)}>
            Только
          </span>
        }
      </div>
    })

    return <div className='card filters'>
      <h2 className='filters__title'>Количество пересадок</h2>
      {inputs}
    </div>
  }
}
