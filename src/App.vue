<script setup lang="ts">
import { ipcRenderer } from 'electron';
import { onMounted } from 'vue';
import { useDark, useToggle } from "@vueuse/core";
const Store = window.require("electron-store");
const store = new Store();

const isDark = useDark();
const toggleDark = useToggle(isDark);

onMounted(() => {
  ipcRenderer.on("theme-change", (event, arg) => {
    const theme = store.get("theme");
    if (theme == "dark") {
      toggleDark(true);
    } else if (theme == "light") {
      toggleDark(false);
    } else {
      if (arg === 'dark') {
      toggleDark(true);
    } else {
      toggleDark(false);
    }
    }
    
  });
});
</script>

<template>
  <router-view></router-view>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
