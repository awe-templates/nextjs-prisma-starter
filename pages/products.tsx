export default function Page({ data }: any) {
  return (
    <ul>
      {data.map((item: any, index: number) => (
        <li key={index}>{item.title}</li>
      ))}
    </ul>
  )
}

// This gets called on every request
export async function getServerSideProps() {
  // Fetch data from external API
  const res = await fetch(`https://fakestoreapi.com/products`)
  const data = await res.json()

  // Pass data to the page via props
  return { props: { data } }
}
