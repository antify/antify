import { Test } from '../datasources/test.schema';
import { extendSchemas } from '../datasources/schema.extensions';
import { useAntify } from '../../../src/runtime/server/utils/useAntify';

export default defineEventHandler(async (event) => {
  const client = await useAntify().getDatabaseClient(event, extendSchemas);
  const TestModel = client.getModel<Test>('test');
  await TestModel.insertMany([{ title: 'Foo title', content: 'Foo content' }]);

  return {};
});
