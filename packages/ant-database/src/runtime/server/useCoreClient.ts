import mongoose, { Model, Schema, Connection } from 'mongoose';

export class SchemaContainer {
  private static instance: SchemaContainer;
  private constructor() {}
  schemas: Record<string, Schema> = {};
  connection: Connection;

  public static getInstance(): SchemaContainer {
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

  async connect(): Promise<SchemaContainer> {
    if (!this.connection) {
      this.connection = await mongoose
        .createConnection(useRuntimeConfig().antDatabase.coreMongoUrl, {
          // TODO:: check this - should not stay there
          authSource: 'admin',
        })
        .asPromise();

      this.connection.on('error', (err) => {
        console.error(`Mongoose connection error: ${err}`);
        process.exit(0);
      });
    }

    return this;
  }
}

export const useCoreClient = (): SchemaContainer => {
  return SchemaContainer.getInstance();
};
