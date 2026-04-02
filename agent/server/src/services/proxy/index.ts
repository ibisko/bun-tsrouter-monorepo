/**
 * 代理端口，用于查看请求的参数和响应的结果
 */

type LoggerParam = {
  step: string;
  data: any;
  status?: number;
};
const logger = ({ step, data, status }: LoggerParam) => {
  const logmessage = JSON.stringify({ step, data, status });
  // todo 写入文件
  // todo 返回结果
};

type ProxyParam = {
  port: number;
  targetUrl: string;
};
const proxy = async ({ port, targetUrl }: ProxyParam) => {
  Bun.serve({
    port,
    async fetch(req, server) {
      req.headers.set('host', targetUrl); // 指向正确的host，避免死循环
      const response = await fetch(targetUrl, { headers: req.headers });
      if (!response.ok) {
        throw new Response('', { status: response.status });
      }

      return new Response();
    },
  });
};

async function main() {}
main();
