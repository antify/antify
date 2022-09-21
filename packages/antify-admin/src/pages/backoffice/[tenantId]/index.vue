<script setup>
definePageMeta({
  middleware: () => {
    return {
      name: 'backoffice-tenantId-dashboard',
      params: { tenantId: useRoute().params.tenantId },
    };
  },
});
</script>
