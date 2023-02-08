import { H3Event } from 'h3';

export default defineEventHandler(() => {
  useNitroApp().hooks.hook('before:media-[mediaId].put', (event: H3Event) => {
    console.log('before:media-[mediaId].put');
  });

  useNitroApp().hooks.hook('before:media-[mediaId].get', (event: H3Event) => {
    console.log('before:media-[mediaId].get');
  });

  useNitroApp().hooks.hook(
    'before:media-[mediaId].delete',
    (event: H3Event) => {
      console.log('before:media-[mediaId].delete');
    }
  );

  useNitroApp().hooks.hook('before:media.get', (event: H3Event) => {
    console.log('before:media.get');
  });

  useNitroApp().hooks.hook('before:media.post', (event: H3Event) => {
    console.log('before:media.post');
  });
});
