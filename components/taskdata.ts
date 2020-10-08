const intitialData = {
    tasks: {
        'task-1': { column: 'column-1', id: 'task-1', content: 'Take out the garbage' },
        'task-2': { column: 'column-1', id: 'task-2', content: 'Watch my favorite show' },
        'task-3': { column: 'column-1', id: 'task-3', content: 'Charge my phone' },
        'task-4': { column: 'column-1', id: 'task-4', content: 'Cook dinner' },
    },
    taskTotalCount: 4,
    columns: {
        'column-1': {
            id: 'column-1',
            title: 'Today',
            taskIds: ['task-1', 'task-2', 'task-3', 'task-4']
        },
    },
    colTotalCount: 2,
    columnOrder: ['column-1']
}
export default intitialData