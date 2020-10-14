const intitialData = {
    tasks: {
        'task-1': { column: 'column-1', id: 'task-1', description: 'Take out the garbage' },
        'task-2': { column: 'column-1', id: 'task-2', description: 'Watch my favorite show' },
        'task-3': { column: 'column-1', id: 'task-3', description: 'Charge my phone' },
        'task-4': { column: 'column-1', id: 'task-4', description: 'Cook dinner' },
    },
    taskTotalCount: 4,
    columns: {
        'column-1': {
            id: 1,
            title: 'Today',
            taskIds: ['task-1', 'task-2', 'task-3', 'task-4'],
            name: 'column-1'
        },
    },
    colTotalCount: 2,
    columnOrder: ['column-1']
}
export default intitialData