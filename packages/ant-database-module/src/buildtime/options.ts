export interface ModuleOptions {
  tenantMongoUrl: string;
  coreMongoUrl: string;
}

export const validateModuleOptions = (options: ModuleOptions) => {
  if (!options.tenantMongoUrl) {
    throw new Error('Module antDatabase can not work without a tenantMongoUrl');
  }

  if (!options.coreMongoUrl) {
    throw new Error('Module antDatabase can not work without a coreMongoUrl');
  }
};
