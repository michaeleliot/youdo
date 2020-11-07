import * as actions from '../redux/actions/column_actions'
import * as types from '../redux/actions/column_types'

import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import axios from 'axios'
import { Column, ColumnWhereInput } from '@prisma/client'
import { ColumnWithTasks } from '../types'

jest.mock('axios');

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('actions', () => {
    const column: ColumnWithTasks = { id: 1, title: "Test Column", userId: 1, position: 0, Task: [] }

    it('ADD_COLUMN should create an action to add a column', () => {
        const expectedAction = {
            type: types.ADD_COLUMN,
            payload: {}
        }
        expect(actions.addColumnAction()).toEqual(expectedAction)
    })
    it('DELETE_COLUMN should create an action to delete a column', () => {
        const expectedAction = {
            type: types.DELETE_COLUMN,
            payload: { column }
        }
        expect(actions.removeColumnAction(column)).toEqual(expectedAction)
    })
    it('UPDATE_COLUMN_ORDER should create an action to reorder the column', () => {
        const expectedAction = {
            type: types.UPDATE_COLUMN_ORDER,
            payload: { column }
        }
        expect(actions.changeColumnOrderAction(column)).toEqual(expectedAction)
    })
    it('UPDATE_FAKE_COLUMN should update a fake column', () => {
        const expectedAction = {
            type: types.UPDATE_FAKE_COLUMN,
            payload: { column }
        }
        expect(actions.updateFakeColumnAction(column)).toEqual(expectedAction)
    })
    it('CLEAR_PENDING_ACTIONS should clear pending actions', () => {
        const expectedAction = {
            type: types.CLEAR_PENDING_ACTIONS,
            payload: {}
        }
        expect(actions.clearPendingActions()).toEqual(expectedAction)
    })
})

describe('async actions', () => {
    let column: ColumnWithTasks = { id: 1, title: "Test Column 1", userId: 1, position: 2, Task: [1, 2, 3] }

    it('patchColumn calls UPDATE_COLUMN_ORDER', () => {
        let mockedRequest = axios.request as jest.Mock
        mockedRequest.mockResolvedValue({ data: column });
        const expectedActions = [
            { type: types.UPDATE_COLUMN_ORDER, payload: { column } },
        ]
        const store = mockStore({})
        return store.dispatch(actions.patchColumnRequest(column)).then(() => {
            expect(store.getActions()).toEqual(expectedActions)
        })
    })
    it('postColumn calls ADD_COLUMN and then UPDATE_FAKE_COLUMN', () => {
        let newColumn: ColumnWithTasks = { id: 2, title: "Test Column 2", userId: 1, position: 0, Task: [] }
        let mockedRequest = axios.request as jest.Mock
        mockedRequest.mockResolvedValue({ data: newColumn });
        const expectedActions = [
            { type: types.ADD_COLUMN, payload: {} },
            { type: types.UPDATE_FAKE_COLUMN, payload: { column: newColumn } },
        ]
        const store = mockStore({})
        return store.dispatch(actions.postColumnRequest(0)).then(() => {
            expect(store.getActions()).toEqual(expectedActions)
        })
    })
    it('deleteColumn calls DELETE_COLUMN', () => {
        let mockedRequest = axios.request as jest.Mock
        mockedRequest.mockResolvedValue({});
        const expectedActions = [
            { type: types.DELETE_COLUMN, payload: { column } },
        ]
        const store = mockStore({})
        return store.dispatch(actions.deleteColumn(column)).then(() => {
            expect(store.getActions()).toEqual(expectedActions)
        })
    })
})