import { Dispatch } from "redux";
import { Task, TaskReduxAction } from "../../types";
import { apimiddleware } from "../../lib/apimiddleware";
import { ADD_TASK, ADD_HIDDEN_TASK, DELETE_TASK, UPDATE_TASK_ORDER } from "./task_types";

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

export const patchTask = (task: Task): (dispatch: Dispatch<any>) => Promise<void> => {
    return (dispatch: Dispatch<any>): Promise<void> => {
        return apimiddleware(
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

export const patchUnhideTask = (task: Task): (dispatch: Dispatch<any>) => Promise<void> => {
    return (dispatch: Dispatch<any>): Promise<void> => {
        return apimiddleware(
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

export const deleteTask = (task: Task): (dispatch: Dispatch<any>) => Promise<void> => {
    return (dispatch: Dispatch<any>): Promise<void> => {
        return apimiddleware(
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
