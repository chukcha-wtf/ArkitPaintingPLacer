import { createStore, combineReducers } from 'redux'
import arAppState from './reducers'

const store = createStore(combineReducers({
    arAppState
}));
export default store;
