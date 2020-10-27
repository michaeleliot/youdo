import trelloReducer from './trello_reducer';
import { combineReducers } from 'redux';

const rootReducer = combineReducers({
    trello: trelloReducer
});

export default rootReducer;
