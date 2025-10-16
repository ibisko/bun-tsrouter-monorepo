module.exports = {
  apps: [
    {
      name: 'apps-server-fkdls',
      script: './dist/main.js',
      cwd: './apps/server',
      // 集群模式，共享同一个端口
      exec_mode: 'cluster',
      // 启动进程数量
      instances: 2,
      env: {
        NODE_ENV: 'development',
      },
    },
  ],
};
