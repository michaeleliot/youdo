import prisma from "../../../lib/prisma"


// DELETE /api/task/:id
export default async function handle(req, res) {
    const columnId = req.query.id;
    if (req.method === "DELETE") {
        const column = await prisma.column.delete({
            where: { id: Number(columnId) },
        });
        res.json(column);
    } else if (req.method === "PATCH") {
        const { title, position: newPosition } = req.body
        const column = await prisma.column.findOne({
            where: { id: Number(columnId) },
        });
        const oldPosition = column.position

        if (oldPosition < newPosition) {
            let where = {
                position: {
                    gt: oldPosition,
                    lte: newPosition
                }
            }
            await prisma.column.updateMany({
                data: { position: { decrement: 1 } },
                where,
            });
        } else if (oldPosition > newPosition) {
            let where = {
                position: {
                    lt: oldPosition,
                    gte: newPosition
                }
            }
            await prisma.column.updateMany({
                data: { position: { increment: 1 } },
                where,
            });
        }

        const newCol = await prisma.column.update({
            data: {
                title,
                position: newPosition
            },
            where: { id: Number(columnId) },
        });
        res.json(newCol);
    } else {
        throw new Error(
            `The HTTP ${req.method} method is not supported at this route.`
        );
    }
}