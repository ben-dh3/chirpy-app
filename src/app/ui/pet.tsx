import { evolvePet } from "../lib/actions";
import { canEvolve, getDailyGoal } from "../lib/utils";
import { getPetData } from "../lib/dal";
import PetModel from "./pet-model";

export default async function Pet({ userId }: { userId: string }) {
  const petData = await getPetData(userId);
  const dailyGoal = getDailyGoal(petData.stage);
  const dailyProgress = dailyGoal - petData.daily_minutes;
  const dailyTime = petData.daily_minutes;

  // calculate mood
  // textures: happy, sad, angry, shock, egg
  // Todos:
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
    // Happy: daily goal completed
    mood = "happy";
  } else if (hours < 12) {
    // Sad: before 12 and daily goal not completed
    mood = "sad";
  } else {
    // Angry: after 12 and daily goal not completed
    mood = "angry";
  }

  return (
    <div className="">
      {/* <PetModel stage={petData.stage} /> */}
      <PetModel stage={petData.stage} mood={mood} />
      <p>Stage: {petData.stage}</p>
      <p>Daily Goal Progress: {dailyProgress >= 0 ? dailyProgress + " min left" : "Daily Goal Completed"}</p>
      <p>Time Spent Today: {dailyTime} min</p>
      <p>Streak: {petData.streak} days</p>
      {canEvolve(petData.stage, petData.total_minutes) && (
        <form action={evolvePet.bind(null, userId)}>
          <button className="p-4 rounded-2xl cursor-pointer" type="submit">Evolve Pet</button>
        </form>
      )}
    </div>
  );
}