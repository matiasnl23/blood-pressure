<script setup>
useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' }
  ],
  link: [{ rel: 'icon', href: '/favicon.ico' }],
  htmlAttrs: { lang: 'es' }
})
useSeoMeta({ title: 'Tensión Arterial', description: 'Seguimiento personal de presión arterial' })
</script>

<template>
  <UApp>
    <NuxtPage />
  </UApp>
</template>
