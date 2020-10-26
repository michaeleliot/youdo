import { Dispatch } from "redux";
import { ColumnWithTasks, ColumnReduxAction } from "../../types";
import { apimiddleware } from "../../lib/apimiddleware";

export const ADD_COLUMN = "ADD_COLUMN";
export const DELETE_COLUMN = "DELETE_COLUMN";
export const UPDATE_COLUMN_ORDER = "UPDATE_COLUMN_ORDER";
export const ADD_HIDDEN_COLUMN = "ADD_HIDDEN_COLUMN";

const columnBaseEndpoint = "http://localhost:3000/api/column"

export const addHiddenColumn: ColumnReduxAction = (column) => ({
    type: ADD_HIDDEN_COLUMN,
    payload: { column }
})

export const addColumn: ColumnReduxAction = (column) => ({
    type: ADD_COLUMN,
    payload: { column }
})

export const removeColumn: ColumnReduxAction = (column) => ({
    type: DELETE_COLUMN,
    payload: { column }
})

export const changeColumnOrder: ColumnReduxAction = (column) => ({
    type: UPDATE_COLUMN_ORDER,
    payload: { column }
})


export const patchColumn = (column: ColumnWithTasks): any => {
    return (dispatch: Dispatch<any>): void => {
        apimiddleware(
            {
                url: `${columnBaseEndpoint}/${column.id}`,
                method: "PATCH",
                data: JSON.stringify(column),
                onStart: () => changeColumnOrder(column),
            },
            dispatch
        )
    }
};

export const patchUnhideColumn = (column: ColumnWithTasks): any => {
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

export const deleteColumn = (column: ColumnWithTasks): any => {
    return (dispatch: Dispatch<any>): void => {
        apimiddleware(
            {
                url: `${columnBaseEndpoint}/${column.id}`,
                method: "Delete",
                onStart: () => removeColumn(column),
            },
            dispatch
        )
    }
}