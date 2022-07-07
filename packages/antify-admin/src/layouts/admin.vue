<script setup>
// import Nav from "@/components/Nav";

// export default {
//   components: {Nav},
//   head() {
//     return {
//       bodyAttrs: {
//         class: 'h-full bg-white'
//       },
//       htmlAttrs: {
//         class: 'h-full overflow-hidden'
//       },
//     };
//   },
//   data() {
//     return {
//       menuVisible: false
//     }
//   }
// }
</script>

<template>
  <Nav>
    <main class="flex-1 bg-gray-100 min-h-screen">
      <slot/>

      <Toaster/>
    </main>
  </Nav>
</template>