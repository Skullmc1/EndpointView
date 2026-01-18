<script lang="ts">
  export let value: string;
  export let placeholder: string = '';
  export let type: string = 'text';
  export let className: string = '';
</script>

<input
  {type}
  bind:value
  {placeholder}
  class="w-full bg-white/80 border border-sorbet-pink/50 rounded-xl px-4 py-2 text-sorbet-dark placeholder-sorbet-dark/60 focus:outline-none focus:ring-2 focus:ring-sorbet-red/50 transition-all font-sans {className}"
/>
