<script lang="ts">
  import "../app.css";
  import TitleBar from "$lib/components/TitleBar.svelte";
  let { children } = $props();
</script>

<div class="h-screen w-screen flex flex-col overflow-hidden bg-sorbet-cream">
  <TitleBar />
  <div class="flex-1 overflow-hidden pt-10"> <!-- pt-10 matches TitleBar height -->
    {@render children()}
  </div>
</div>
