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
    let addColumn = (position) => dispatch(postColumn(position))
    let reorderTask = (body) => dispatch(updateTask(body))
    let reorderColumn = (body) => dispatch(updateColumn(body))
    return { columns, columnObject, addColumn, reorderTask, reorderColumn }
}

export default function Trello() {
    let { columns, columnObject, addColumn, reorderTask, reorderColumn } = useColumns()

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
            let body = { id: columnId, position: destination.index }
            reorderColumn(body)
            return
        }

        let columnId = Number(destination.droppableId.split("-")[1])
        let taskId = Number(draggableId.split("-")[1])
        let body = { id: taskId, columnId, position: destination.index }
        reorderTask(body)

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