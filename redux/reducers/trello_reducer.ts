import { HYDRATE } from 'next-redux-wrapper';
import { ColumnWithTasks, Task } from '../../types';
import { UPDATE_TASK_ORDER, ADD_TASK, UPDATE_FAKE_TASK, DELETE_TASK } from '../actions/task_types';
import { UPDATE_COLUMN_ORDER, ADD_COLUMN, UPDATE_FAKE_COLUMN, DELETE_COLUMN, CLEAR_PENDING_ACTIONS } from '../actions/column_types';

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
    pendingActions: any[],
}

const initialState: TrelloState = {
    columns: [],
    fakeColumnId: -1,
    fakeTaskId: -1,
    columnObject: {},
    taskObject: {},
    pendingActions: [],
}

const trelloReducer = (state = initialState, action): TrelloState => {
    switch (action.type) {
        case HYDRATE:
            // Attention! This will overwrite client state! Real apps should use proper reconciliation.
            return { ...state, ...action.payload };
        case UPDATE_TASK_ORDER: {
            //TODO Update this so that it will add effected columns to batch update
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
            let containsFakeColumn = state.columns.findIndex(columnId => columnId < 0) != -1
            return {
                ...state,
                columns: columnCopy,
                columnObject: {
                    ...state.columnObject,
                    [column.id]: {
                        ...oldColumn,
                        position: column.position
                    }
                },
                pendingActions: containsFakeColumn ? [...state.pendingActions, { column, action: "update" }] : state.pendingActions
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
            let { column } = action.payload
            let fakeColumnToUpdateIndex = state.columns.findIndex(id => id < 0)
            if (fakeColumnToUpdateIndex != -1) {
                let fakeColumnToUpdateId = state.columns[fakeColumnToUpdateIndex]
                let fakeColumn = state.columnObject[fakeColumnToUpdateId]
                let newColumn = { ...column, position: fakeColumn.position, Task: fakeColumn.Task }
                state.columns[fakeColumnToUpdateIndex] = column.id
                delete state.columnObject[fakeColumnToUpdateId]
                return {
                    ...state,
                    columnObject: {
                        ...state.columnObject,
                        [column.id]: newColumn
                    },
                    pendingActions: state.pendingActions.map(action => action.column && action.column.id == fakeColumnToUpdateId ? { ...action, column: newColumn } : action)
                };
            } else {
                let deletedFakeColumn: ColumnWithTasks = state.pendingActions.find(action => action.column.id < 0).column

                return {
                    ...state,
                    pendingActions: state.pendingActions.map(action => action.column.id == deletedFakeColumn.id ? { ...action, column } : action)
                }
            }
        }
        case DELETE_COLUMN: {
            let { column } = action.payload
            delete state.columnObject[column.id]
            let columns = state.columns.filter(colId => colId != column.id)
            columns.forEach((columnId, index) => state.columnObject[columnId].position = index)
            return {
                ...state,
                columns,
                pendingActions: column.id < 0 ? [...state.pendingActions, { column, action: "delete" }] : state.pendingActions
            }

        }
        case ADD_TASK: {
            let { columnId } = action.payload
            let fakeTask: Task = {
                id: state.fakeTaskId--,
                position: state.columnObject[columnId].Task.length,
                description: "New Task",
                completed: false,
                columnId,
                isFake: true,
            }
            return {
                ...state,
                columnObject: {
                    ...state.columnObject,
                    [columnId]: {
                        ...state.columnObject[columnId],
                        Task: [...state.columnObject[columnId].Task, fakeTask.id]
                    }
                },
                taskObject: {
                    ...state.taskObject,
                    [fakeTask.id]: fakeTask
                }
            }
        }

        case UPDATE_FAKE_TASK: {
            let { task } = action.payload
            let column = state.columnObject[task.columnId]
            let fakeTaskToUpdateIndex = column.Task.findIndex(id => id < 0)
            let fakeTaskToUpdateId = column.Task[fakeTaskToUpdateIndex]
            column.Task[fakeTaskToUpdateIndex] = task.id
            delete state.taskObject[fakeTaskToUpdateId]
            return {
                ...state,
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

        case CLEAR_PENDING_ACTIONS: {
            return {
                ...state,
                pendingActions: []
            }
        }

        default:
            return {
                ...state
            };
    }
};

export default trelloReducer;
