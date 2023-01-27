<script lang="ts" setup>
const onUpload = async (event) => {
  let formData = new FormData();

  for (let i = 0; i < event.target.files.length; i++) {
    formData.append(`file-${i}`, event.target.files[i]);
  }
  console.dir(formData);
  await useFetch('http://localhost:3000/upload', {
    method: 'POST',
    body: formData,
  });
};
</script>

<template>
  <div>
    <h1>Ant document storage playground!</h1>

    <label>
      Upload Image <br />
      <input
        type="file"
        @change="onUpload"
      />
    </label>

    <AntUpload
      label="Upload Files"
      @change="onUpload"
    />
  </div>
</template>

<style scoped></style>
