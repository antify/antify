import mongoose from 'mongoose';

export default defineEventHandler(async (event) => {
  useCoreClient()
    .getSchema('users')
    .add({
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

  useCoreClient()
    .getSchema('roles')
    .add({
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

  useCoreClient()
    .getSchema('tenants')
    .add({
      name: {
        type: String,
        required: true,
      },
    });

  useCoreClient()
    .getSchema('user_tenant_accesses')
    .add({
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

  useCoreClient()
    .getSchema('mail_templates')
    .add({
      title: {
        type: String,
        required: true,
      },
      content: {
        type: String,
        required: true,
      },
    });
});
