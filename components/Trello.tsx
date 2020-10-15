import { useState } from 'react'
import styles from '../styles/trello.module.sass'
import Column from './column'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import React from 'react'
import { Button, Paper } from '@material-ui/core'
import { useSelector, useDispatch } from 'react-redux'
import { postTask, postColumn, deleteColumn, deleteTask } from '../redux/actions/counteractions'
//, deleteColumn as deleteColumnRedux, deleteTask as deleteTaskRedux
let rerender = 0



export default function Trello() {
    let dispatch = useDispatch()
    const initialData = useSelector((state) =>
        state.trello.columns
    )


    const onDragEnd = async result => {
        // const { destination, source, draggableId, type } = result;

        // if (!destination) {
        //     return;
        // }

        // if (destination.droppableId === source.droppableId && destination.index === source.index) {
        //     return;
        // }

        // if (type == "column") {
        //     let colId = Number(draggableId.split("-")[1])
        //     let body = { index: destination.index }
        //     await fetch(`http://localhost:3000/api/task/${colId}`, {
        //         method: "PATCH",
        //         headers: { "Content-Type": "application/json" },
        //         body: JSON.stringify(body),
        //     });
        //     return
        // }


        // let destId = Number(destination.droppableId.split("-")[1])
        // let taskId = Number(draggableId.split("-")[1])

        // let body = { destId, order: destination.index }
        // await fetch(`http://localhost:3000/api/task/${taskId}`, {
        //     method: "PATCH",
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify(body),
        // });
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
                                    initialData.map((column, index) => {
                                        return <Column key={column.id} deleteTask={(taskId, columnId) => dispatch(deleteTask(taskId, columnId))} deleteColumn={(columnId) => dispatch(deleteColumn(columnId))} addTask={(columnId) => dispatch(postTask(columnId))} index={index} column={column} tasks={column.Task} />
                                    })
                                }
                                {provided.placeholder}
                            </div>
                        )
                    }
                </Droppable>
            </DragDropContext>
            <Button onClick={() => dispatch(postColumn())}> New </Button>
        </div >
    )
}