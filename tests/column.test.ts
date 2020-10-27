import * as actions from '../redux/actions/column_actions'
import * as types from '../redux/actions/column_types'

import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import axios from 'axios'

jest.mock('axios');

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('actions', () => {
    const column = { id: 1, title: "Test Column", userId: 1, position: 0, hidden: false, Task: [], hiddenTasks: [] }

    it('should create an action to add a column', () => {
        const expectedAction = {
            type: types.ADD_COLUMN,
            payload: { column }
        }
        expect(actions.addColumn(column)).toEqual(expectedAction)
    })
    it('should create an action to delete a column', () => {
        const expectedAction = {
            type: types.DELETE_COLUMN,
            payload: { column }
        }
        expect(actions.removeColumn(column)).toEqual(expectedAction)
    })
    it('should create an action to reorder the column', () => {
        const expectedAction = {
            type: types.UPDATE_COLUMN_ORDER,
            payload: { column }
        }
        expect(actions.changeColumnOrder(column)).toEqual(expectedAction)
    })
    it('should create an action to add a hidden column', () => {
        const expectedAction = {
            type: types.ADD_HIDDEN_COLUMN,
            payload: { column }
        }
        expect(actions.addHiddenColumn(column)).toEqual(expectedAction)
    })
})

describe('async actions', () => {
    let column = { id: 1, title: "Test Column 1", userId: 1, position: 2, hidden: false, Task: [1, 2, 3], hiddenTasks: [4, 5, 6] }

    it('patchColumn calls UPDATE_COLUMN_ORDER', () => {
        let mockedRequest = axios.request as jest.Mock
        mockedRequest.mockResolvedValue({ data: column });
        const expectedActions = [
            { type: types.UPDATE_COLUMN_ORDER, payload: { column } },
        ]
        const store = mockStore({})
        return store.dispatch(actions.patchColumn(column)).then(() => {
            expect(store.getActions()).toEqual(expectedActions)
        })
    })
    it('patchUnhideColumn calls ADD_COLUMN and then ADD_HIDDEN_COLUMN', () => {
        let newHiddenColumn = { id: 2, title: "Test Column 2", userId: 1, position: null, hidden: true, Task: [], hiddenTasks: [] }
        let mockedRequest = axios.request as jest.Mock
        mockedRequest.mockResolvedValue({ data: newHiddenColumn });
        const expectedActions = [
            { type: types.ADD_COLUMN, payload: { column } },
            { type: types.ADD_HIDDEN_COLUMN, payload: { column: newHiddenColumn } },
        ]
        const store = mockStore({})
        return store.dispatch(actions.patchUnhideColumn(column)).then(() => {
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