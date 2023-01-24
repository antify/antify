<script setup>
definePageMeta({
  middleware: () => {
    return {
      name: 'cockpit-dashboard',
      params: { tenantId: useRoute().params.tenantId },
    };
  },
});
</script>
