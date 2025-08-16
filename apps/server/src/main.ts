import { sleep } from '@packages/utils';
import { format } from 'date-fns';
import fastify from 'fastify';
import path from 'path';

const app = fastify({
  logger: {
    // timestamp() {
    //   return `,"time":"${format(new Date(), 'yyyy/MM/dd hh:mm:ss')}"`;
    // },
    formatters: {
      level(label) {
        return { level: label };
      },
      bindings() {
        return {};
      },
    },
    // file: path.resolve(__dirname, '../../../', 'logs', `${format(new Date(), 'yyyy-MM-dd_hh:mm:ss')}.log`),
    file: path.resolve(__dirname, '../../../', 'logs', `dev.log`),
  },
  trustProxy: true, // 信任Nginx代理，拿到用户ip
});

app.log.info('start');
