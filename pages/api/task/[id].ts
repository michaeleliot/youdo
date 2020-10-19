import prisma from "../../../lib/prisma"


// DELETE /api/task/:id
export default async function handle(req, res) {
    const taskId = req.query.id;
    if (req.method === "DELETE") {
        const task = await prisma.task.delete({
            where: { id: Number(taskId) },
        });
        res.json(task);
    } else if (req.method === "PATCH") {
        const { description, position: newPosition } = req.body
        const task = await prisma.task.findOne({
            where: { id: Number(taskId) },
        });
        const oldPosition = task.position
        const columnId = task.columnId

        if (oldPosition < newPosition) {
            await prisma.task.updateMany({
                data: { position: { decrement: 1 } },
                where: {
                    columnId: {
                        equals: columnId,
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
                        equals: columnId,
                    },
                    position: {
                        lt: oldPosition,
                        gte: newPosition
                    }
                },
            });
        }

        const newTask = await prisma.task.update({
            data: {
                description,
                position: newPosition
            },
            where: { id: Number(taskId) },
        });
        res.json(newTask);
    } else {
        throw new Error(
            `The HTTP ${req.method} method is not supported at this route.`
        );
    }
}