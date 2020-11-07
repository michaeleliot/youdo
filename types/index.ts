import { Column, Task as TaskType } from '@prisma/client'

export type ColumnWithTasks = Column & { Task: number[], pendingActions?: [], isFake?: boolean }

export interface ReduxAction {
    type: string
    payload: Object
}

export type Task = TaskType & { pendingActions?: [], isFake?: boolean }

export type ColumnReduxAction = (column: ColumnWithTasks) => ReduxAction;
export type TaskReduxAction = (column: Task) => ReduxAction;
