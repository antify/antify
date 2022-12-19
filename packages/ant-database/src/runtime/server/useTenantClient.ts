import mongoose, { Model, Schema, Connection } from 'mongoose';

export class SchemaContainer {
  private static instance: SchemaContainer;
  private constructor() {}
  schemas: Record<string, Schema> = {};
  connection: Connection;

  static getInstance(): SchemaContainer {
    if (!SchemaContainer.instance) {
      SchemaContainer.instance = new SchemaContainer();
    }

    return SchemaContainer.instance;
  }

  getSchema<T>(schemaName: string): Schema {
    if (!this.schemas[schemaName]) {
      this.schemas[schemaName] = new Schema<T>();
    }

    return this.schemas[schemaName];
  }

  getModel<T>(modelName: string): Model<T> {
    return this.connection.model<T>(modelName, this.schemas[modelName]);
  }

  async connect(tenantId: string) {
    const dbName = `tenant_${tenantId}`;

    await this.createConnection();

    console.log(`Switched to db ${dbName}`);

    this.connection = this.connection.useDb(dbName, { useCache: true });

    return this;
  }

  async createConnection(): Promise<Connection> {
    if (this.connection) {
      return this.connection;
    }

    this.connection = await mongoose
      .createConnection(`${useRuntimeConfig().antDatabase.tenantMongoUrl}`, {
        // TODO:: check this - should not stay there
        authSource: 'admin',
      })
      .asPromise();

    this.connection.on('error', (err) => {
      console.log(
        `Mongoose connection error: ${err} with connection info ${JSON.stringify(
          process.env.MONGODB_URL
        )}`
      );
      process.exit(0);
    });

    return this.connection;
  }
}

export const useTenantClient = (): SchemaContainer => {
  return SchemaContainer.getInstance();
};
