import { PrismaClient } from "@prisma/client"
import dayjs from "dayjs"
import { Metadata } from "next"
import UserLayout from "../components/layouts/userLayout"

const prisma = new PrismaClient()

export const metadata: Metadata = {
  title: `Users | ${process.env.NEXT_APP_NAME}`
}

export default async function Page() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      surname: true,
      avatar: true,
      dob: true,
      books: {
        select: {
          id: true,
          title: true
        }
      }
    }
  })

  const _users = users.map((user) => ({
    ...user,
    age: dayjs(new Date()).diff(user.dob, "year"),
    dob: dayjs(user.dob).format("DD MMM YYYY")
  }))

  return (
    <>
      <UserLayout>
        <h1 className="pb-2 mx-5 mb-2 text-2xl border-b border-gray-500">Registered Users</h1>

        <ul className="list-none">
          {_users.map((user: any, index: number) => (
            <li key={index} className="flex flex-row items-center gap-2 m-5">
              <img
                src={user.avatar || "https://robohash.org/XX"}
                alt={user.name || "Unknown"}
                className="w-10 h-10 rounded-lg"
                height={40}
                width={40}
              />

              <span>{`${user.name} ${user.surname} (${user["age"]} yo)`}</span>
            </li>
          ))}
        </ul>
      </UserLayout>
    </>
  )
}
