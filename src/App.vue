<script setup lang="ts">
import NavBar from './components/NavBar.vue'
import { useDark } from '@vueuse/core'

// Initialize dark mode
useDark()
</script>

<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 flex flex-col">
    <NavBar />
    
    <main class="flex-grow">
      <!-- Route transition with keep-alive for better UX -->
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <keep-alive include="HomeView">
            <component :is="Component" />
          </keep-alive>
        </transition>
      </router-view>
    </main>
    
    <footer class="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-8 mt-12 transition-colors duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-500 dark:text-slate-400">
        <p>© 2026 Apex. Built with Vue 3 & Tailwind v4.</p>
      </div>
    </footer>
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
