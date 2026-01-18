<script lang="ts">
  import { historyStore, requestStore } from '$lib/stores';
  import { History, Trash2, ChevronRight } from 'lucide-svelte';
  import type { HistoryItem } from '$lib/stores';

  function loadRequest(item: HistoryItem) {
    requestStore.update(s => ({
      ...s,
      method: item.method,
      url: item.url
    }));
  }

  function clearHistory() {
    historyStore.set([]);
  }

  function formatTime(ts: number) {
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function getMethodColor(method: string) {
    switch (method) {
      case 'GET': return 'text-emerald-600 bg-emerald-100';
      case 'POST': return 'text-blue-600 bg-blue-100';
      case 'PUT': return 'text-orange-600 bg-orange-100';
      case 'DELETE': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  }
</script>

<div class="h-full flex flex-col bg-white/40 border-r border-sorbet-pink/20 w-64">
  <div class="p-4 flex items-center justify-between border-b border-sorbet-pink/10">
    <div class="flex items-center gap-2 text-sorbet-dark font-title text-sm">
      <History size={16} />
      <span>HISTORY</span>
    </div>
    <button on:click={clearHistory} class="text-sorbet-dark/40 hover:text-sorbet-red transition-colors" title="Clear History">
      <Trash2 size={14} />
    </button>
  </div>

  <div class="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
    {#each $historyStore as item (item.id)}
      <button
        on:click={() => loadRequest(item)}
        class="w-full text-left p-2.5 rounded-xl hover:bg-white/60 transition-all group border border-transparent hover:border-sorbet-pink/20"
      >
        <div class="flex items-center justify-between mb-1">
          <span class="text-[10px] font-bold px-1.5 py-0.5 rounded {getMethodColor(item.method)}">
            {item.method}
          </span>
          <span class="text-[10px] text-sorbet-dark/40">{formatTime(item.timestamp)}</span>
        </div>
        <div class="text-xs text-sorbet-dark/80 truncate font-mono opacity-80 group-hover:opacity-100">
          {item.url}
        </div>
      </button>
    {/each}
    
    {#if $historyStore.length === 0}
      <div class="p-4 text-center text-xs text-sorbet-dark/40 italic">
        No recent requests
      </div>
    {/if}
  </div>
</div>
