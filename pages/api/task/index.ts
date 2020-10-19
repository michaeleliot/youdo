import prisma from "../../../lib/prisma"
import { getSession } from "next-auth/client";

// POST /api/post
// Required fields in body: title
// Optional fields in body: content
export default async function handle(req, res) {
    const { description, columnId, position } = req.body;
    const result = await prisma.task.create({
        data: {
            description,
            completed: false,
            column: { connect: { id: Number(columnId) } },
            position
        }
    });
    res.json(result);
}