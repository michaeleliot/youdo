import { UPDATE_TASK_ORDER, ADD_COLUMN, DELETE_COLUMN, ADD_TASK, DELETE_TASK } from '../actions/counteractions';
import { HYDRATE } from 'next-redux-wrapper';


const initialState = { columns: [], columnObject: {}, taskObject: {} }

const trelloReducer = (state = initialState, action) => {
    switch (action.type) {
        case HYDRATE:
            // Attention! This will overwrite client state! Real apps should use proper reconciliation.
            return { ...state, ...action.payload };
        case UPDATE_TASK_ORDER:
            const column3 = state.columnObject[action.payload.columnId]
            const updatingTask = state.taskObject[action.payload.id]
            let taskCopy = [...column3.Task]
            taskCopy.splice(updatingTask.position, 1)
            taskCopy.splice(action.payload.position, 0, updatingTask.id)
            taskCopy.forEach((taskId, index) => state.taskObject[taskId].position = index)
            return {
                ...state,
                taskObject: state.taskObject,
                columnObject: {
                    ...state.columnObject,
                    [action.payload.columnId]: {
                        ...state.columnObject[action.payload.columnId],
                        Task: taskCopy
                    }
                }
            };
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
            let newColumns = [...state.columns]
            let removeColumnIndex = newColumns.findIndex(colId => colId == action.payload)
            newColumns.splice(removeColumnIndex, 1)
            delete state.columnObject[action.payload]
            return {
                ...state,
                columns: newColumns
            }
        case ADD_TASK:
            const column = state.columnObject[action.payload.columnId]
            column.Task.push(action.payload.task.id)
            return {
                ...state,
                columnObject: {
                    ...state.columnObject,
                    [action.payload.columnId]: column
                },
                taskObject: {
                    [action.payload.id]: action.payload
                }
            }
        case DELETE_TASK:
            const column2 = state.columnObject[action.payload.columnId]
            column2.Task.splice(column2.Task.findIndex(taskId =>
                taskId == action.payload.taskId
            ), 1)
            delete state.taskObject[action.payload.taskId]
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
