import { evolvePet } from "../lib/actions";
import { canEvolve, getDailyGoal } from "../lib/utils";
import { getPetData } from "../lib/dal";
import PetModel from "./pet-model";
import Timer from "./timer";

export default async function Pet({ userId }: { userId: string }) {
  const petData = await getPetData(userId);
  const dailyGoal = getDailyGoal(petData.stage);
  const dailyProgress = dailyGoal - petData.daily_minutes;
  const dailyTime = petData.daily_minutes;

  // calculate mood
  // 1) happy: daily goal completed
  // 2) sad: before 12 and daily goal not completed
  // 3) angry: after 12 and daily goal not completed
  // 4) shock: when user clicks the pet
  // 5) egg: when petData.stage == egg
  
  const now = new Date();
  const hours = now.getHours();
  let mood: "happy" | "sad" | "angry" | "shock" | "egg" = "happy";

  if (petData.stage === "egg") {
    mood = "egg";
  } else if (dailyProgress <= 0) {
    mood = "happy";
  } else if (hours < 12) {
    mood = "sad";
  } else {
    mood = "angry";
  }

  return (
    <div className="space-y-4">
      <PetModel stage={petData.stage} mood={mood} />
      <Timer userId={userId} dailyGoal={getDailyGoal(petData.stage)} />
      {canEvolve(petData.stage, petData.total_minutes) && (
        <form className="flex items-center justify-center" action={evolvePet.bind(null, userId)}>
          <button type="submit" className="cursor-pointer w-full bg-secondary-500 drop-shadow-evolve text-white p-2 rounded-2xl">
            Evolve
          </button>
        </form>
      )}
      <p>Stage: {petData.stage}</p>
      <p>Daily Goal Progress: {dailyProgress >= 0 ? dailyProgress + " min left" : "Daily Goal Completed"}</p>
      <p>Time Spent Today: {dailyTime} min</p>
      <p>Streak: {petData.streak} days</p>
    </div>
  );
}