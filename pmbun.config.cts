export default {
  port: 443,
  tls: {
    key: '',
    cert: '',
  },
  servers: [
    {
      name: 'static-dist',
      hostname: 'blog.ibisko.fun',
      tls: {
        key: '',
        cert: '',
      },
      static: '/etc/xxx/web/dist',
    },
    {
      name: 'api-demo',
      hostname: 'api.ibisko.fun',
      tls: {
        key: '',
        cert: '',
      },
      cwd: '/opt/xxx/demo',
      bunScript: './src/main.ts',
      instances: 1,
      env: {
        NODE_ENV: 'development',
      },
      log: {
        max_size: '10M', // 触发日志轮转的文件大小
        retain: 7, // 保留天数
      },
    },
  ],
};
