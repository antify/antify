import { defineDatabaseHandler, User } from '#authModule';

export default defineDatabaseHandler({
  async findOneUser(client, auth: string, password: string): Promise<User | null> {
    return client
      .getModel<User>('users')
      .findOne({ email: auth, password });
  }
});
