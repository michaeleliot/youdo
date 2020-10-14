import { CHANGE_DATA } from '../actions/counteractions';
import { HYDRATE } from 'next-redux-wrapper';


const initialState = { value: 0 }

const trelloReducer = (state = initialState, action) => {
    switch (action.type) {
        case HYDRATE:
            // Attention! This will overwrite client state! Real apps should use proper reconciliation.
            return { ...state, ...action.payload };
        case CHANGE_DATA:
            return {
                ...state,
            };
        default:
            return {
                ...state
            };
    }
};

export default trelloReducer;
