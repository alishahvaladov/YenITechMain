import { CronJob } from "cron";
import { getCalculatedSalary } from "../api/salary/service";

class CronService {
  startCronJob() {
    let cronJob = new CronJob(
      "0 0 1 * *",
      async () => {
        try {
          // getCalculatedSalary().then()
        } catch (err) {
          console.log(err)
          throw new Error(err);
        }
      },
      null,
      true,
      "Asia/Baku"
    );

    if (!cronJob.running) {
      cronJob.start();
    }
  }
}

// const cronService = new CronService();
// cronService.startCronJob();
