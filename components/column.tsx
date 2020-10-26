import styles from '../styles/column.module.sass'
import Task from './task'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import React from 'react'
import { Button } from '@material-ui/core'
import EditableLabel from 'react-inline-editing';
import { useSelector } from 'react-redux'
import { deleteColumn, patchColumn } from '../redux/actions/columnActions'
import { patchUnhideTask } from '../redux/actions/taskActions'

import { useDispatch } from 'react-redux'
import { ColumnWithTasks, Task as TaskType } from '../types'

type ColumnProps = {
    column: ColumnWithTasks,
    index: number
}

function useState() {
    let dispatch = useDispatch()
    const taskObject = useSelector((state) => state.trello.taskObject)
    let updateColumnTitle = (title: string, column: ColumnWithTasks) => dispatch(patchColumn({ ...column, title }))
    let removeColumn = (column: ColumnWithTasks) => dispatch(deleteColumn(column))
    let unhideTask = (task: TaskType) => dispatch(patchUnhideTask(task))
    return { updateColumnTitle, removeColumn, unhideTask, taskObject }
}

function Column({ column, index }: ColumnProps) {
    let { updateColumnTitle, removeColumn, unhideTask, taskObject } = useState()

    return (
        <Draggable draggableId={"column-" + column.id} index={index}>
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
                                onFocus={(text) => (console.log("Cool"))}
                                onFocusOut={(text) => (column.title != text ? updateColumnTitle(text, column) : console.log("Did not update"))}
                            />
                        </div>

                        <Button color='secondary' onClick={() => removeColumn(column)}>Delete Column</Button>
                        <Droppable droppableId={"column-" + column.id} type='task'>
                            {
                                (provided, snapshot) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className={snapshot.isDraggingOver ? styles.taskListDragging : styles.tasklist}
                                    >
                                        {
                                            column.Task.map((taskId, index) => {
                                                let task = taskObject[taskId]
                                                return <Task key={task.id} task={task} index={index}></Task>

                                            })
                                        }
                                        {provided.placeholder}
                                    </div>
                                )
                            }
                        </Droppable>
                        <Button onClick={() => unhideTask({
                            ...taskObject[column.hiddenTasks.pop()],
                            hidden: false,
                            position: column.Task.length,
                            columnId: column.id
                        })}>Add</Button>
                    </div>
                )
            }
        </ Draggable >
    )
}
export default React.memo(Column)