import counterReducer from './counterreducer';
import { combineReducers } from 'redux';

const rootReducer = combineReducers({
    counter: counterReducer
});

export default rootReducer;
