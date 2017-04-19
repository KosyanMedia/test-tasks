import React, { Component } from 'react'

export default class Ticket extends Component {
  render() {
    const { ticket } = this.props

    function getFormatedStops(stops) {
        if (stops === 0) {
            return ' '
        } else if (stops === 1) {
            return `${stops} пересадка`
        } else if (1 < stops < 4) {
            return `${stops} пересадки`
        } else {
            return `${stops} пересадок`
        }
    }

    function getFormatedDate(dateString) {
        let parseString = dateString.split('.').reverse().map((el) => +el),
            date = new Date(...parseString),
            month = ['янв', 'фев', 'мрт', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'нбр', 'дкб'],
            days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
            
            return `${date.getDate()} ${month[date.getMonth()]} 20${date.getYear()}, ${days[date.getDay()]}`
    }

    return <div className='ticket'>
        <div className='ticket__order'>
            <img className='ticket__logo' src={`/images/${ticket.carrier}.jpg`} />
            <button className='ticket__purchase'>Купить за<br />{ticket.price} Р</button>
        </div>
        <div className='ticket__info'>
            <div className='ticket__row'>
                <div className='ticket__time'>{ticket.departure_time}</div>
                <div className='ticket__transfer-count'>
                    { getFormatedStops(ticket.stops) }
                    </div>
                <div className='ticket__time'>{ticket.arrival_time}</div>
            </div>
            <div className='ticket__row'>
                <div className='ticket__point'>
                    <div className='ticket__direction'>{ticket.destination}, {ticket.destination_name}</div>
                    <div className='ticket__date'>{getFormatedDate(ticket.departure_date)}</div>
                </div>
                <div className='ticket__point ticket__point_align-right'>
                    <div className='ticket__direction'>{ticket.origin}, {ticket.origin_name}</div>
                    <div className='ticket__date'>{getFormatedDate(ticket.arrival_date)}</div>
                </div>
            </div>
        </div>
    </div>
  }
}
