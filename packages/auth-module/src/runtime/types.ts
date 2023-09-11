import { User } from './server/datasources/schemas/user';
import { Client } from '@antify/ant-database';

// Fetch users (authEntity)
// Fixtures
// Extend schemas (to get db client)

export type DatabaseHandler = {
  findOneUser(client: Client, auth: string, password: string): Promise<User | null>
}

export { User } from './server/datasources/schemas/user';
