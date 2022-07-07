<template>
    <div class="toaster">
        <div v-for="(toast, index) in $toaster.getToasts()" :key="index" :value="!!toast.text" :type="toast.type">
            {{ toast.text }}
        </div>
    </div>
</template>

<style scoped>
.toaster {
    position: fixed;
    right: 1rem;
    bottom: 2rem;
    width: 20rem;
    z-index: 999;
}
</style>
