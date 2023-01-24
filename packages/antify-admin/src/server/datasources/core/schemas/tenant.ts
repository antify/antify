import { SchemaDefinition } from 'mongoose';
import { Tenant as BaseTenant } from '@antify/ant-database/src/module';

export interface Tenant extends BaseTenant {
  color: String;
}

export const tenantSchemaDefinition: SchemaDefinition<Tenant> = {
  color: {
    type: String,
    //required: true,
  },
};
