import { Dispatch } from "redux";
import { ColumnWithTasks, ColumnReduxAction } from "../../types";
import { apimiddleware } from "../../lib/apimiddleware";
import { ADD_HIDDEN_COLUMN, ADD_COLUMN, DELETE_COLUMN, UPDATE_COLUMN_ORDER } from "./column_types";

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


export const patchColumn = (column: ColumnWithTasks): (dispatch: Dispatch<any>) => Promise<void> => {
    return (dispatch: Dispatch<any>): Promise<void> => {
        return apimiddleware(
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

export const patchUnhideColumn = (column: ColumnWithTasks): (dispatch: Dispatch<any>) => Promise<void> => {
    return (dispatch: Dispatch<any>): Promise<void> => {
        return apimiddleware(
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

export const deleteColumn = (column: ColumnWithTasks): (dispatch: Dispatch<any>) => Promise<void> => {
    return (dispatch: Dispatch<any>): Promise<void> => {
        return apimiddleware(
            {
                url: `${columnBaseEndpoint}/${column.id}`,
                method: "Delete",
                onStart: () => removeColumn(column),
            },
            dispatch
        )
    }
}