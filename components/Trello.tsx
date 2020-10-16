import { useState } from 'react'
import styles from '../styles/trello.module.sass'
import Column from './column'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import React from 'react'
import { Button } from '@material-ui/core'
import { useSelector, useDispatch } from 'react-redux'
import { postTask, postColumn, deleteColumn, deleteTask, updateTask } from '../redux/actions/counteractions'

function useColumns() {
    let dispatch = useDispatch()
    const columns = useSelector((state) =>
        state.trello.columns
    )
    const columnObject = useSelector((state) =>
        state.trello.columnObject
    )
    let removeTask = (taskId, columnId) => dispatch(deleteTask(taskId, columnId))
    let removeColumn = (columnId) => dispatch(deleteColumn(columnId))
    let addTask = (columnId, position) => dispatch(postTask(columnId, position))
    let addColumn = (position) => dispatch(postColumn(position))
    let reorderTask = (body) => dispatch(updateTask(body))
    return { columns, columnObject, removeTask, removeColumn, addTask, addColumn, reorderTask }

}

export default function Trello() {
    let { columns, columnObject, removeTask, removeColumn, addTask, addColumn, reorderTask } = useColumns()

    console.log(columns, columnObject)

    const onDragEnd = async result => {
        const { destination, source, draggableId, type } = result;

        if (!destination) {
            return;
        }

        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            return;
        }

        if (type == "column") {
            // let colId = Number(draggableId.split("-")[1])
            // let body = { index: destination.index }
            // await fetch(`http://localhost:3000/api/task/${colId}`, {
            //     method: "PATCH",
            //     headers: { "Content-Type": "application/json" },
            //     body: JSON.stringify(body),
            // });
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
                                            deleteTask={removeTask}
                                            deleteColumn={removeColumn}
                                            addTask={addTask}
                                            index={index}
                                            column={column}
                                            tasks={column.Task}
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