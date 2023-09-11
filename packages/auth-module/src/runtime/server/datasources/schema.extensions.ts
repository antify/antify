import { Client } from '@antify/ant-database';
import mongoose from 'mongoose';

export const extendSchemas = (client: Client) => {
  client.getSchema('users').add({
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: false,
    },
    isSuperAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    isBanned: {
      type: Boolean,
      required: true,
      default: false,
    },
    invites: [
      {
        invitedAt: {
          type: Number,
          required: true,
        },
        code: {
          type: String,
          required: true,
        },
        context: {
          type: String,
          required: true,
        },
        tenantId: {
          type: String,
        },
      },
    ],
    forgotPassword: {
      type: {
        sendAt: {
          type: Date,
          required: true,
        },
        code: {
          type: String,
          required: true,
        },
      },
      default: null,
    },
    // TODO:: may make unidirectional?
    // tenantAccesses: {
    //   type: [
    //     {
    //       tenant: {
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: 'user_tenant_accesses',
    //       },
    //     },
    //   ],
    //   required: true,
    // },
  });

  // TODO:: may move to each tenant with related id?
  client.getSchema('roles').add({
    name: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    permissions: [
      {
        type: String,
        required: true,
      },
    ],
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'tenants',
      required: true,
    },
  });

  client.getSchema('tenants').add({
    name: {
      type: String,
      required: true,
    },
  });

  client.getSchema('user_tenant_accesses').add({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'tenants',
      required: true,
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'roles',
      required: true,
    },
    isBanned: {
      type: Boolean,
      required: true,
      default: false,
    },
    isPending: {
      type: Boolean,
      required: true,
      default: true,
    },
  });
};
