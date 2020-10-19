import prisma from "../../../lib/prisma"
import { getSession } from "next-auth/client";

// POST /api/post
// Required fields in body: title
// Optional fields in body: content
export default async function handle(req, res) {
    const { title, position } = req.body;

    const session = await getSession({ req });
    const result = await prisma.column.create({
        data: {
            title: title,
            owner: { connect: { email: session?.user?.email } },
            position,
        },
        include: {
            Task: true
        },
    });
    res.json(result);
}