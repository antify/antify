import mongoose from 'mongoose';
import { settingSchema } from '~~/server/db/tenant/setting';

export default defineEventHandler(async (event) => {
  const settingsModel = mongoose.model('setting', settingSchema);

  return {
    data: true,
  };
});
