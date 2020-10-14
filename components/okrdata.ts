const intitialData = {
    tasks: {
        'goal-1': { column: 'okr-1', id: 'goal-1', description: 'Make organizational site' },
        'goal-2': { column: 'okr-1', id: 'goal-2', description: 'Build a react + solidity app of some kind' },
        'goal-3': { column: 'okr-1', id: 'goal-3', description: 'Understand defi' },
        'goal-4': { column: 'okr-1', id: 'goal-4', description: 'Text 20 people about referals ' },
        'goal-5': { column: 'okr-1', id: 'goal-5', description: 'Apply to 50 more jobs' },
        'goal-6': { column: 'okr-1', id: 'goal-6', description: 'Write three research articles about the tech space' },
        'goal-7': { column: 'okr-1', id: 'goal-7', description: 'Livestream 5 times with Lauren' },
        'goal-8': { column: 'okr-1', id: 'goal-8', description: 'Post a video to youtube' },
    },
    taskTotalCount: 4,
    columns: {
        'okr-1': {
            name: 'okr-1',
            title: 'Strong Programming Depth',
            taskIds: ['goal-1', 'goal-2', 'goal-3'],
            id: 1
        },
        'okr-2': {
            name: 'okr-2',
            title: 'Job Search',
            taskIds: ['goal-4', 'goal-5'],
            id: 2
        },
        'okr-3': {
            name: 'okr-3',
            title: 'Put Self Out There',
            taskIds: ['goal-6', 'goal-7', 'goal-8'],
            id: 3
        },
    },
    colTotalCount: 3,
    columnOrder: ['okr-1', 'okr-2', 'okr-3']
}
export default intitialData