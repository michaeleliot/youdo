import { Dispatch } from "redux";
import { ColumnWithTasks, ReduxAction, Task } from "../../types";

export const ADD_COLUMN = "ADD_COLUMN";
export const ADD_TASK = "ADD_TASK";
export const DELETE_COLUMN = "DELETE_COLUMN";
export const DELETE_TASK = "DELETE_TASK";
export const UPDATE_TASK_ORDER = "UPDATE_TASK_ORDER";
export const UPDATE_COLUMN_ORDER = "UPDATE_COLUMN_ORDER";
export const ADD_HIDDEN_TASK = "ADD_HIDDEN_TASK";
export const ADD_HIDDEN_COLUMN = "ADD_HIDDEN_COLUMN";


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
    const body = { ...task, hidden: false }
    console.log("post task", task, body)
    return (dispatch: Dispatch<any>): void => {
        dispatch(addTask(body))
        fetch(`http://localhost:3000/api/task/${task.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        }).then(data => {
            return data.json()
        }).then(data => {
            dispatch(addHiddenTask(data))
        })
    }
};

export const updateTask = (task: Task): any => {
    return (dispatch: Dispatch<any>): void => {
        dispatch(changeTaskOrder(task))
        fetch(`http://localhost:3000/api/task/${task.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(task),
        });
    }
};

export const updateColumn = (column: ColumnWithTasks): any => {
    return (dispatch: Dispatch<any>): void => {
        dispatch(changeColumnOrder(column))
        fetch(`http://localhost:3000/api/column/${column.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(column),
        });
    }
};


export const postColumn = (column: ColumnWithTasks): any => {
    return (dispatch: Dispatch<any>): void => {
        dispatch(addColumn(column))
        fetch(`http://localhost:3000/api/column/${column.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(column),
        }).then(data => {
            return data.json()
        }).then(data => {
            dispatch(addHiddenColumn(data))
        })
    }
};

export const deleteTask = (task: Task) => {
    return (dispatch: Dispatch<any>): void => {
        dispatch(removeTask(task))
        fetch(`http://localhost:3000/api/task/${task.id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        }).catch((err) => {
            console.log("Delete Task", err)
        });
    }
}

export const deleteColumn = (columnId: number) => {
    return (dispatch: Dispatch<any>): void => {
        dispatch(removeColumn(columnId))
        fetch(`http://localhost:3000/api/column/${columnId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        }).catch((err) => {
            console.log("Delete Column", err)
        });
    }
}