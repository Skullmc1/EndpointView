<script lang="ts">
  import { responseStore, loadingStore } from '$lib/stores';
  import { Clock, Database, AlertCircle, Copy, WrapText, FileJson } from 'lucide-svelte';
  import { fade, fly } from 'svelte/transition';

  let isWrapped = false;
  let copyFeedback = false;

  function formatBody(body: string) {
    try {
      return JSON.stringify(JSON.parse(body), null, 2);
    } catch {
      return body;
    }
  }

  function getStatusColor(status: number) {
    if (status >= 200 && status < 300) return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    if (status >= 300 && status < 400) return 'bg-blue-100 text-blue-700 border-blue-200';
    if (status >= 400) return 'bg-sorbet-red/20 text-sorbet-red border-sorbet-red/30';
    return 'bg-gray-100 text-gray-700 border-gray-200';
  }

  async function copyToClipboard() {
    if (!$responseStore?.body) return;
    try {
      await navigator.clipboard.writeText(formatBody($responseStore.body));
      copyFeedback = true;
      setTimeout(() => copyFeedback = false, 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  }
</script>

<div class="h-full flex flex-col bg-white/40 rounded-2xl shadow-sm backdrop-blur-sm border border-white/50 relative overflow-hidden group">
  {#if $loadingStore}
    <div class="absolute inset-0 flex items-center justify-center bg-white/50 z-20 backdrop-blur-sm" transition:fade>
      <div class="flex flex-col items-center gap-4">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-sorbet-peach border-t-sorbet-red"></div>
        <span class="font-title text-sorbet-dark/50 tracking-widest text-xs animate-pulse">FETCHING...</span>
      </div>
    </div>
  {/if}

  {#if $responseStore}
    <!-- Response Header -->
    <div class="flex items-center justify-between p-4 border-b border-sorbet-pink/20 bg-white/20">
      <div class="flex items-center gap-4">
        <div class="px-3 py-1 rounded-xl border font-bold text-sm shadow-sm {getStatusColor($responseStore.status)}">
          {$responseStore.status} {$responseStore.error ? 'ERROR' : 'OK'}
        </div>
        
        <div class="hidden sm:flex items-center gap-4 text-xs text-sorbet-dark/60 font-sans">
          <div class="flex items-center gap-1.5" title="Latency">
            <Clock size={14} />
            <span>{$responseStore.time_ms} ms</span>
          </div>
          <div class="flex items-center gap-1.5" title="Size">
            <Database size={14} />
            <span>{$responseStore.size_bytes} B</span>
          </div>
        </div>
      </div>

      <!-- Toolbar -->
      <div class="flex items-center gap-2">
        <button 
          on:click={() => isWrapped = !isWrapped}
          class="p-1.5 rounded-lg hover:bg-sorbet-peach/50 text-sorbet-dark/60 hover:text-sorbet-dark transition-all"
          title="Toggle Word Wrap"
        >
          <WrapText size={16} class={isWrapped ? 'text-sorbet-red' : ''} />
        </button>
        <button 
          on:click={copyToClipboard}
          class="p-1.5 rounded-lg hover:bg-sorbet-peach/50 text-sorbet-dark/60 hover:text-sorbet-dark transition-all relative"
          title="Copy Body"
        >
          <Copy size={16} />
          {#if copyFeedback}
             <span class="absolute -top-8 -left-4 bg-sorbet-dark text-white text-[10px] py-1 px-2 rounded-lg shadow-lg" transition:fly={{y: 5}}>
               Copied!
             </span>
          {/if}
        </button>
      </div>
    </div>

    <!-- Response Body -->
    {#if $responseStore.error}
       <div class="p-6 m-4 bg-sorbet-red/5 border border-sorbet-red/20 rounded-2xl text-sorbet-dark text-sm flex gap-3 items-start">
         <AlertCircle size={20} class="text-sorbet-red mt-0.5 shrink-0" />
         <div class="flex flex-col gap-1">
           <span class="font-bold text-sorbet-red font-title">Request Failed</span>
           <span class="whitespace-pre-wrap font-mono opacity-80">{$responseStore.error}</span>
         </div>
       </div>
    {:else}
      <div class="flex-1 overflow-hidden relative">
        <div class="absolute inset-0 overflow-auto custom-scrollbar p-4">
          <pre 
            class="font-mono text-sm text-sorbet-dark bg-white/40 rounded-xl border border-sorbet-pink/10 min-h-full p-4 transition-all duration-300"
            class:whitespace-pre-wrap={isWrapped}
            class:whitespace-pre={!isWrapped}
          >{formatBody($responseStore.body)}</pre>
        </div>
      </div>
    {/if}

  {:else}
    <!-- Empty State -->
    <div class="flex-1 flex flex-col items-center justify-center text-sorbet-dark/30 select-none">
      <div class="relative mb-6">
        <div class="w-24 h-24 bg-sorbet-peach/30 rounded-full animate-pulse"></div>
        <div class="absolute inset-0 flex items-center justify-center">
          <FileJson size={48} class="text-sorbet-pink opacity-80" />
        </div>
        <!-- Decorative dots -->
        <div class="absolute -top-2 -right-2 w-4 h-4 bg-sorbet-red/20 rounded-full"></div>
        <div class="absolute bottom-0 -left-2 w-6 h-6 bg-sorbet-cream border-2 border-sorbet-pink/20 rounded-full"></div>
      </div>
      <p class="font-title text-lg text-sorbet-dark/40 mb-2">Ready to Explore</p>
      <p class="font-sans text-sm text-sorbet-dark/30 max-w-[200px] text-center">
        Enter a URL and hit Send to see the magic happen
      </p>
    </div>
  {/if}
</div>