module.exports = {
  apps: [
    {
      name: 'apps-server-fkdls',
      script: 'bun',
      args: '-r ./src/config.ts ./src/main.ts',
      cwd: './apps/server',
      // 集群模式，共享同一个端口
      // 启动进程数量
      instances: 2,
      env: {
        NODE_ENV: 'development',
      },

      output: '/Users/nnhu/Projects/base-project-templates/bun-tsrouter-monorepo/logs/output.log',
      error: '/Users/nnhu/Projects/base-project-templates/bun-tsrouter-monorepo/logs/error.log',
      log: '/Users/nnhu/Projects/base-project-templates/bun-tsrouter-monorepo/logs/stdout.log',

      // 日志选项
      log_type: 'json', // 指定日志格式
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z', // 时间格式
      merge_logs: true, // 合并不同实例的日志
      time: true, // 日志前添加时间戳

      // 日志轮转（PM2模块）
      log_rotate: {
        max_size: '10M', // 单个日志文件最大10MB
        retain: 7, // 保留7个备份
        compress: true, // 压缩旧的日志文件
        date_format: 'YYYY-MM-DD_HH-mm', // 轮转文件的时间格式
      },
    },
  ],
};
