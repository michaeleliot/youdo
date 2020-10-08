import { DECREMENT_COUNTER, INCREMENT_COUNTER } from '../actions/counteractions';
import { HYDRATE } from 'next-redux-wrapper';

const counterReducer = (state = { value: 0 }, action) => {
    switch (action.type) {
        case HYDRATE:
            // Attention! This will overwrite client state! Real apps should use proper reconciliation.
            return { ...state, ...action.payload };
        case INCREMENT_COUNTER:
            return {
                ...state,
                value: state.value + 1
            };
        case DECREMENT_COUNTER:
            return {
                ...state,
                value: state.value - 1
            };
        default:
            return {
                ...state
            };
    }
};

export default counterReducer;
