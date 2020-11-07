import * as actions from '../redux/actions/task_actions'
import * as types from '../redux/actions/task_types'

import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import axios from 'axios'

jest.mock('axios');

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('actions', () => {
    const task = { id: 1, description: "Test Task", columnId: 1, position: 0, completed: false }
    it('should create an action to add a task', () => {
        const expectedAction = {
            type: types.ADD_TASK,
            payload: { columnId: task.columnId }
        }
        expect(actions.addTask(task.columnId)).toEqual(expectedAction)
    })
    it('should create an action to delete a column', () => {
        const expectedAction = {
            type: types.DELETE_TASK,
            payload: { task }
        }
        expect(actions.removeTask(task)).toEqual(expectedAction)
    })
    it('should create an action to reorder the column', () => {
        const expectedAction = {
            type: types.UPDATE_TASK_ORDER,
            payload: { task }
        }
        expect(actions.changeTaskOrder(task)).toEqual(expectedAction)
    })
    it('should create an action to update a fake task', () => {
        const expectedAction = {
            type: types.UPDATE_FAKE_TASK,
            payload: { task }
        }
        expect(actions.updateFakeTask(task)).toEqual(expectedAction)
    })
})

describe('async actions', () => {
    let task = { id: 1, description: "Test Task 1", columnId: 1, position: 0, completed: false }
    it('patchTask calls UPDATE_TASK_ORDER', () => {
        let mockedRequest = axios.request as jest.Mock
        mockedRequest.mockResolvedValue({ data: task });
        const expectedActions = [
            { type: types.UPDATE_TASK_ORDER, payload: { task } },
        ]
        const store = mockStore({})
        return store.dispatch(actions.patchTask(task)).then(() => {
            expect(store.getActions()).toEqual(expectedActions)
        })
    })
    it('patchUnhideColumn calls ADD_COLUMN and then UPDATE_FAKE_TASK', () => {
        let mockedRequest = axios.request as jest.Mock
        mockedRequest.mockResolvedValue({ data: task });
        const expectedActions = [
            { type: types.ADD_TASK, payload: { columnId: 1 } },
            { type: types.UPDATE_FAKE_TASK, payload: { task } },
        ]
        const store = mockStore({})
        return store.dispatch(actions.postTask(task.columnId, 0)).then(() => {
            expect(store.getActions()).toEqual(expectedActions)
        })
    })
    it('deleteColumn calls DELETE_COLUMN', () => {
        let mockedRequest = axios.request as jest.Mock
        mockedRequest.mockResolvedValue({});
        const expectedActions = [
            { type: types.DELETE_TASK, payload: { task } },
        ]
        const store = mockStore({})
        return store.dispatch(actions.deleteTask(task)).then(() => {
            expect(store.getActions()).toEqual(expectedActions)
        })
    })
})