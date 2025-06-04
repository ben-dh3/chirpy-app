import Pet from "../ui/pet";
import { verifySession } from "../lib/dal";
import Nav from "../ui/nav";

export default async function Dashboard() {
  const session = await verifySession();
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Welcome, {session.name}</h1>
        <Nav />
      </div>
      <Pet userId={session.userId} />
    </div>
  );
}