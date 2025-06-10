import { evolvePet } from "../lib/actions";
import { canEvolve, getDailyGoal } from "../lib/utils";
import { getPetData } from "../lib/dal";
import PetModel from "./pet-model";
import Timer from "./timer";
import DynamicBackground from "./dynamic-background";

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
  let timeOfDay: "morning" | "afternoon" | "night" = "morning";
  // mood
  if (petData.stage === "egg") {
    mood = "egg";
  } else if (dailyProgress <= 0) {
    mood = "happy";
  } else if (hours < 12) {
    mood = "sad";
  } else {
    mood = "angry";
  }
  // time of day
  if (hours < 12) {
    timeOfDay = "morning";
  } else if (hours >= 12 && hours <= 18) {
    timeOfDay = "afternoon"
  } else {
    timeOfDay = "night"
  }

  return (
    <>
      <DynamicBackground timeOfDay={timeOfDay} />
      <div className="space-y-4">
        <PetModel stage={petData.stage} mood={mood} />
        {canEvolve(petData.stage, petData.total_minutes) ? (
          <form className="flex items-center justify-center" action={evolvePet.bind(null, userId)}>
            <button type="submit" className="cursor-pointer w-full bg-secondary-700 drop-shadow-evolve text-white p-2 rounded-2xl">
              Evolve
            </button>
          </form>
        ) : 
        <Timer userId={userId} dailyGoal={getDailyGoal(petData.stage)} />
        }
        <div className="space-y-2">
          <div className="flex flex-col items-center justify-center bg-white p-2 rounded-2xl">
            <p className="self-start text-xs">Stage: </p>
            <p className="text-xs font-bold">{petData.stage}</p>
          </div>
          <div className="flex flex-col items-center bg-white p-2 rounded-2xl">
            <p className="self-start text-xs">Daily Goal Progress: </p>
            <p className="text-xs font-bold">{dailyProgress >= 0 ? dailyProgress + " min left" : "Daily Goal Completed"}</p>
          </div>
          <div className="flex flex-col items-center bg-white p-2 rounded-2xl">
            <p className="self-start text-xs">Time Spent Today: </p>
            <p className="text-xs font-bold">{dailyTime} min</p>
          </div>
          <div className="flex flex-col items-center bg-white p-2 rounded-2xl">
            <p className="self-start text-xs">Streak: </p>
            <p className="text-xs font-bold">{petData.streak} days</p>
          </div>
        </div>
      </div>
    </>
  );
}