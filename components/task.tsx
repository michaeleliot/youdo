import styles from '../styles/task.module.sass'
import { Draggable } from 'react-beautiful-dnd'
import React from 'react'
import EditableLabel from 'react-inline-editing';
import { Button } from '@material-ui/core';
import { deleteTask, updateTask } from '../redux/actions/counteractions';
import { useDispatch } from 'react-redux'
import { Task } from '../types';

type TaskProps = {
    task: Task
    index: number
}

function useState() {
    let dispatch = useDispatch()
    let updateTaskDescription = (description, task) => dispatch(updateTask({ ...task, description }))
    let removeTask = (taskId, columnId) => dispatch(deleteTask(taskId, columnId))
    let [currentText, setCurrentText] = React.useState()
    return { updateTaskDescription, removeTask, currentText, setCurrentText }
}

export default function TaskView({ task, index }: TaskProps) {
    let { updateTaskDescription, removeTask, currentText, setCurrentText } = useState()
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
                                text != currentText ? updateTaskDescription(text, task) : console.log("Did not update")
                            }}
                        />
                        <Button color='secondary' onClick={() => (removeTask(task.id, task.columnId))}> Delete </Button>
                        <Button color='primary' onClick={() => (removeTask(task.id, task.columnId))}> Complete </Button>
                    </div>
                )
            }
        </Draggable>
    )
}