import { isObject } from '../utils'

type Event = any

export function getEventValue(event: any): any {
  return isObject(event) && (event as Event).target
    ? (event as Event).type === 'checkbox'
        ? (event as Event).target?.checked
        : (event as Event).target?.value
    : event
}
