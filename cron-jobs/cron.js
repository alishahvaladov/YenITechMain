const { CronJob } = require("cron");
const { createSalaryRecordAndSendEmail } = require("../api/salary/service");

class CronService {
  startSalaryCronJobs() {
    // ? once a month at 00:00 on the first day of the month
    let cronJob = new CronJob(
      "0 0 1 * *",
      async () => {
        try {
          createSalaryRecordAndSendEmail().then(() => console.log("Cron job was executed successfully"));
        } catch (err) {
          console.log(err);
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

module.exports = new CronService();
