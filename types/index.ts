import { Column, Task as TaskType } from '@prisma/client'

export type ColumnWithTasks = Column & { Task: number[], hiddenTasks?: number[] }

export interface ReduxAction {
    type: string
    payload: Object
}

export type Task = TaskType