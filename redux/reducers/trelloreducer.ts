import { ADD_COLUMN, DELETE_COLUMN, ADD_TASK, DELETE_TASK } from '../actions/counteractions';
import { HYDRATE } from 'next-redux-wrapper';


const initialState = { columns: [], columnObject: {} }

const trelloReducer = (state = initialState, action) => {
    switch (action.type) {
        case HYDRATE:
            // Attention! This will overwrite client state! Real apps should use proper reconciliation.
            return { ...state, ...action.payload };
        case ADD_COLUMN:
            return {
                ...state,
                columns: [...state.columns, action.payload.id],
                columnObject: {
                    ...state.columnObject,
                    [action.payload.id]: action.payload
                }
            };
        case DELETE_COLUMN:
            let newColumns = new Array(...state.columns)
            let removeColumnIndex = newColumns.findIndex(col => col.id == action.payload)
            newColumns.splice(removeColumnIndex, 1)
            delete state.columnObject[action.payload]
            return {
                ...state,
                columns: newColumns
            }
        case ADD_TASK:
            const column = state.columnObject[action.payload.columnId]
            column.Task.push(action.payload.task)
            return {
                ...state,
                columnObject: {
                    ...state.columnObject,
                    [action.payload.columnId]: column
                }
            }
        case DELETE_TASK:
            const column2 = state.columnObject[action.payload.columnId]
            column2.Task.splice(column2.Task.findIndex(task =>
                task.id == action.payload.taskId
            ), 1)
            return {
                ...state,
                columnObject: {
                    ...state.columnObject,
                    [action.payload.columnId]: {
                        ...state.columnObject[action.payload.columnId],
                        Task: column2.Task
                    }
                }
            }
        default:
            return {
                ...state
            };
    }
};

export default trelloReducer;
