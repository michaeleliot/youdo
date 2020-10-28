import { HYDRATE } from 'next-redux-wrapper';
import { ColumnWithTasks, Task } from '../../types';
import { UPDATE_TASK_ORDER, ADD_TASK, ADD_HIDDEN_TASK, DELETE_TASK } from '../actions/task_types';
import { UPDATE_COLUMN_ORDER, ADD_COLUMN, UPDATE_FAKE_COLUMN, DELETE_COLUMN } from '../actions/column_types';

export interface TrelloState {
    columns: number[],
    fakeColumnId: number,
    fakeTaskId: number,
    columnObject: {
        [key: number]: ColumnWithTasks;
    }
    taskObject: {
        [key: number]: Task;
    }
}

const initialState: TrelloState = {
    columns: [],
    fakeColumnId: -1,
    fakeTaskId: -1,
    columnObject: {},
    taskObject: {}
}

const trelloReducer = (state = initialState, action): TrelloState => {
    switch (action.type) {
        case HYDRATE:
            // Attention! This will overwrite client state! Real apps should use proper reconciliation.
            return { ...state, ...action.payload };
        case UPDATE_TASK_ORDER: {
            let { task } = action.payload
            const column = state.columnObject[task.columnId]
            const oldTask = state.taskObject[task.id]
            const oldColumn = state.columnObject[oldTask.columnId]
            if (oldColumn.id != column.id) {
                let taskCopy = [...column.Task]
                let oldTaskCopy = [...oldColumn.Task]
                oldTaskCopy.splice(oldTask.position, 1)
                taskCopy.splice(task.position, 0, oldTask.id)
                taskCopy.forEach((taskId, index) => state.taskObject[taskId].position = index)
                oldTaskCopy.forEach((taskId, index) => state.taskObject[taskId].position = index)
                return {
                    ...state,
                    taskObject: {
                        ...state.taskObject,
                        [task.id]: task
                    },
                    columnObject: {
                        ...state.columnObject,
                        [column.id]: {
                            ...state.columnObject[column.id],
                            Task: taskCopy
                        },
                        [oldColumn.id]: {
                            ...state.columnObject[oldColumn.id],
                            Task: oldTaskCopy
                        }
                    }
                };
            } else {
                let taskCopy = [...column.Task]
                taskCopy.splice(oldTask.position, 1)
                taskCopy.splice(task.position, 0, oldTask.id)
                taskCopy.forEach((taskId, index) => state.taskObject[taskId].position = index)
                return {
                    ...state,
                    taskObject: {
                        ...state.taskObject,
                        [task.id]: task
                    },
                    columnObject: {
                        ...state.columnObject,
                        [column.id]: {
                            ...state.columnObject[column.id],
                            Task: taskCopy
                        }
                    }
                };
            }

        }
        case UPDATE_COLUMN_ORDER: {
            let { column } = action.payload
            const oldColumn = state.columnObject[column.id]
            let columnCopy = [...state.columns]
            columnCopy.splice(oldColumn.position, 1)
            columnCopy.splice(column.position, 0, oldColumn.id)
            columnCopy.forEach((columnId, index) => state.columnObject[columnId].position = index)
            return {
                ...state,
                columns: columnCopy,
                columnObject: {
                    ...state.columnObject,
                    [column.id]: {
                        ...oldColumn,
                        position: column.position
                    }
                }
            };
        }
        case ADD_COLUMN: {
            let column: ColumnWithTasks = { id: state.fakeColumnId--, title: "New Column", userId: null, position: state.columns.length, Task: [] }
            return {
                ...state,
                columns: [...state.columns, column.id],
                columnObject: {
                    ...state.columnObject,
                    [column.id]: column
                }
            };
        }
        case UPDATE_FAKE_COLUMN: {
            /* 
            Three things need to happen
            * DONE The id index needs to be switched to the correct one 
            * DONE The column object needs to have new id => new column
            * DONE The fake column has to be deleted
            * TODO The pending actions of the fake column need to be done
            */
            let { column } = action.payload
            let fakeColumnToUpdateIndex = state.columns.findIndex(id => id < 0)
            let fakeColumnToUpdateId = state.columns[fakeColumnToUpdateIndex]
            state.columns[fakeColumnToUpdateIndex] = column.id
            delete state.columnObject[fakeColumnToUpdateId]
            return {
                ...state,
                columnObject: {
                    ...state.columnObject,
                    [column.id]: column
                }
            };
        }
        case DELETE_COLUMN: {
            let { column } = action.payload
            delete state.columnObject[column.id]
            let columns = state.columns.filter(colId => colId != column.id)
            columns.forEach((columnId, index) => state.columnObject[columnId].position = index)
            return {
                ...state,
                columns
            }
        }
        case ADD_TASK: {
            let { task } = action.payload
            return {
                ...state,
                columnObject: {
                    ...state.columnObject,
                    [task.columnId]: {
                        ...state.columnObject[task.columnId],
                        Task: [...state.columnObject[task.columnId].Task, task.id]
                    }
                },
                taskObject: {
                    ...state.taskObject,
                    [task.id]: task
                }
            }
        }

        case ADD_HIDDEN_TASK: {
            let { task } = action.payload
            return {
                ...state,
                columnObject: {
                    ...state.columnObject,
                    [task.columnId]: {
                        ...state.columnObject[task.columnId],
                        hiddenTasks: [...state.columnObject[task.columnId].hiddenTasks, task.id]
                    }
                },
                taskObject: {
                    ...state.taskObject,
                    [task.id]: task
                }
            }
        }
        case DELETE_TASK: {
            let { task } = action.payload
            delete state.taskObject[task.id]
            let Task = state.columnObject[task.columnId].Task.filter(tId => tId != task.id)
            Task.forEach((taskId, index) => state.taskObject[taskId].position = index)
            return {
                ...state,
                columnObject: {
                    ...state.columnObject,
                    [task.columnId]: {
                        ...state.columnObject[task.columnId],
                        Task
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
