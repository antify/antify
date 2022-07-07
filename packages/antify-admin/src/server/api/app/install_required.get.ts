import { apiAppInstallService } from "./install.service";

export type AppInstallRequiredResponse = {
  requireInstall: boolean
}

export default defineEventHandler<AppInstallRequiredResponse>(async (event) => {
  const requireInstall = await apiAppInstallService.requireInstall();

  return {
    requireInstall
  };
});
