import * as task_types from '../redux/actions/task_types'
import * as column_types from '../redux/actions/column_types'

import reducer, { TrelloState } from '../redux/reducers/trello_reducer'

let initialState: TrelloState = {
    columns: [],
    hiddenColumns: [],
    columnObject: {},
    taskObject: {}
}
let testState: TrelloState;

function resetTestState(): TrelloState {
    return {
        columns: [1, 2, 3],
        hiddenColumns: [4, 5, 6],
        columnObject: {
            1: { id: 1, title: "Test Column 1", userId: 1, position: 0, hidden: false, Task: [1, 2, 3], hiddenTasks: [4, 5, 6] },
            2: { id: 2, title: "Test Column 2", userId: 1, position: 1, hidden: false, Task: [], hiddenTasks: [] },
            3: { id: 3, title: "Test Column 3", userId: 1, position: 2, hidden: false, Task: [], hiddenTasks: [] },
            4: { id: 4, title: "Test Column 4", userId: 1, position: null, hidden: true, Task: [], hiddenTasks: [] },
            5: { id: 5, title: "Test Column 5", userId: 1, position: null, hidden: true, Task: [], hiddenTasks: [] },
            6: { id: 6, title: "Test Column 6", userId: 1, position: null, hidden: true, Task: [], hiddenTasks: [] }
        },
        taskObject: {
            1: { id: 1, description: "Test Task 1", columnId: 1, position: 0, hidden: false, completed: false },
            2: { id: 2, description: "Test Task 2", columnId: 1, position: 1, hidden: false, completed: false },
            3: { id: 3, description: "Test Task 3", columnId: 1, position: 2, hidden: false, completed: false },
            4: { id: 4, description: "Test Task 4", columnId: 1, position: 0, hidden: true, completed: false },
            5: { id: 5, description: "Test Task 5", columnId: 1, position: 0, hidden: true, completed: false },
            6: { id: 6, description: "Test Task 6", columnId: 1, position: 0, hidden: true, completed: false },
        }
    }
}

describe('trello reducer - column actions', () => {
    beforeEach(() => {
        testState = resetTestState()
    })
    it('should return the initial state', () => {
        expect(reducer(undefined, {})).toEqual(initialState)
    })
    it('should handle ADD_COLUMN', () => {
        let fourthColumn = { ...testState.columnObject[4], position: 3, hidden: false }
        expect(reducer(testState, {
            type: column_types.ADD_COLUMN,
            payload: { column: fourthColumn }
        })).toEqual({
            ...testState,
            columns: [1, 2, 3, 4],
            hiddenColumns: [5, 6],
            columnObject: {
                ...testState.columnObject,
                4: { ...testState.columnObject[4], position: 3, hidden: false },
            },
        })
    })
    it('should handle ADD_HIDDEN_COLUMN', () => {
        let seventhColumn = { id: 7, title: "Test Column 7", userId: 1, position: null, hidden: true, Task: [], hiddenTasks: [] }
        expect(reducer(testState, {
            type: column_types.ADD_HIDDEN_COLUMN,
            payload: { column: seventhColumn }
        })).toEqual({
            ...testState,
            columns: [1, 2, 3],
            hiddenColumns: [4, 5, 6, 7],
            columnObject: {
                ...testState.columnObject,
                7: seventhColumn,
            },
        })
    })
    it('should handle DELETE_COLUMN', () => {
        let thirdColumn = { ...testState.columnObject[2] }
        expect(reducer(testState, {
            type: column_types.DELETE_COLUMN,
            payload: { column: thirdColumn }
        })).toEqual({
            ...testState,
            columns: [1, 3],
            columnObject: {
                ...testState.columnObject,
                3: { ...testState.columnObject[3], position: 1 }
            }
        })
    })
    it('should handle UPDATE_COLUMN_ORDER', () => {
        let updatedThirdColumn = { ...testState.columnObject[3], position: 0 }
        expect(reducer(testState, {
            type: column_types.UPDATE_COLUMN_ORDER,
            payload: { column: updatedThirdColumn }
        })).toEqual({
            ...testState,
            columns: [3, 1, 2],
            columnObject: {
                ...testState.columnObject,
                1: { ...testState.columnObject[1], position: 1 },
                2: { ...testState.columnObject[2], position: 2, },
                3: { ...testState.columnObject[3], position: 0 },
            },
        })
    })
})

describe('trello reducer - task actions', () => {
    beforeEach(() => {
        testState = resetTestState()
    })
    it('should handle ADD_TASK', () => {
        let newTask = { ...testState.taskObject[4], position: 3, hidden: false }
        expect(reducer(testState, {
            type: task_types.ADD_TASK,
            payload: { task: newTask }
        })).toEqual({
            ...testState,
            columnObject: {
                ...testState.columnObject,
                1: { ...testState.columnObject[1], Task: [1, 2, 3, 4], hiddenTasks: [5, 6] },
            },
            taskObject: {
                ...testState.taskObject,
                4: newTask
            }
        })
    })
    it('should handle DELETE_TASK', () => {
        let secondTask = { ...testState.taskObject[2] }
        expect(reducer(testState, {
            type: task_types.DELETE_TASK,
            payload: { task: secondTask }
        })).toEqual({
            ...testState,
            columnObject: {
                ...testState.columnObject,
                1: { ...testState.columnObject[1], Task: [1, 3], hiddenTasks: [4, 5, 6] },
            },
            taskObject: {
                ...testState.taskObject,
                3: { ...testState.taskObject[3], position: 1 }
            }
        })
    })
    it('should handle UPDATE_TASK_ORDER when moving within a column', () => {
        let updatedThirdTask = { ...testState.taskObject[3], position: 0 }
        expect(reducer(testState, {
            type: task_types.UPDATE_TASK_ORDER,
            payload: { task: updatedThirdTask }
        })).toEqual({
            ...testState,
            columnObject: {
                ...testState.columnObject,
                1: { ...testState.columnObject[1], Task: [3, 1, 2] },
            },
            taskObject: {
                ...testState.taskObject,
                1: { ...testState.taskObject[1], position: 1 },
                2: { ...testState.taskObject[2], position: 2 },
                3: { ...testState.taskObject[3], position: 0 },
            },
        })
    })
    it('should handle UPDATE_TASK_ORDER when moving between columns', () => {
        let updatedThirdTask = { ...testState.taskObject[3], position: 0, columnId: 2 }
        expect(reducer(testState, {
            type: task_types.UPDATE_TASK_ORDER,
            payload: { task: updatedThirdTask }
        })).toEqual({
            ...testState,
            columnObject: {
                ...testState.columnObject,
                1: { ...testState.columnObject[1], Task: [1, 2] },
                2: { ...testState.columnObject[2], Task: [3] },
            },
            taskObject: {
                ...testState.taskObject,
                3: { ...testState.taskObject[3], position: 0, columnId: 2 },
            },
        })
    })
    it('should handle ADD_HIDDEN_TASK', () => {
        let seventhTask = { id: 7, title: "Test Task 7", userId: 1, position: null, hidden: true, completed: false, columnId: 1 }
        expect(reducer(testState, {
            type: task_types.ADD_HIDDEN_TASK,
            payload: { task: seventhTask }
        })).toEqual({
            ...testState,
            columnObject: {
                ...testState.columnObject,
                1: { ...testState.columnObject[1], hiddenTasks: [4, 5, 6, 7] },
            },
            taskObject: {
                ...testState.taskObject,
                7: seventhTask,
            }
        })
    })
})