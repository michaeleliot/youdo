import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// DELETE /api/task/:id
export default async function handle(req, res) {
    const taskId = req.query.id;
    if (req.method === "DELETE") {
        const task = await prisma.column.delete({
            where: { id: Number(taskId) },
        });
        res.json(task);
    } else if (req.method === "PATCH") {
        const task = await prisma.column.update({
            data: req.body,
            where: { id: Number(taskId) },
        });
        res.json(task);
    } else {
        throw new Error(
            `The HTTP ${req.method} method is not supported at this route.`
        );
    }
}