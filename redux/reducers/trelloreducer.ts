import { UPDATE_COLUMN_ORDER, UPDATE_TASK_ORDER, ADD_COLUMN, DELETE_COLUMN, ADD_TASK, DELETE_TASK } from '../actions/counteractions';
import { HYDRATE } from 'next-redux-wrapper';
import { ColumnWithTasks, Task } from '../../types';

interface TrelloState {
    columns: number[],
    columnObject: {
        [key: number]: ColumnWithTasks;
    }
    taskObject: {
        [key: number]: Task;
    }
}

const initialState: TrelloState = { columns: [], columnObject: {}, taskObject: {} }

const trelloReducer = (state = initialState, action): TrelloState => {
    switch (action.type) {
        case HYDRATE:
            // Attention! This will overwrite client state! Real apps should use proper reconciliation.
            return { ...state, ...action.payload };
        case UPDATE_TASK_ORDER: {
            let { task } = action.payload
            const column = state.columnObject[task.columnId]
            const updatingTask = state.taskObject[task.id]
            let taskCopy = [...column.Task]
            taskCopy.splice(updatingTask.position, 1)
            taskCopy.splice(task.position, 0, updatingTask.id)
            taskCopy.forEach((taskId, index) => state.taskObject[taskId].position = index)
            return {
                ...state,
                taskObject: state.taskObject,
                columnObject: {
                    ...state.columnObject,
                    [column.id]: {
                        ...state.columnObject[column.id],
                        Task: taskCopy
                    }
                }
            };
        }
        case UPDATE_COLUMN_ORDER: {
            let { column } = action.payload
            const fullColumn = state.columnObject[column.id]
            let columnCopy = [...state.columns]
            columnCopy.splice(fullColumn.position, 1)
            columnCopy.splice(column.position, 0, fullColumn.id)
            columnCopy.forEach((columnId, index) => state.columnObject[columnId].position = index)
            return {
                ...state,
                columns: columnCopy,
                columnObject: {
                    ...state.columnObject,
                    [column.id]: {
                        ...state.columnObject[column.id],
                        position: column.position
                    }
                }
            };
        }
        case ADD_COLUMN: {
            let { column } = action.payload
            return {
                ...state,
                columns: [...state.columns, column.id],
                columnObject: {
                    ...state.columnObject,
                    [column.id]: column
                }
            };
        }
        case DELETE_COLUMN: {
            let { columnId } = action.payload
            delete state.columnObject[action.payload]
            return {
                ...state,
                columns: state.columns.filter(colId => colId != columnId)
            }
        }
        case ADD_TASK: {
            let { task, columnId } = action.payload
            return {
                ...state,
                columnObject: {
                    ...state.columnObject,
                    [columnId]: {
                        ...state.columnObject[columnId],
                        Task: [...state.columnObject[columnId].Task, task.id]
                    }
                },
                taskObject: {
                    ...state.taskObject,
                    [task.id]: task
                }
            }
        }

        case DELETE_TASK: {
            let { columnId, taskId } = action.payload
            delete state.taskObject[taskId]
            return {
                ...state,
                columnObject: {
                    ...state.columnObject,
                    [columnId]: {
                        ...state.columnObject[columnId],
                        Task: state.columnObject[columnId].Task.filter(tId => tId != taskId)
                    }
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
