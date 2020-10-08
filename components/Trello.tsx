import { useState } from 'react'
import styles from '../styles/trello.module.sass'
import Column from './column'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import React from 'react'
import { Button } from '@material-ui/core'

export default function Trello({ initialData }) {
    let [data, changeData] = useState(initialData)

    const onDragEnd = result => {
        const { destination, source, draggableId, type } = result
        if (!destination) return

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) return

        if (type == 'column') {
            const newColumnOrder = Array.from(data.columnOrder)
            newColumnOrder.splice(source.index, 1)
            newColumnOrder.splice(destination.index, 0, draggableId)
            const newData = {
                ...data,
                columnOrder: newColumnOrder,
            }
            changeData(newData)
            return
        }

        const start = data.columns[source.droppableId]
        const finish = data.columns[destination.droppableId]


        if (start === finish) {
            const newTaskIds = Array.from(start.taskIds)
            newTaskIds.splice(source.index, 1)
            newTaskIds.splice(destination.index, 0, draggableId)

            const newColumn = {
                ...start,
                taskIds: newTaskIds,
            }
            const newData =
            {
                ...data,
                columns: {
                    ...data.columns,
                    [newColumn.id]: newColumn
                }
            }
            changeData(newData)
        } else {
            data.tasks[draggableId].column = finish.id

            const startTaskIds = Array.from(start.taskIds)
            startTaskIds.splice(source.index, 1)
            const newStart = {
                ...start,
                taskIds: startTaskIds,
            }

            const finishTaskIds = Array.from(finish.taskIds)
            finishTaskIds.splice(destination.index, 0, draggableId)
            const newFinish = {
                ...finish,
                taskIds: finishTaskIds,
            }

            const newData = {
                ...data,
                columns: {
                    ...data.columns,
                    [newStart.id]: newStart,
                    [newFinish.id]: newFinish,
                }
            }
            changeData(newData)
        }


    }

    const onDragStart = () => {
    }

    const onDragUpdate = update => {
    }

    const deleteColumn = (columnName) => {
        delete data[columnName]
        const columnOrder = Array.from(data.columnOrder).filter(column => column != columnName)
        const newData = {
            ...data,
            columnOrder
        }
        changeData(newData)
    }

    const addTask = (columnName) => {
        const taskId = ++data.taskTotalCount
        data.columns[columnName].taskIds.push(`task-${taskId}`)
        changeData({
            ...data,
            taskTotalCount: taskId,
            tasks: {
                ...data.tasks,
                [`task-${taskId}`]: { column: columnName, id: `task-${taskId}`, content: 'Cook dinner' },
            }
        })
    }

    const deleteTask = (taskId, colId) => {
        delete data.tasks[taskId]
        const newTaskIds = data.columns[colId].taskIds;
        const index = newTaskIds.indexOf(taskId)
        newTaskIds.splice(index, 1)
        const newData = {
            ...data,
            columns: {
                ...data.columns,
                [colId]: {
                    ...data.columns[colId],
                    taskIds: newTaskIds
                }
            }
        }
        changeData(newData)
    }


    return (
        <div className={styles.container}>
            <DragDropContext
                onDragEnd={onDragEnd}
                onDragStart={onDragStart}
                onDragUpdate={onDragUpdate}
            >
                <Droppable droppableId="all-columns" direction='horizontal' type='column'>
                    {
                        provided => (
                            <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className={styles.columnWrapper} >
                                {
                                    data.columnOrder.map((columnId, index) => {
                                        const column = data.columns[columnId]
                                        const tasks = column.taskIds.map(taskId => data.tasks[taskId])
                                        return <Column key={column.id} deleteTask={deleteTask} deleteColumn={deleteColumn} addTask={addTask} index={index} column={column} tasks={tasks} />
                                    })
                                }
                                {provided.placeholder}
                            </div>
                        )
                    }

                </Droppable>
            </DragDropContext>
            <Button onClick={() => {
                const colId = ++data.colTotalCount
                changeData({
                    ...data,
                    columns: {
                        ...data.columns,
                        [`column-${colId}`]: {
                            id: `column-${colId}`,
                            title: 'New Column',
                            taskIds: []
                        },
                    },
                    colTotalCount: colId,
                    columnOrder: [
                        `column-${colId}`,
                        ...data.columnOrder
                    ]
                })
            }
            }> New </Button>
        </div >

    )
}