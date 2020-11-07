import { Dispatch } from "redux";
import { ColumnWithTasks, ColumnReduxAction, ReduxAction } from "../../types";
import { apimiddleware } from "../../lib/apimiddleware";
import { UPDATE_FAKE_COLUMN, ADD_COLUMN, DELETE_COLUMN, UPDATE_COLUMN_ORDER, CLEAR_PENDING_ACTIONS } from "./column_types";
import { ThunkAction, ThunkDispatch } from "redux-thunk";
import { deleteTaskRequest, patchTaskRequest } from "./task_actions";

const columnBaseEndpoint = "http://localhost:3000/api/column"

export const updateFakeColumnAction: ColumnReduxAction = (column) => ({
    type: UPDATE_FAKE_COLUMN,
    payload: { column }
})

export const addColumnAction = () => ({
    type: ADD_COLUMN,
    payload: {}
})

export const clearPendingActions = () => ({
    type: CLEAR_PENDING_ACTIONS,
    payload: {}
})

export const removeColumnAction: ColumnReduxAction = (column) => ({
    type: DELETE_COLUMN,
    payload: { column }
})

export const changeColumnOrderAction: ColumnReduxAction = (column) => ({
    type: UPDATE_COLUMN_ORDER,
    payload: { column }
})

export const completePendingRequests = (arr: any[]): any => {
    return (dispatch: Dispatch<any>): any => {
        for (let action of arr) {
            if (action.column) {
                if (action.action == "delete") {
                    dispatch(deleteColumnRequest(action.column))
                } else if (action.action == "update") {
                    dispatch(patchColumnRequest(action.column))
                }
            } else {
                if (action.action == "delete") {
                    dispatch(deleteTaskRequest(action.column))
                } else if (action.action == "update") {
                    dispatch(patchTaskRequest(action.column))
                }
            }

        }
        dispatch(clearPendingActions())
    }
}

export const updateColumnPosition = (column: ColumnWithTasks) => {
    if (column.id < 0) {
        return changeColumnOrderAction(column)
    }
    return patchColumnRequest(column, () => changeColumnOrderAction(column))
}

export const patchColumnRequest = (column: ColumnWithTasks, onStart = null, onSuccess = null, onError = null): (dispatch: Dispatch<any>) => Promise<void> => {
    return (dispatch: Dispatch<any>): Promise<void> => {
        return apimiddleware(
            {
                url: columnBaseEndpoint + "/" + column.id,
                method: "PATCH",
                data: JSON.stringify(column),
                onStart,
            },
            dispatch
        )
    }
};

export const postColumnRequest = (position: number): (dispatch: Dispatch<any>) => Promise<void> => {
    return (dispatch: Dispatch<any>): Promise<void> => {
        return apimiddleware(
            {
                url: columnBaseEndpoint,
                method: "POST",
                data: { title: "New Column", position },
                onStart: addColumnAction,
                onSuccess: updateFakeColumnAction,
            },
            dispatch
        )
    }
}

export const deleteColumn = (column: ColumnWithTasks) => {
    if (column.id < 0) {
        return removeColumnAction(column)
    }
    return deleteColumnRequest(column, () => removeColumnAction(column))
}

export const deleteColumnRequest = (column: ColumnWithTasks, onStart = null, onSuccess = null, onError = null): ThunkAction<Promise<void>, {}, {}, any> => {
    return (dispatch: ThunkDispatch<{}, {}, any>): Promise<void> => {
        return apimiddleware(
            {
                url: columnBaseEndpoint + "/" + column.id,
                method: "Delete",
                onStart,
                onSuccess,
                onError
            },
            dispatch
        )
    }
}