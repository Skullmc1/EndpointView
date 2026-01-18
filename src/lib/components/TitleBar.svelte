<script lang="ts">
    import { getCurrentWindow } from "@tauri-apps/api/window";
    import { X, Minus, Maximize2, Minimize2 } from "lucide-svelte";

    const appWindow = getCurrentWindow();

    function minimize() {
        appWindow.minimize();
    }

    async function toggleMaximize() {
        const isMaximized = await appWindow.isMaximized();
        if (isMaximized) {
            appWindow.unmaximize();
        } else {
            appWindow.maximize();
        }
    }

    function close() {
        appWindow.close();
    }
</script>

<div
    data-tauri-drag-region
    class="h-10 bg-sorbet-cream flex items-center justify-between px-4 select-none fixed top-0 left-0 right-0 z-50 border-b border-sorbet-pink/20"
>
    <div
        class="flex items-center gap-2 pointer-events-none text-sorbet-dark font-display tracking-widest text-sm"
    >
        <img src="/favicon.png" alt="Logo" class="w-4 h-4 opacity-80" />
        EndpointView
    </div>

    <div class="flex items-center gap-2">
        <button
            on:click={minimize}
            class="p-1.5 hover:bg-sorbet-peach/50 rounded-lg text-sorbet-dark transition-colors"
        >
            <Minus size={14} />
        </button>
        <button
            on:click={toggleMaximize}
            class="p-1.5 hover:bg-sorbet-peach/50 rounded-lg text-sorbet-dark transition-colors"
        >
            <Maximize2 size={14} />
        </button>
        <button
            on:click={close}
            class="p-1.5 hover:bg-sorbet-red hover:text-white rounded-lg text-sorbet-dark transition-colors"
        >
            <X size={14} />
        </button>
    </div>
</div>
