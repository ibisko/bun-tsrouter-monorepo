import { config } from 'dotenv';
import path from 'path';

async function main() {
  config({ path: path.join(process.cwd(), './config/.env') });
  console.log('process.env.NODE_ENV:', process.env.NODE_ENV);
  if (process.env.NODE_ENV === 'development') {
    config({ path: path.join(process.cwd(), './config/development.env') });
  } else if (process.env.NODE_ENV === 'production') {
    config({ path: path.join(process.cwd(), './config/production.env') });
  }
}
main();
