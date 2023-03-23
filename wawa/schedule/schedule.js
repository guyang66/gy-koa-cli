module.exports = app => {
  const { $log4 } = app
  const { commonLogger } = $log4
  return {
    /** cron风格调度格式
     * *    *    *    *    *    *
     ┬    ┬    ┬    ┬    ┬    ┬
     │    │    │    │    │    |
     │    │    │    │    │    └ 一周的星期 (0 - 7) (0 or 7 is Sun)
     │    │    │    │    └───── 月份 (1 - 12)
     │    │    │    └────────── 月份中的日子 (1 - 31)
     │    │    └─────────────── 小时 (0 - 23)
     │    └──────────────────── 分钟 (0 - 59)
     └───────────────────────── 秒 (0 - 59, OPTIONAL)
     */
    open: true,
    interval: '0,30 * * * * *', // 每30秒执行一次
    handler: async () => {
      console.log('定时任务 >>>>> 【开始模拟清理游客数据】')
      // do clear action...
      commonLogger.info('【定时器触发】- 清理游客数据')
    }
  }
}
