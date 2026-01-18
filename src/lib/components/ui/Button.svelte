<script lang="ts">
  import { cn } from "$lib/utils";
  
  export let variant: 'primary' | 'secondary' | 'ghost' = 'primary';
  export let size: 'sm' | 'md' | 'lg' = 'md';
  export let className: string = '';
  export let onclick: () => void = () => {};
  export let type: 'button' | 'submit' | 'reset' = 'button';
  export let disabled: boolean = false;

  const variants = {
    primary: 'bg-sorbet-red text-white hover:bg-sorbet-red/90 shadow-md',
    secondary: 'bg-sorbet-peach text-sorbet-dark hover:bg-sorbet-peach/80',
    ghost: 'bg-transparent text-sorbet-dark hover:bg-sorbet-pink/20',
  };

  const sizes = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
</script>

<button
  {type}
  class="rounded-xl font-sans transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none {variants[variant]} {sizes[size]} {className}"
  on:click={onclick}
  {disabled}
>
  <slot />
</button>
