import styles from '../styles/task.module.sass'
import { Draggable } from 'react-beautiful-dnd'
import React from 'react'
import EditableLabel from 'react-inline-editing';
import { Button } from '@material-ui/core';

export default function Task({ deleteTask, task, index }) {
    return (
        <Draggable draggableId={"task-" + task.id} index={index}>
            {
                (provided, snapshot) => (
                    <div
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                        className={snapshot.isDragging ? styles.draggingContainer : styles.container}
                    >
                        <EditableLabel
                            text={task.description}
                            labelClassName='myLabelClass'
                            inputClassName='myInputClass'
                            inputWidth='200px'
                            inputHeight='25px'
                            inputMaxLength={50}
                            inputMin
                            onFocus={(text) => (console.log(text))}
                            onFocusOut={(text) => (console.log(text))}
                        />
                        <Button color='secondary' onClick={() => (deleteTask(task.id, task.columnId))}> Delete </Button>
                        <Button color='primary' onClick={() => (deleteTask(task.id, task.columnId))}> Complete </Button>
                    </div>
                )
            }
        </Draggable>
    )
}