import Pet from "../ui/pet";
import Timer from "../ui/timer";
import { getPetData, verifySession } from "../lib/dal";
import { getDailyGoal } from "../lib/utils";

export default async function Dashboard() {
  const session = await verifySession();
  const petData = await getPetData(session.userId);
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-bold">Welcome, {session.name}</h1>
      <Pet userId={session.userId} />
      <Timer userId={session.userId} dailyGoal={getDailyGoal(petData.stage)} />
    </div>
  );
}