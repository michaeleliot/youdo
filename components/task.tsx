import styles from '../styles/task.module.sass'
import { Draggable } from 'react-beautiful-dnd'
import React from 'react'
import EditableLabel from 'react-inline-editing';
import { Button } from '@material-ui/core';
import { updateTask } from '../redux/actions/counteractions';
import { useDispatch } from 'react-redux'

export default function Task({ deleteTask, task, index }) {
    let dispatch = useDispatch()
    let updateTaskDescription = (description) => {
        task.description = description
        dispatch(updateTask(task))
    }
    let [currentText, setCurrentText] = React.useState()
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
                            onFocus={(text) => (setCurrentText(text))}
                            onFocusOut={(text) => {
                                text != currentText ? updateTaskDescription(text) : console.log("Did not update")
                            }}
                        />
                        <Button color='secondary' onClick={() => (deleteTask(task.id, task.columnId))}> Delete </Button>
                        <Button color='primary' onClick={() => (deleteTask(task.id, task.columnId))}> Complete </Button>
                    </div>
                )
            }
        </Draggable>
    )
}