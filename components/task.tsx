import styles from '../styles/task.module.sass'
import { Draggable } from 'react-beautiful-dnd'
import React from 'react'
import EditableLabel from 'react-inline-editing';
import { Button } from '@material-ui/core';
import { deleteTask, patchTask } from '../redux/actions/task_actions';
import { useDispatch } from 'react-redux'
import { Task } from '../types';

type TaskProps = {
    task: Task
    index: number
}

function useState() {
    let dispatch = useDispatch()
    let updateTaskDescription = (description: string, task: Task) => dispatch(patchTask({ ...task, description }))
    let removeTask = (task: Task) => dispatch(deleteTask(task))
    return { updateTaskDescription, removeTask }
}

export default function TaskView({ task, index }: TaskProps) {
    let { updateTaskDescription, removeTask } = useState()
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
                            onFocus={(text) => (console.log("OnFocus"))}
                            onFocusOut={(text) => {
                                task.description != text ? updateTaskDescription(text, task) : console.log("Did not update")
                            }}
                        />
                        <Button color='secondary' onClick={() => (removeTask(task))}> Delete </Button>
                        <Button color='primary' onClick={() => (removeTask(task))}> Complete </Button>
                    </div>
                )
            }
        </Draggable>
    )
}