import prisma from "../../../lib/prisma"

export default async function handle(req, res) {
    const columnId = req.query.id;
    if (req.method === "DELETE") {
        const column = await prisma.column.delete({
            where: { id: Number(columnId) },
        });
        await prisma.column.updateMany({
            data: { position: { decrement: 1 } },
            where: {
                position: {
                    gt: column.position,
                }
            },
        });
        res.json(column);
    } else if (req.method === "PATCH") {
        const { title, position: newPosition } = req.body
        const column = await prisma.column.findOne({
            where: { id: Number(columnId) },
        });
        const oldPosition = column.position

        if (newPosition != null && oldPosition != null) {
            if (oldPosition < newPosition) {
                await prisma.column.updateMany({
                    data: { position: { decrement: 1 } },
                    where: {
                        position: {
                            gt: oldPosition,
                            lte: newPosition
                        }
                    },
                });
            } else if (oldPosition > newPosition) {
                await prisma.column.updateMany({
                    data: { position: { increment: 1 } },
                    where: {
                        position: {
                            lt: oldPosition,
                            gte: newPosition
                        }
                    },
                });
            }
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