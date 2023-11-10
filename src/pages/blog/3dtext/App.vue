<template lang="pug">
#app


  main.Content
    article
      manual
      programmatically
</template>

<script lang="ts">
import Manual from './components/parts/Manual.vue';
import Programmatically from './components/parts/Programmatically.vue';
/* eslint-disable-next-line */

export default {
  name: 'app',
  components: {
    Manual,
    Programmatically,
  }
};
</script>

<style scoped>
figure {
  width: 100%;
  max-width: 600px;
}

figure img {
  width: 100%;
  height: auto;
}

figure span.author {
  display: block;
  font-style: italic;
  color: darkgrey;
  font-size: 0.85em;
  margin-bottom: 1em;
}

p code {
  display: inline-block;
  background: rgb(254, 222, 227);
  font-size: .85em;
  border-radius: 2px;
  font-family: monospace;
  padding: 1px 3px;
}


p {
  margin-bottom: 1.2em;
}

textarea {
  width: 100%;
  max-width: 960px;
  min-height: 5em;
  padding: .5em;
  background: #ffffc8;
  border: 1px solid #ddd;
  border-radius: 2px;
}

section {
  margin-bottom: 3em;
}

table {
  padding: 5px;
}

tr {
  padding: 5px;
}

td, th {
  padding: 5px; 
  border: 1px solid lightgrey;
}

figure {
  margin-left: 0;
}
</style>
