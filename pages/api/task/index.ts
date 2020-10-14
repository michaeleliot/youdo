import { PrismaClient } from "@prisma/client";
import { getSession } from "next-auth/client";

const prisma = new PrismaClient();

// POST /api/post
// Required fields in body: title
// Optional fields in body: content
export default async function handle(req, res) {
    const { description, columnId } = req.body;
    const result = await prisma.task.create({
        data: {
            description,
            completed: false,
            column: { connect: { id: Number(columnId) } },
        },
    });
    res.json(result);
}