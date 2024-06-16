import { Gender, Role, PrismaClient, User, Book } from "@prisma/client"
import { faker } from "@faker-js/faker"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

const _users: User[] = [],
  _books: Book[] = []

async function userSeeder(): Promise<void> {
  const userCount = await prisma.user.count()

  if (userCount > 100) {
    console.log("> User seeder already executed")

    _users.push(...(await prisma.user.findMany()))

    return
  }

  const password = await bcrypt.hash("password", 10)

  const users = []

  // default admin user
  users.push(<User>{
    email: "admin@ngeen.com.tr",
    name: "Admin",
    surname: "Madmin",
    password: await bcrypt.hash("admin@ngeen.com.tr", 10),
    dob: faker.date.birthdate({
      min: 1950,
      max: 2005
    }),
    gender: Gender.NON_BINARY,
    role: Role.ADMIN
  })

  // random users
  users.push(
    ...Array.from(
      { length: 100 },
      () =>
        <User>{
          email: faker.internet.email(),
          name: faker.person.firstName(),
          surname: faker.person.lastName(),
          password: password,
          dob: faker.date.birthdate({
            min: 1950,
            max: 2005
          }),
          gender: faker.helpers.arrayElement(Object.values(Gender)),
          role: Role.USER
        }
    ).map((user: User, index: number) => {
      if (user.role !== Role.ADMIN) {
        user.email = `${index}.${user.email}`
      }

      return user
    })
  )

  await prisma.user.createMany({
    data: users
  })

  _users.push(...(await prisma.user.findMany()))

  console.log(`> User seeder successfully executed with ${users.length} records`)
}

async function bookSeeder(): Promise<void> {
  const bookCount = await prisma.book.count()

  if (bookCount > 100) {
    console.log("> Book seeder already executed")

    _books.push(...(await prisma.book.findMany()))

    return
  }

  const books = Array.from(
    { length: 100 },
    () =>
      <Book>{
        title: faker.lorem.words(3),
        description: faker.lorem.paragraph(),
        price: faker.number.float({
          min: 1,
          max: 100
        })
      }
  ).map((book: Book, index: number) => {
    book.user_id = _users[index].id

    return book
  })

  await prisma.book.createMany({
    data: books
  })

  _books.push(...(await prisma.book.findMany()))

  console.log(`> Book seeder successfully executed with ${books.length} records`)
}

async function main() {
  // user
  await userSeeder()

  // book
  await bookSeeder()
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)

    await prisma.$disconnect()

    process.exit(1)
  })
