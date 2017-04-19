import { FILTER } from '../constants/Page'

export function setFilter(options = {currentFilters: []}) {

  return {
    type: FILTER,
    payload: options
  }

}