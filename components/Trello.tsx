import styles from '../styles/trello.module.sass'
import Column from './column'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import React from 'react'
import { Button } from '@material-ui/core'
import { useSelector, useDispatch } from 'react-redux'
import { postColumn, updateTask, updateColumn } from '../redux/actions/counteractions'

function useColumns() {
    let dispatch = useDispatch()
    const columns = useSelector((state) => state.trello.columns)
    const columnObject = useSelector((state) => state.trello.columnObject)
    const taskObject = useSelector((state) => state.trello.taskObject)
    let addColumn = (position) => dispatch(postColumn(position))
    let reorderTask = (body) => dispatch(updateTask(body))
    let reorderColumn = (body) => dispatch(updateColumn(body))
    return { columns, columnObject, taskObject, addColumn, reorderTask, reorderColumn }
}

export default function Trello() {
    let { columns, columnObject, taskObject, addColumn, reorderTask, reorderColumn } = useColumns()

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
        let updatedTask = { ...taskObject[taskId], position: destination.index }
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
            <Button onClick={() => addColumn(columns.length)}> New </Button>
        </div >
    )
}