import { emptyAsString } from '../value/empty'

function checkStringValue(search, value) {
  return value.toLowerCase().indexOf(search.toLowerCase()) !== -1
}

function filterValue(search, value) {
  switch (value.primitive) {
    case 'Array':
      return value.value.some(filterValue.bind(this, search))

    case 'Number':
      return checkStringValue(search, String(value.value))

    case 'Empty':
      return checkStringValue(search, emptyAsString(value))

    case 'String':
      return checkStringValue(search, value.value)

    case 'Mocha':
    case 'Object':
      return Object.keys(value.value).some(
        k => filterValue(search, k) || filterValue(search, value.value[k])
      )

    case 'Unknown':
    default:
      return checkStringValue(search, String(value.value))
  }
}

export default function filterLogs({ types, search }) {
  return l => {
    if (!types[l.type]) {
      return false
    }
    if (!search) {
      return true
    }
    return l.values.some(filterValue.bind(this, search))
  }
}
