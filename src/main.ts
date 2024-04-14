import { TimedTasks } from "../lib/main";

const timedTasks = new TimedTasks("Timeout", ["name"]);

timedTasks.create("name", () => {}, 1000, "执行完成咯");

timedTasks.on("name", (res) => {
  console.log(res); // "执行完成咯"
});
