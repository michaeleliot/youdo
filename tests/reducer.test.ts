import * as task_types from '../redux/actions/task_types'
import * as column_types from '../redux/actions/column_types'

import reducer, { TrelloState } from '../redux/reducers/trello_reducer'
import { ColumnWithTasks, Task } from '../types';

let initialState: TrelloState = {
    columns: [],
    fakeColumnId: -1,
    fakeTaskId: -1,
    columnObject: {},
    taskObject: {},
    pendingActions: []
}
let testState: TrelloState;

function resetTestState(): TrelloState {
    return {
        pendingActions: [],
        fakeColumnId: -1,
        fakeTaskId: -1,
        columns: [1, 2, 3],
        columnObject: {
            1: { id: 1, title: "Test Column 1", userId: 1, position: 0, Task: [1, 2, 3] },
            2: { id: 2, title: "Test Column 2", userId: 1, position: 1, Task: [] },
            3: { id: 3, title: "Test Column 3", userId: 1, position: 2, Task: [] },
        },
        taskObject: {
            1: { id: 1, description: "Test Task 1", columnId: 1, position: 0, completed: false },
            2: { id: 2, description: "Test Task 2", columnId: 1, position: 1, completed: false },
            3: { id: 3, description: "Test Task 3", columnId: 1, position: 2, completed: false },
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
        expect(reducer(testState, {
            type: column_types.ADD_COLUMN,
            payload: {}
        })).toEqual({
            ...testState,
            columns: [1, 2, 3, -1],
            columnObject: {
                ...testState.columnObject,
                "-1": {
                    id: -1,
                    title: "New Column",
                    userId: null,
                    position: 3,
                    Task: [],
                }
            },
            fakeColumnId: -2,
        })
    })
    it('should handle UPDATE_FAKE_COLUMN', () => {
        let newColumn: ColumnWithTasks = { id: 7, title: "New Column", userId: 1, position: 3, Task: [] }
        testState = reducer(testState, {
            type: column_types.ADD_COLUMN,
            payload: {}
        })
        expect(reducer(testState, {
            type: column_types.UPDATE_FAKE_COLUMN,
            payload: { column: newColumn }
        })).toEqual({
            ...testState,
            columns: [1, 2, 3, 7],
            columnObject: {
                ...testState.columnObject,
                7: newColumn,
            },
        })
    })
    it('should handle DELETE_COLUMN', () => {
        let thirdColumn: ColumnWithTasks = { ...testState.columnObject[2] }
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

    it('should handle DELETE_COLUMN on a fake column, and that pending delete should be updated on UPDATE_FAKE_COLUMN', () => {
        let newFakeColumn = {
            id: -1,
            title: "Just leaving this here",
            userId: null,
            position: 3,
            Task: [],
        }
        testState = reducer(testState, {
            type: column_types.ADD_COLUMN,
            payload: {}
        })

        let testStateAfterDelete = reducer(testState, {
            type: column_types.DELETE_COLUMN,
            payload: { column: newFakeColumn }
        })
        expect(testStateAfterDelete).toEqual({
            ...testState,
            columns: [1, 2, 3],
            pendingActions: [{ column: newFakeColumn, action: "delete" }]
        })

        let newColumn: ColumnWithTasks = { id: 7, title: "Test Column 7", userId: 1, position: 3, Task: [] }
        expect(reducer(testStateAfterDelete, {
            type: column_types.UPDATE_FAKE_COLUMN,
            payload: { column: newColumn }
        })).toEqual({
            ...testStateAfterDelete,
            pendingActions: [{ column: newColumn, action: "delete" }]
        })
    })

    it('should handle UPDATE_COLUMN_ORDER on a fake column, and that pending update should be updated on UPDATE_FAKE_COLUMN', () => {
        let newFakeColumn = {
            id: -1,
            title: "N2222",
            userId: null,
            position: 1,
            Task: [],
        }
        testState = reducer(testState, {
            type: column_types.ADD_COLUMN,
            payload: {}
        })

        let testStateAfterUpdate = reducer(testState, {
            type: column_types.UPDATE_COLUMN_ORDER,
            payload: { column: newFakeColumn }
        })
        expect(testStateAfterUpdate).toEqual({
            ...testState,
            columns: [1, -1, 2, 3],
            columnObject: {
                ...testState.columnObject,
                2: { ...testState.columnObject[2], position: 2 },
                3: { ...testState.columnObject[3], position: 3 }
            },
            pendingActions: [{ column: newFakeColumn, action: "update" }]
        })

        let newColumn: ColumnWithTasks = { id: 7, title: "New Column", userId: 1, position: 3, Task: [] }
        let testStateAfterServer = reducer(testStateAfterUpdate, {
            type: column_types.UPDATE_FAKE_COLUMN,
            payload: { column: newColumn }
        })
        expect(testStateAfterServer).toEqual({
            ...testStateAfterUpdate,
            columnObject: {
                ...testStateAfterUpdate.columnObject,
                7: {
                    ...newColumn,
                    position: 1
                }
            },
            pendingActions: [{
                column: {
                    ...newColumn,
                    position: 1,
                }, action: "update"
            }]
        })
    })

    it('should handle UPDATE_COLUMN_ORDER', () => {
        let updatedThirdColumn: ColumnWithTasks = { ...testState.columnObject[3], position: 0 }
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
        expect(reducer(testState, {
            type: task_types.ADD_TASK,
            payload: { columnId: 1 }
        })).toEqual({
            ...testState,
            columnObject: {
                ...testState.columnObject,
                1: { ...testState.columnObject[1], Task: [1, 2, 3, -1] },
            },
            taskObject: {
                ...testState.taskObject,
                "-1": {
                    id: -1,
                    position: 3,
                    description: "New Task",
                    completed: false,
                    columnId: 1,
                }
            },
            fakeTaskId: -2
        })
    })
    it('should handle DELETE_TASK', () => {
        let secondTask: Task = { ...testState.taskObject[2] }
        expect(reducer(testState, {
            type: task_types.DELETE_TASK,
            payload: { task: secondTask }
        })).toEqual({
            ...testState,
            columnObject: {
                ...testState.columnObject,
                1: { ...testState.columnObject[1], Task: [1, 3] },
            },
            taskObject: {
                ...testState.taskObject,
                3: { ...testState.taskObject[3], position: 1 }
            }
        })
    })
    it('should handle UPDATE_TASK_ORDER when moving within a column', () => {
        let updatedThirdTask: Task = { ...testState.taskObject[3], position: 0 }
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
        let updatedThirdTask: Task = { ...testState.taskObject[3], position: 0, columnId: 2 }
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
    it('should handle UPDATE_FAKE_TASK', () => {
        let seventhTask: Task = { id: 7, description: "Test Task 7", position: 3, completed: false, columnId: 1 }
        testState = reducer(testState, {
            type: task_types.ADD_TASK,
            payload: { columnId: 1 }
        })
        expect(reducer(testState, {
            type: task_types.UPDATE_FAKE_TASK,
            payload: { task: seventhTask }
        })).toEqual({
            ...testState,
            columnObject: {
                ...testState.columnObject,
                1: { ...testState.columnObject[1], Task: [1, 2, 3, 7] },
            },
            taskObject: {
                ...testState.taskObject,
                7: seventhTask,
            }
        })
    })

    it('should handle DELETE_TASK on a fake task, and that pending delete should be updated on UPDATE_FAKE_TASK', () => {
        let newFakeTask: Task = {
            id: -1,
            position: 3,
            description: "New Task",
            completed: false,
            columnId: 1,
        }
        testState = reducer(testState, {
            type: task_types.ADD_TASK,
            payload: { columnId: 1 }
        })

        let testStateAfterDelete = reducer(testState, {
            type: task_types.DELETE_TASK,
            payload: { task: newFakeTask }
        })
        expect(testStateAfterDelete).toEqual({
            ...testState,
            columnObject: {
                ...testState.columnObject,
                1: {
                    ...testState.columnObject[1],
                    Task: [1, 2, 3]
                }
            },
            pendingActions: [{ task: newFakeTask, action: "delete" }]
        })

        let newTask: Task = { id: 7, description: "New Task", completed: false, columnId: 1, position: 3 }

        expect(reducer(testStateAfterDelete, {
            type: task_types.UPDATE_FAKE_TASK,
            payload: { task: newTask }
        })).toEqual({
            ...testStateAfterDelete,
            pendingActions: [{ task: newTask, action: "delete" }]
        })
    })

    it('should handle UPDATE_TASK_ORDER on a fake task, and that pending update should be updated on UPDATE_FAKE_TASK', () => {
        let newFakeTask: Task = {
            id: -1,
            position: 0,
            description: "New Task",
            completed: false,
            columnId: 2,
        }
        testState = reducer(testState, {
            type: task_types.ADD_TASK,
            payload: { columnId: 1 }
        })

        let testStateAfterUpdate = reducer(testState, {
            type: task_types.UPDATE_TASK_ORDER,
            payload: { task: newFakeTask }
        })
        expect(testStateAfterUpdate).toEqual({
            ...testState,
            columnObject: {
                ...testState.columnObject,
                1: { ...testState.columnObject[1], Task: [1, 2, 3] },
                2: { ...testState.columnObject[2], Task: [-1] },
            },
            taskObject: {
                ...testState.taskObject,
                "-1": { ...newFakeTask, position: 0, columnId: 2 },
            },
            pendingActions: [{ task: newFakeTask, action: "update" }]
        })

        let newTask: Task = { id: 7, description: "New Task", completed: false, columnId: 1, position: 3 }
        let testStateAfterServer = reducer(testStateAfterUpdate, {
            type: task_types.UPDATE_FAKE_TASK,
            payload: { task: newTask }
        })
        expect(testStateAfterServer).toEqual({
            ...testStateAfterUpdate,
            columnObject: {
                ...testStateAfterUpdate.columnObject,
                2: { ...testState.columnObject[2], Task: [7] },
            },
            taskObject: {
                ...testStateAfterUpdate.taskObject,
                7: { ...newTask, position: 0, columnId: 2 },
            },
            pendingActions: [{
                task: {
                    ...newTask,
                    position: 0,
                    columnId: 2,
                }, action: "update"
            }]
        })
    })
})