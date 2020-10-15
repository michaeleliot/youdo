import { ADD_COLUMN, DELETE_COLUMN, ADD_TASK, DELETE_TASK } from '../actions/counteractions';
import { HYDRATE } from 'next-redux-wrapper';


const initialState = { columns: [] }

const trelloReducer = (state = initialState, action) => {
    switch (action.type) {
        case HYDRATE:
            // Attention! This will overwrite client state! Real apps should use proper reconciliation.
            return { ...state, ...action.payload };
        case ADD_COLUMN:
            return {
                ...state,
                columns: [...state.columns, action.payload]
            };
        case DELETE_COLUMN:
            let newColumns = new Array(...state.columns)
            let removeColumnIndex = newColumns.findIndex(col => col.id == action.payload)
            newColumns.splice(removeColumnIndex, 1)
            return {
                ...state,
                columns: newColumns
            }
        case ADD_TASK:
            let arr = new Array(...state.columns)
            let column = arr.find(col =>
                col.id == action.payload.columnId
            )
            column.Task.push(action.payload.task)
            return {
                ...state,
                columns: arr
            }
        case DELETE_TASK:
            let columns2 = new Array(...state.columns)
            let column2 = columns2.find(col =>
                col.id == action.payload.columnId
            )
            column2.Task.splice(column2.Task.findIndex(col =>
                col.id == action.payload.taskId
            ), 1)

            return {
                ...state,
                columns: columns2
            }
        default:
            return {
                ...state
            };
    }
};

export default trelloReducer;
