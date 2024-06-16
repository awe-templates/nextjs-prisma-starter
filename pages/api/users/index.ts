// pages/api/users.ts
import { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          surname: true,
          dob: true,
          books: {
            select: {
              id: true,
              title: true
            }
          }
        }
      })

      res.status(200).json({
        data: users
      })
    } catch (error) {
      res.status(500).json({ error: "An error occurred while fetching users" })
    }
  } else {
    res.status(405).json({ message: "Method not allowed" })
  }
}
