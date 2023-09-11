import { Client } from '@antify/ant-database';

export const extendSchemas = (client: Client) => {
    client.getSchema('mail_templates').add({
        mailTemplateId: {
            type: String,
            required: true,
            unique: true,
        },
        title: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true
        },
    });
};
