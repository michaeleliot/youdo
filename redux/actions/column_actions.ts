import { Dispatch } from "redux";
import { ColumnWithTasks, ColumnReduxAction } from "../../types";
import { apimiddleware } from "../../lib/apimiddleware";
import { UPDATE_FAKE_COLUMN, ADD_COLUMN, DELETE_COLUMN, UPDATE_COLUMN_ORDER } from "./column_types";

const columnBaseEndpoint = "http://localhost:3000/api/column"

export const updateFakeColumn: ColumnReduxAction = (column) => ({
    type: UPDATE_FAKE_COLUMN,
    payload: { column }
})

export const addColumn: ColumnReduxAction = () => ({
    type: ADD_COLUMN,
    payload: {}
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
                url: columnBaseEndpoint + "/" + column.id,
                method: "PATCH",
                data: JSON.stringify(column),
                onStart: () => changeColumnOrder(column),
            },
            dispatch
        )
    }
};

export const postColumn = (): (dispatch: Dispatch<any>) => Promise<void> => {
    return (dispatch: Dispatch<any>): Promise<void> => {
        return apimiddleware(
            {
                url: columnBaseEndpoint,
                method: "POST",
                onStart: addColumn,
                onSuccess: updateFakeColumn,
            },
            dispatch
        )
    }
}

export const deleteColumn = (column: ColumnWithTasks): (dispatch: Dispatch<any>) => Promise<void> => {
    return (dispatch: Dispatch<any>): Promise<void> => {
        return apimiddleware(
            {
                url: columnBaseEndpoint + "/" + column.id,
                method: "Delete",
                onStart: () => removeColumn(column),
            },
            dispatch
        )
    }
}