import trelloReducer from './trelloreducer';
import { combineReducers } from 'redux';

const rootReducer = combineReducers({
    trello: trelloReducer
});

export default rootReducer;
