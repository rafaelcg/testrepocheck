const fastify = require('fastify')({ logger: true });

// Mock users data
const users = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com' },
  { id: 3, name: 'Charlie Brown', email: 'charlie@example.com' },
];

// GET /healthcheck - Health check endpoint with performance monitoring
fastify.get('/healthcheck', async (request, reply) => {
  const memoryUsage = process.memoryUsage();

  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: {
      heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024) + ' MB',
      heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024) + ' MB',
      rss: Math.round(memoryUsage.rss / 1024 / 1024) + ' MB',
    },
    cpu: process.cpuUsage(),
  };
});

// GET /users - Get all users
fastify.get('/users', async (request, reply) => {
  return users;
});

// GET /users/:id - Get a user by ID
fastify.get('/users/:id', async (request, reply) => {
  const { id } = request.params;
  const user = users.find((u) => u.id === parseInt(id));

  if (!user) {
    reply.code(404);
    return { error: 'User not found' };
  }

  return user;
});

// Start the server
const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
