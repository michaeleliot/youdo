import { Dispatch } from "redux";

export const ADD_COLUMN = "ADD_COLUMN";
export const ADD_TASK = "ADD_TASK";
export const DELETE_COLUMN = "DELETE_COLUMN";
export const DELETE_TASK = "DELETE_TASK";
export const UPDATE_TASK_ORDER = "UPDATE_TASK_ORDER"

export const addTask = (task, columnId) => ({
    type: ADD_TASK,
    payload: { task, columnId }
})
export const removeTask = (taskId, columnId) => ({
    type: DELETE_TASK,
    payload: { taskId, columnId }
})
export const addColumn = (column) => ({
    type: ADD_COLUMN,
    payload: column
})
export const removeColumn = (columnId) => ({
    type: DELETE_COLUMN,
    payload: columnId
})

export const changeTaskOrder = (task) => ({
    type: UPDATE_TASK_ORDER,
    payload: task
})

export const postTask = (columnId, position): any => {
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

export const updateTask = (task): any => {
    return (dispatch: Dispatch<any>): void => {
        dispatch(changeTaskOrder(task))
        fetch(`http://localhost:3000/api/task/${task.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(task),
        });
    }
};


export const postColumn = (position): any => {
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

export const deleteTask = (taskId, columnId) => {
    return (dispatch: Dispatch<any>): void => {
        fetch(`http://localhost:3000/api/task/${taskId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        }).then(() => {
            dispatch(removeTask(taskId, columnId))
        });
    }
}

export const deleteColumn = (columnId) => {
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