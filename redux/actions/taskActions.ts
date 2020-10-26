import { Dispatch } from "redux";
import { Task, TaskReduxAction } from "../../types";
import { apimiddleware } from "../../lib/apimiddleware";

export const ADD_TASK = "ADD_TASK";
export const DELETE_TASK = "DELETE_TASK";
export const UPDATE_TASK_ORDER = "UPDATE_TASK_ORDER";
export const ADD_HIDDEN_TASK = "ADD_HIDDEN_TASK";

const taskBaseEndpoint = "http://localhost:3000/api/task"

export const addTask: TaskReduxAction = (task) => ({
    type: ADD_TASK,
    payload: { task }
})

export const addHiddenTask: TaskReduxAction = (task) => ({
    type: ADD_HIDDEN_TASK,
    payload: { task }
})

export const removeTask: TaskReduxAction = (task) => ({
    type: DELETE_TASK,
    payload: { task }
})

export const changeTaskOrder: TaskReduxAction = (task) => ({
    type: UPDATE_TASK_ORDER,
    payload: { task }
})

export const patchUnhideTask = (task: Task): any => {
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

export const patchTask = (task: Task): any => {
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
