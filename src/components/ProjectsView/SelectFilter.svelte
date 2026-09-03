<script lang="ts" generics="Option extends string">
  export let id: string;
  export let label: string;
  export let allLabel: string;
  export let options: readonly Option[];
  export let selectedValue: Option | "";
  export let onSelect: (value: Option | "") => void;
  export let anchorName: string;
</script>

<div class="filter-group">
  <label for={id}>{label}</label>
  <button
    {id}
    type="button"
    class="select-trigger"
    popovertarget={`${id}-menu`}
    style={`anchor-name: ${anchorName}`}
  >
    {selectedValue || allLabel}
  </button>
  <div
    id={`${id}-menu`}
    class="select-menu"
    popover="auto"
    aria-label={`${label}opties`}
    style={`position-anchor: ${anchorName}`}
  >
    <button
      type="button"
      aria-pressed={!selectedValue}
      popovertarget={`${id}-menu`}
      popovertargetaction="hide"
      on:click={() => onSelect("")}
    >{allLabel}</button>
    {#each options as option (option)}
      <button
        type="button"
        aria-pressed={selectedValue === option}
        popovertarget={`${id}-menu`}
        popovertargetaction="hide"
        on:click={() => onSelect(option)}
      >{option}</button>
    {/each}
  </div>
</div>

<style>
  .filter-group {
    display: flex;
    flex-direction: column;
    gap: 0.55rem;
    min-width: 0;

    > label {
      color: var(--text-bright);
      font-family: var(--font-display);
      font-size: 0.9rem;
    }

    .select-trigger {
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
      width: 100%;
      min-height: 2.85rem;
      border: 1px solid var(--border);
      border-radius: 0.65rem;
      background: color-mix(in oklch, var(--card-bg), #000 18%);
      color: var(--text-bright);
      cursor: pointer;
      font: inherit;
      padding: 0.72rem 0.85rem;
      text-align: left;

      &::after {
        content: "▾";
        flex: 0 0 auto;
      }
    }

    &:has(.select-menu:popover-open) .select-trigger::after {
      transform: rotate(180deg);
    }
  }

  .select-menu {
    box-sizing: border-box;
    width: anchor-size(width);
    max-width: calc(100vw - 2rem);
    max-height: min(20rem, 60vh);
    padding: 0.35rem;
    border: 1px solid var(--border-bright);
    border-radius: 0.65rem;
    margin: 0.4rem 0;
    overflow-y: auto;
    position-area: block-end span-inline-end;
    position-try-fallbacks: flip-block;
    background: var(--card-bg);
    color: var(--text-bright);
    box-shadow: 0 0.8rem 2rem rgba(0, 0, 0, 0.35);

    &:popover-open {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
    }

    button {
      width: 100%;
      border: 0;
      border-radius: 0.45rem;
      background: transparent;
      color: inherit;
      cursor: pointer;
      font: inherit;
      padding: 0.65rem 0.85rem;
      text-align: left;

      &:hover,
      &[aria-pressed="true"] {
        background: rgba(255, 255, 255, 0.08);
      }
    }
  }

  :global(html[data-theme="light"]) {
    .select-trigger {
      border: 2px solid #000;
      background: rgba(231, 230, 230, 0.95);
      color: #000;
    }

    .select-menu {
      border: 2px solid #000;
      background: #e7e6e6;
      color: #000;

      button:hover,
      button[aria-pressed="true"] {
        background: rgba(0, 0, 0, 0.1);
      }
    }
  }
</style>
