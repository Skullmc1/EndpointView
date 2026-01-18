<script lang="ts">
  import HistorySidebar from '$lib/components/HistorySidebar.svelte';
  import RequestBuilder from '$lib/components/RequestBuilder.svelte';
  import ResponseViewer from '$lib/components/ResponseViewer.svelte';
</script>

<div class="h-full flex">
  <!-- Sidebar -->
  <HistorySidebar />

  <!-- Main Content -->
  <div class="flex-1 flex flex-col p-4 gap-4 overflow-hidden">
    <div class="h-1/2">
      <RequestBuilder />
    </div>
    <div class="h-1/2">
      <ResponseViewer />
    </div>
  </div>
</div>