<script lang="ts">
  import { requestStore, responseStore, loadingStore, historyStore } from '$lib/stores';
  import { invoke } from '@tauri-apps/api/core';
  import Button from './ui/Button.svelte';
  import Input from './ui/Input.svelte';
  import Select from './ui/Select.svelte';
  import { Play, Plus, Trash2 } from 'lucide-svelte';
  import { cn } from '$lib/utils';
  
  let activeTab: 'params' | 'headers' | 'body' = 'params';

  const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];

  async function sendRequest() {
    loadingStore.set(true);
    responseStore.set(null);

    const req = $requestStore;
    
    // Prepare headers map
    const headersMap: Record<string, string> = {};
    req.headers.forEach(h => {
      if (h.enabled && h.key) headersMap[h.key] = h.value;
    });

    // Append query params to URL
    let finalUrl = req.url;
    const queryParts = req.queryParams
      .filter(p => p.enabled && p.key)
      .map(p => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`)
      .join('&');
    
    if (queryParts) {
      finalUrl += (finalUrl.includes('?') ? '&' : '?') + queryParts;
    }

    try {
      const res: any = await invoke('execute_request', {
        request: {
          method: req.method,
          url: finalUrl,
          headers: headersMap,
          body: req.method !== 'GET' ? req.body : null,
        }
      });

      responseStore.set(res);

      // Add to history
      historyStore.update(h => {
        const newItem = {
          id: crypto.randomUUID(),
          timestamp: Date.now(),
          method: req.method,
          url: req.url
        };
        return [newItem, ...h.slice(0, 49)]; // Keep last 50
      });

    } catch (err: any) {
      responseStore.set({
        status: 0,
        time_ms: 0,
        headers: {},
        body: '',
        size_bytes: 0,
        error: typeof err === 'string' ? err : JSON.stringify(err)
      });
    } finally {
      loadingStore.set(false);
    }
  }

  function addHeader() {
    requestStore.update(s => ({ ...s, headers: [...s.headers, { key: '', value: '', enabled: true }] }));
  }

  function removeHeader(index: number) {
    requestStore.update(s => ({ ...s, headers: s.headers.filter((_, i) => i !== index) }));
  }

  function addParam() {
    requestStore.update(s => ({ ...s, queryParams: [...s.queryParams, { key: '', value: '', enabled: true }] }));
  }

  function removeParam(index: number) {
    requestStore.update(s => ({ ...s, queryParams: s.queryParams.filter((_, i) => i !== index) }));
  }
</script>

<div class="flex flex-col h-full bg-white/70 rounded-2xl p-4 shadow-md backdrop-blur-md border border-white/60">
  <!-- Top Bar: Method + URL + Send -->
  <div class="flex gap-2 mb-4">
    <Select bind:value={$requestStore.method} options={methods} className="w-32" />
    <Input bind:value={$requestStore.url} placeholder="https://api.example.com/v1/resource" className="flex-1" />
    <Button onclick={sendRequest} disabled={$loadingStore}>
      <div class="flex items-center gap-2">
        <Play size={16} class={$loadingStore ? 'animate-spin' : ''} />
        <span class="font-bold">SEND</span>
      </div>
    </Button>
  </div>

  <!-- Tabs -->
  <div class="flex gap-4 mb-4 border-b border-sorbet-pink/20">
    {#each ['params', 'headers', 'body'] as tab}
      <button
        class={cn(
          "px-4 py-2 font-sans text-sm transition-colors relative",
          activeTab === tab ? "text-sorbet-red font-bold" : "text-sorbet-dark/60 hover:text-sorbet-dark"
        )}
        on:click={() => activeTab = tab as any}
      >
        {tab.toUpperCase()}
        {#if activeTab === tab}
          <div class="absolute bottom-0 left-0 right-0 h-0.5 bg-sorbet-red rounded-t-full"></div>
        {/if}
      </button>
    {/each}
  </div>

  <!-- Tab Content -->
  <div class="flex-1 overflow-y-auto pr-2 custom-scrollbar">
    {#if activeTab === 'params'}
      <div class="space-y-2">
        <div class="flex justify-between items-center mb-2">
          <span class="text-xs font-title text-sorbet-dark/70 uppercase tracking-wider font-bold">Query Parameters</span>
          <button on:click={addParam} class="text-sorbet-red hover:bg-sorbet-red/10 p-1 rounded"><Plus size={16}/></button>
        </div>
        {#each $requestStore.queryParams as param, i}
          <div class="flex gap-2 items-center">
            <input type="checkbox" bind:checked={param.enabled} class="accent-sorbet-red" />
            <Input bind:value={param.key} placeholder="Key" className="flex-1 text-sm py-1" />
            <Input bind:value={param.value} placeholder="Value" className="flex-1 text-sm py-1" />
            <button on:click={() => removeParam(i)} class="text-sorbet-dark/40 hover:text-sorbet-red transition-colors"><Trash2 size={16}/></button>
          </div>
        {/each}
      </div>
    {:else if activeTab === 'headers'}
      <div class="space-y-2">
        <div class="flex justify-between items-center mb-2">
          <span class="text-xs font-title text-sorbet-dark/70 uppercase tracking-wider font-bold">Headers</span>
          <button on:click={addHeader} class="text-sorbet-red hover:bg-sorbet-red/10 p-1 rounded"><Plus size={16}/></button>
        </div>
        {#each $requestStore.headers as header, i}
          <div class="flex gap-2 items-center">
            <input type="checkbox" bind:checked={header.enabled} class="accent-sorbet-red" />
            <Input bind:value={header.key} placeholder="Header" className="flex-1 text-sm py-1" />
            <Input bind:value={header.value} placeholder="Value" className="flex-1 text-sm py-1" />
            <button on:click={() => removeHeader(i)} class="text-sorbet-dark/40 hover:text-sorbet-red transition-colors"><Trash2 size={16}/></button>
          </div>
        {/each}
      </div>
    {:else if activeTab === 'body'}
      <div class="h-full flex flex-col">
        <span class="text-xs font-title text-sorbet-dark/70 uppercase tracking-wider mb-2 font-bold">JSON Body</span>
        <textarea
          bind:value={$requestStore.body}
          class="flex-1 w-full bg-white/60 border border-sorbet-pink/30 rounded-xl p-4 font-mono text-sm text-sorbet-dark focus:outline-none focus:ring-2 focus:ring-sorbet-red/50 resize-none"
          placeholder="JSON Body"
        ></textarea>
      </div>
    {/if}
  </div>
</div>
