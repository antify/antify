<script setup>
definePageMeta({
  middleware: () => {
    return {
      name: 'admin-tenantId-dashboard',
      params: { tenantId: useRoute().params.tenantId }
    }
  }
})
</script>
