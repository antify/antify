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
    name: {
      type: String,
      required: true,
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
    profilePicture: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'medias',
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

  client.getSchema('mail_templates').add({
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  });

  client.getSchema('medias').add({
    title: {
      type: String,
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      required: true,
    },
  });
};
