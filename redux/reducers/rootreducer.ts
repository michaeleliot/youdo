import counterReducer from './counterreducer';
import { combineReducers } from 'redux';

const rootReducer = combineReducers({
    counter: counterReducer,
    trello: counterReducer
});

export default rootReducer;
