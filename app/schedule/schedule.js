module.exports = app => {
  const { $log4 } = app
  const { commonLogger } = $log4
  return {
    /** cron style format
     *    *    *    *    *    *    *
     ┬    ┬    ┬    ┬    ┬    ┬
     │    │    │    │    │    |
     │    │    │    │    │    └ the day of the week (0 - 7) (0 or 7 is Sun)
     │    │    │    │    └───── month (1 - 12)
     │    │    │    └────────── the day of the month (1 - 31)
     │    │    └─────────────── hour (0 - 23)
     │    └──────────────────── minute (0 - 59)
     └───────────────────────── second (0 - 59, OPTIONAL)
     */
    open: true,
    interval: '0,30 * * * * *', // it means execute every 30 seconds
    handler: async () => {
      console.log('the schedule task has triggered  >>>>> 【the schedule tasks】')
      // do clear action...
      commonLogger.info('the schedule task has triggered  >>>>> 【the schedule tasks】')
    }
  }
}
