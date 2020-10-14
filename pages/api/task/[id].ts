import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// DELETE /api/task/:id
export default async function handle(req, res) {
    const taskId = req.query.id;
    if (req.method === "DELETE") {
        const task = await prisma.task.delete({
            where: { id: Number(taskId) },
        });
        res.json(task);
    } else if (req.method === "PATCH") {
        const destId = req.body.destId
        const order = req.body.index
        await prisma.task.updateMany({
            data: {
                order: {
                    incremenet: 1
                }
            },
            where: { order: { gt: order } },
        });
        const task = await prisma.task.update({
            data: { column: { connect: { id: Number(destId) } } },
            where: { id: Number(taskId) },
        });
        res.json(task);
    } else {
        throw new Error(
            `The HTTP ${req.method} method is not supported at this route.`
        );
    }
}