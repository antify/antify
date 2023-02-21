import { Test } from '../datasources/test.schema';
import { extendSchemas } from '../datasources/schema.extensions';
// TODO:: fix import
import { useAntify } from '../../../src/runtime/server/utils/useAntify';
// import { useAntify } from '#antify';

export default defineEventHandler(async (event) => {
  const client = await useAntify().getDatabaseClient(event, extendSchemas);
  const TestModel = client.getModel<Test>('test');
  const tests = await TestModel.find();

  return tests.map((test) => ({
    id: test.id,
    title: test.title,
    content: test.content,
  }));
});
