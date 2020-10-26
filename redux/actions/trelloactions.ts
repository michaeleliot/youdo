import { Dispatch } from "redux";
import { ColumnWithTasks, ReduxAction, Task } from "../../types";
import { apimiddleware } from "../../lib/apimiddleware";

export const ADD_COLUMN = "ADD_COLUMN";
export const ADD_TASK = "ADD_TASK";
export const DELETE_COLUMN = "DELETE_COLUMN";
export const DELETE_TASK = "DELETE_TASK";
export const UPDATE_TASK_ORDER = "UPDATE_TASK_ORDER";
export const UPDATE_COLUMN_ORDER = "UPDATE_COLUMN_ORDER";
export const ADD_HIDDEN_TASK = "ADD_HIDDEN_TASK";
export const ADD_HIDDEN_COLUMN = "ADD_HIDDEN_COLUMN";

const taskBaseEndpoint = "http://localhost:3000/api/task"
const columnBaseEndpoint = "http://localhost:3000/api/column"


export const addTask = (task: Task): ReduxAction => ({
    type: ADD_TASK,
    payload: { task }
})

export const addHiddenTask = (task: Task): ReduxAction => ({
    type: ADD_HIDDEN_TASK,
    payload: { task }
})

export const addHiddenColumn = (column: Task): ReduxAction => ({
    type: ADD_HIDDEN_COLUMN,
    payload: { column }
})

export const removeTask = (task: Task): ReduxAction => ({
    type: DELETE_TASK,
    payload: { task }
})

export const addColumn = (column: ColumnWithTasks): ReduxAction => ({
    type: ADD_COLUMN,
    payload: { column }
})

export const removeColumn = (columnId: number): ReduxAction => ({
    type: DELETE_COLUMN,
    payload: { columnId }
})

export const changeTaskOrder = (task: Task): ReduxAction => ({
    type: UPDATE_TASK_ORDER,
    payload: { task }
})

export const changeColumnOrder = (column: ColumnWithTasks): ReduxAction => ({
    type: UPDATE_COLUMN_ORDER,
    payload: { column }
})

export const postTask = (task: Task): any => {
    return (dispatch: Dispatch<any>): void => {
        apimiddleware(
            {
                url: `${taskBaseEndpoint}/${task.id}`,
                method: "PATCH",
                data: JSON.stringify(task),
                onStart: () => addTask(task),
                onSuccess: addHiddenTask,
            },
            dispatch
        )
    }
};

export const updateTask = (task: Task): any => {
    return (dispatch: Dispatch<any>): void => {
        apimiddleware(
            {
                url: `${taskBaseEndpoint}/${task.id}`,
                method: "PATCH",
                data: JSON.stringify(task),
                onStart: () => changeTaskOrder(task),
            },
            dispatch
        )
    }
};



export const updateColumn = (column: ColumnWithTasks): any => {
    return (dispatch: Dispatch<any>): void => {
        apimiddleware(
            {
                url: `${columnBaseEndpoint}/${column.id}`,
                method: "PATCH",
                data: JSON.stringify(column),
                onStart: () => changeColumnOrder(column),
                onSuccess: addHiddenTask,
            },
            dispatch
        )
    }
};


export const postColumn = (column: ColumnWithTasks): any => {
    return (dispatch: Dispatch<any>): void => {
        apimiddleware(
            {
                url: `${columnBaseEndpoint}/${column.id}`,
                method: "PATCH",
                data: JSON.stringify(column),
                onStart: () => addColumn(column),
                onSuccess: addHiddenColumn,
            },
            dispatch
        )
    }
}

export const deleteTask = (task: Task): any => {
    return (dispatch: Dispatch<any>): void => {
        apimiddleware(
            {
                url: `${taskBaseEndpoint}/${task.id}`,
                method: "DELETE",
                data: JSON.stringify(task),
                onStart: () => removeTask(task),
            },
            dispatch
        )
    }
};

export const deleteColumn = (columnId: number): any => {
    return (dispatch: Dispatch<any>): void => {
        apimiddleware(
            {
                url: `${columnBaseEndpoint}/${columnId}`,
                method: "Delete",
                onStart: () => removeColumn(columnId),
                onSuccess: addHiddenColumn,
            },
            dispatch
        )
    }
}