import config from '@root/config/config';
import { createContainer } from '@root/container';
import server from '@root/server';

async function main() {
  const container = await createContainer();

  const app = await server(container);

  app.listen(config.port, async () => {
    console.info(`Anti-Materiel Service is listening on port: ${config.port}`);

    console.info(
      `GraphQL endpoint available at: http://localhost:${config.port}/graphql`,
    );
  });
}

main().catch(console.error);
