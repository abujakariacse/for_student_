
import PayForm from "./_components/PayForm"

export default async function PaymentPage({
  searchParams,
}: {
  searchParams: Promise<{
    canceled?: string
  }>
}) {

  const {  canceled } = await searchParams

  if(canceled){
    console.log("order canceled");
  }

  return <PayForm canceled={canceled} />
}