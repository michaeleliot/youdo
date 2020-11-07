import { Dispatch } from "redux";
import { Task, TaskReduxAction } from "../../types";
import { apimiddleware } from "../../lib/apimiddleware";
import { ADD_TASK, UPDATE_FAKE_TASK, DELETE_TASK, UPDATE_TASK_ORDER } from "./task_types";

const taskBaseEndpoint = "http://localhost:3000/api/task"

export const addTask = (columnId: number) => ({
    type: ADD_TASK,
    payload: { columnId }
})

export const updateFakeTask: TaskReduxAction = (task) => ({
    type: UPDATE_FAKE_TASK,
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
                url: taskBaseEndpoint + "/" + task.id,
                method: "PATCH",
                data: JSON.stringify(task),
                onStart: () => changeTaskOrder(task),
            },
            dispatch
        )
    }
};

export const postTask = (columnId: number, position: number): (dispatch: Dispatch<any>) => Promise<void> => {
    return (dispatch: Dispatch<any>): Promise<void> => {
        return apimiddleware(
            {
                url: taskBaseEndpoint,
                method: "POST",
                data: { columnId, description: "New Task", position },
                onStart: () => addTask(columnId),
                onSuccess: updateFakeTask,
            },
            dispatch
        )
    }
};

export const deleteTask = (task: Task): (dispatch: Dispatch<any>) => Promise<void> => {
    return (dispatch: Dispatch<any>): Promise<void> => {
        return apimiddleware(
            {
                url: taskBaseEndpoint + "/" + task.id,
                method: "DELETE",
                onStart: () => removeTask(task),
            },
            dispatch
        )
    }
};
