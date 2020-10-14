import styles from '../styles/column.module.sass'
import Task from './task'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import React from 'react'
import { Button } from '@material-ui/core'
import EditableLabel from 'react-inline-editing';

function Column({ column, tasks, index, deleteColumn, addTask, deleteTask }) {
    return (
        <React.Fragment>
            <Draggable draggableId={column.name} index={index}>
                {
                    provided => (
                        < div {...provided.draggableProps} ref={provided.innerRef} className={styles.container}>
                            <div className={styles.title} {...provided.dragHandleProps}>
                                <EditableLabel
                                    text={column.title}
                                    labelClassName='myLabelClass'
                                    inputClassName='myInputClass'
                                    inputWidth='200px'
                                    inputHeight='25px'
                                    inputMaxLength={50}
                                    inputMin
                                    onFocus={(text) => (console.log(text))}
                                    onFocusOut={(text) => (console.log(text))}
                                />
                            </div>

                            <Button color='secondary' onClick={() => deleteColumn(column.id)}>Delete Column</Button>
                            <Droppable droppableId={column.name} type='task'>
                                {
                                    (provided, snapshot) => (
                                        <div
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            className={snapshot.isDraggingOver ? styles.taskListDragging : styles.tasklist}
                                        >
                                            {tasks.map((task, index) => (
                                                <Task deleteTask={deleteTask} key={task.id} task={task} index={index}></Task>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )
                                }
                            </Droppable>
                            <Button onClick={() => addTask(column.name, column.id)}>Add</Button>
                        </div>
                    )
                }
            </ Draggable >
        </React.Fragment>

    )
}
export default React.memo(Column)