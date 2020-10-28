import prisma from "../../../lib/prisma"


// DELETE /api/task/:id
export default async function handle(req, res) {
    const taskId = req.query.id;
    if (req.method === "DELETE") {
        const task = await prisma.task.delete({
            where: { id: Number(taskId) },
        });
        await prisma.task.updateMany({
            data: { position: { decrement: 1 } },
            where: {
                columnId: {
                    equals: task.columnId,
                },
                position: {
                    gt: task.position,
                }
            },
        });
        res.json(task);
    } else if (req.method === "PATCH") {
        const { description, completed, position: newPosition, columnId: newColumnId, hidden } = req.body
        const task = await prisma.task.findOne({
            where: { id: Number(taskId) },
        });
        const oldPosition = task.position
        const oldColumnId = task.columnId
        if (oldColumnId != newColumnId) {
            await prisma.task.updateMany({
                data: { position: { decrement: 1 } },
                where: {
                    columnId: {
                        equals: oldColumnId,
                    },
                    position: {
                        gt: oldPosition,
                    }
                },
            });
            await prisma.task.updateMany({
                data: { position: { increment: 1 } },
                where: {
                    columnId: {
                        equals: newColumnId,
                    },
                    position: {
                        gte: newPosition,
                    }
                },
            });
        } else if (newPosition != null && oldPosition != null) {
            if (oldPosition < newPosition) {
                await prisma.task.updateMany({
                    data: { position: { decrement: 1 } },
                    where: {
                        columnId: {
                            equals: newColumnId,
                        },
                        position: {
                            gt: oldPosition,
                            lte: newPosition
                        }
                    },
                });
            } else if (oldPosition > newPosition) {
                await prisma.task.updateMany({
                    data: { position: { increment: 1 } },
                    where: {
                        columnId: {
                            equals: newColumnId,
                        },
                        position: {
                            lt: oldPosition,
                            gte: newPosition
                        }
                    },
                });
            }
        }
        const newTask = await prisma.task.update({
            data: {
                hidden,
                description,
                completed,
                position: newPosition,
                column: { connect: { id: Number(newColumnId) } },
            },
            where: { id: Number(taskId) },
        });
        if (hidden != task.hidden) {
            const replacementTask = await prisma.task.create({
                data: {
                    column: { connect: { id: Number(newColumnId) } }
                }
            });
            res.json(replacementTask);
        } else {
            res.json(newTask);
        }

    } else {
        throw new Error(
            `The HTTP ${req.method} method is not supported at this route.`
        );
    }
}