export default defineEventHandler(async (event) => {
  if (process.env.NODE_ENV === 'production') {
    return;
  }

  return await useStorage().getItem(`templates/dev.html`);
});
