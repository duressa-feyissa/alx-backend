import { createClient } from 'redis';
import redis from 'redis';

const { promisify } = require('util');

const client = createClient();

client.on('connect', () => console.log('Redis client connected to the server'));

client.on('error', (error) => console.log(`Redis client not connected to the server: ${error.message}`));

function setNewSchool(schoolName, value) {
  client.set(schoolName, value, redis.print);
}

const redis_get = promisify(client.get).bind(client);

async function displaySchoolValue(schoolName) {
  const value = await redis_get(schoolName);
  console.log(value);
}

displaySchoolValue('Holberton');
setNewSchool('HolbertonSanFrancisco', '100');
displaySchoolValue('HolbertonSanFrancisco');
