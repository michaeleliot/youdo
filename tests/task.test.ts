import * as actions from '../redux/actions/task_actions'
import * as types from '../redux/actions/task_types'

import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import axios from 'axios'

jest.mock('axios');

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('actions', () => {
    const task = { id: 1, description: "Test Task", columnId: 1, position: 0, hidden: false, completed: false }
    it('should create an action to add a task', () => {
        const expectedAction = {
            type: types.ADD_TASK,
            payload: { task }
        }
        expect(actions.addTask(task)).toEqual(expectedAction)
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
    it('should create an action to add a hidden column', () => {
        const expectedAction = {
            type: types.ADD_HIDDEN_TASK,
            payload: { task }
        }
        expect(actions.addHiddenTask(task)).toEqual(expectedAction)
    })
})

describe('async actions', () => {
    let task = { id: 1, description: "Test Task 1", columnId: 1, position: 0, hidden: false, completed: false }
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
    it('patchUnhideColumn calls ADD_COLUMN and then ADD_HIDDEN_COLUMN', () => {
        let newHiddenTask = { id: 2, description: "Test Task 2", columnId: 1, position: null, hidden: true, completed: false }
        let mockedRequest = axios.request as jest.Mock
        mockedRequest.mockResolvedValue({ data: newHiddenTask });
        const expectedActions = [
            { type: types.ADD_TASK, payload: { task } },
            { type: types.ADD_HIDDEN_TASK, payload: { task: newHiddenTask } },
        ]
        const store = mockStore({})
        return store.dispatch(actions.patchUnhideTask(task)).then(() => {
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