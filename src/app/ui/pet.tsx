import { evolvePet } from "../lib/actions";
import { canEvolve, getDailyGoal } from "../lib/utils";
import { getPetData } from "../lib/dal";
import PetModel from "./pet-model";

export default async function Pet({ userId }: { userId: string }) {
  const petData = await getPetData(userId);
  const dailyGoal = getDailyGoal(petData.stage);
  const dailyProgress = dailyGoal - petData.daily_minutes;
  const dailyTime = petData.daily_minutes;

  return (
    <div className="">
      {/* <PetModel stage={petData.stage} /> */}
      <PetModel />
      <p>Stage: {petData.stage}</p>
      <p>Daily Goal Progress: {dailyProgress >= 0 ? dailyProgress + " min left" : "Daily Goal Completed"}</p>
      <p>Time Spent Today: {dailyTime} min</p>
      <p>Streak: {petData.streak} days</p>
      {canEvolve(petData.stage, petData.total_minutes) && (
        <form action={evolvePet.bind(null, userId)}>
          <button type="submit">Evolve Pet</button>
        </form>
      )}
    </div>
  );
}