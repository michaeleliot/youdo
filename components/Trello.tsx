import { useState } from 'react'
import styles from '../styles/trello.module.sass'
import Column from './column'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import React from 'react'
import { Button } from '@material-ui/core'

let rerender = 0

export default function Trello({ initialData }) {
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

    const addColumn = async () => {
        const body = { title: 'New Column' };
        await fetch(`http://localhost:3000/api/column`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
    }

    const deleteColumn = async (columnId) => {
        await fetch(`http://localhost:3000/api/column/${columnId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        });
    }

    const addTask = async (columnId) => {
        const body = { description: 'New Task', columnId };
        await fetch(`http://localhost:3000/api/task`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
    }

    const deleteTask = async (taskId) => {
        await fetch(`http://localhost:3000/api/task/${taskId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        });
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
                                        return <Column key={column.id} deleteTask={deleteTask} deleteColumn={deleteColumn} addTask={addTask} index={index} column={column} tasks={column.Task} />
                                    })
                                }
                                {provided.placeholder}
                            </div>
                        )
                    }
                </Droppable>
            </DragDropContext>
            <Button onClick={() => addColumn()}> New </Button>
        </div >

    )
}