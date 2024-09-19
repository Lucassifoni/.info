<template>
  <div class="FoldablePre">
    <button @click="open = !open">Expand/Fold code sample</button>
    <div :style="{maxHeight: !open ? '10rem' : 'none'}" style="overflow-y: scroll">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
  export default {
    name: 'FoldablePre',
    data() {
      return {
        open: false,
      };
    },
  };
</script>

<style>
 .FoldablePre {
    margin-bottom: 3em;
    background: #f5f5f5;
    padding: .5em;
 }

 pre {
  font-family: monospace;
  font-size: 12px;
  white-space: pre-wrap;
  padding: 0;
}

 .FoldablePre code {
     display: block;
 }

 .FoldablePre code {
     max-height: 16em;
     overflow-y: scroll;
 }

 .FoldablePre small {
     color: grey;
     text-decoration: underline;
 }

 .FoldablePre pre.open code {
     max-height: 800px;
     overflow-y: scroll;
 }
</style>
