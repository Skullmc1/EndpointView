<script lang="ts">
  export let value: string;
  export let options: string[] = [];
  export let className: string = '';
</script>

<div class="relative inline-block {className}">
  <select
    bind:value
    class="appearance-none bg-sorbet-peach/70 border border-sorbet-pink/50 rounded-xl px-4 py-2 pr-8 text-sorbet-dark font-sans focus:outline-none focus:ring-2 focus:ring-sorbet-red/50 cursor-pointer"
  >
    {#each options as option}
      <option value={option}>{option}</option>
    {/each}
  </select>
  <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-sorbet-dark">
    <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
  </div>
</div>
