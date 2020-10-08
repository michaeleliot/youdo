const intitialData = {
    tasks: {
        'goal-1': { column: 'okr-1', id: 'goal-1', content: 'Make organizational site' },
        'goal-2': { column: 'okr-1', id: 'goal-2', content: 'Build a react + solidity app of some kind' },
        'goal-3': { column: 'okr-1', id: 'goal-3', content: 'Understand defi' },
        'goal-4': { column: 'okr-1', id: 'goal-4', content: 'Text 20 people about referals ' },
        'goal-5': { column: 'okr-1', id: 'goal-5', content: 'Apply to 50 more jobs' },
        'goal-6': { column: 'okr-1', id: 'goal-6', content: 'Write three research articles about the tech space' },
        'goal-7': { column: 'okr-1', id: 'goal-7', content: 'Livestream 5 times with Lauren' },
        'goal-8': { column: 'okr-1', id: 'goal-8', content: 'Post a video to youtube' },
    },
    taskTotalCount: 4,
    columns: {
        'okr-1': {
            id: 'okr-1',
            title: 'Strong Programming Depth',
            taskIds: ['goal-1', 'goal-2', 'goal-3']
        },
        'okr-2': {
            id: 'okr-2',
            title: 'Job Search',
            taskIds: ['goal-4', 'goal-5']
        },
        'okr-3': {
            id: 'okr-3',
            title: 'Put Self Out There',
            taskIds: ['goal-6', 'goal-7', 'goal-8']
        },
    },
    colTotalCount: 3,
    columnOrder: ['okr-1', 'okr-2', 'okr-3']
}
export default intitialData