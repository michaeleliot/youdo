import { Dispatch } from "redux";
import { ColumnWithTasks, ReduxAction, Task } from "../../types";

export const ADD_COLUMN = "ADD_COLUMN";
export const ADD_TASK = "ADD_TASK";
export const DELETE_COLUMN = "DELETE_COLUMN";
export const DELETE_TASK = "DELETE_TASK";
export const UPDATE_TASK_ORDER = "UPDATE_TASK_ORDER";
export const UPDATE_COLUMN_ORDER = "UPDATE_COLUMN_ORDER";

export const addTask = (task: Task, columnId: number): ReduxAction => ({
    type: ADD_TASK,
    payload: { task, columnId }
})

export const removeTask = (taskId: number, columnId: number): ReduxAction => ({
    type: DELETE_TASK,
    payload: { taskId, columnId }
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

export const postTask = (columnId: number, position: number): any => {
    const body = { columnId, description: "New Task", position }
    return (dispatch: Dispatch<any>): void => {
        fetch(`http://localhost:3000/api/task`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        }).then(data => {
            return data.json()
        }).then(json => {
            dispatch(addTask(json, columnId))
        });
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


export const postColumn = (position: number): any => {
    const body = { title: 'New Column', position };
    return (dispatch: Dispatch<any>): void => {
        fetch(`http://localhost:3000/api/column`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        }).then(data => {
            return data.json()
        }).then(json => {
            dispatch(addColumn(json))
        });;
    }
};

export const deleteTask = (taskId: number, columnId: number) => {
    return (dispatch: Dispatch<any>): void => {
        fetch(`http://localhost:3000/api/task/${taskId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        }).then(() => {
            dispatch(removeTask(taskId, columnId))
        });
    }
}

export const deleteColumn = (columnId: number) => {
    return (dispatch: Dispatch<any>): void => {
        fetch(`http://localhost:3000/api/column/${columnId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        }).then(() => {
            dispatch(removeColumn(columnId))
        }).catch((err) => {
            console.log("Delete Column", err)
        });
    }
}