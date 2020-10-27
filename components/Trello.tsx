import styles from '../styles/trello.module.sass'
import Column from './column'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import React from 'react'
import { Button } from '@material-ui/core'
import { useSelector, useDispatch } from 'react-redux'
import { patchUnhideColumn, patchColumn } from '../redux/actions/column_actions'
import { patchTask } from '../redux/actions/task_actions'
import { ColumnWithTasks, Task } from '../types'

function useState() {
    let dispatch = useDispatch()
    const columns = useSelector((state) => state.trello.columns)
    const hiddenColumns = useSelector((state) => state.trello.hiddenColumns)
    const columnObject = useSelector((state) => state.trello.columnObject)
    const taskObject = useSelector((state) => state.trello.taskObject)
    let unhideColumn = (column: ColumnWithTasks) => dispatch(patchUnhideColumn(column))
    let reorderTask = (task: Task) => dispatch(patchTask(task))
    let reorderColumn = (column: ColumnWithTasks) => dispatch(patchColumn(column))
    return { columns, hiddenColumns, columnObject, taskObject, unhideColumn, reorderTask, reorderColumn }
}

export default function Trello() {
    let { columns, hiddenColumns, columnObject, taskObject, unhideColumn, reorderTask, reorderColumn } = useState()

    const onDragEnd = async result => {
        const { destination, source, draggableId, type } = result;

        if (!destination) {
            return;
        }

        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            return;
        }

        if (type == "column") {
            let columnId = Number(draggableId.split("-")[1])
            let updatedColumn = { ...columnObject[columnId], position: destination.index }
            reorderColumn(updatedColumn)
            return
        }

        let taskId = Number(draggableId.split("-")[1])
        let columnId = Number(destination.droppableId.split("-")[1])
        let updatedTask = { ...taskObject[taskId], position: destination.index, columnId }
        reorderTask(updatedTask)
    }

    const onDragStart = () => {
    }

    const onDragUpdate = update => {
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
                                    columns.map((columnId, index) => {
                                        let column = columnObject[columnId]
                                        return <Column
                                            key={column.id}
                                            index={index}
                                            column={column}
                                        />
                                    })
                                }
                                {provided.placeholder}
                            </div>
                        )
                    }
                </Droppable>
            </DragDropContext>
            <Button onClick={() => {
                unhideColumn({
                    ...columnObject[hiddenColumns.pop()],
                    position: columns.length,
                    hidden: false,
                })
            }}> New </Button>
        </div >
    )
}