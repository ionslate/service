import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.join(process.cwd(), 'src/__tests__/__testUtils__/test.env'),
});
