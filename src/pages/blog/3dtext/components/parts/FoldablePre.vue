<template>
  <div class="FoldablePre">
     <pre><code><slot></slot></code></pre>
  </div>
</template>

<script lang="ts">
  export default {
    name: 'FoldablePre',
    data() {
      return {
        open: true,
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
  font-size: 14px;
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
