import { Setting } from '../../schemas/tenant/setting.extension';

export default defineEventHandler(async (event) => {
  const tenantClient = useTenantClient();
  await tenantClient.connect(event.context.params.tenantId)
  const SettingModel = tenantClient.getModel<Setting>('settings');

  await new SettingModel({
    timezone: 'Europe/Berlin',
    language: 'de-DE',
  }).save();

  return await SettingModel.find({});
});
