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
        const { task } = req.body
        const newTask = await prisma.task.update({
            data: task,
            where: { id: Number(taskId) },
        });
        res.json(newTask);
    } else {
        throw new Error(
            `The HTTP ${req.method} method is not supported at this route.`
        );
    }
}