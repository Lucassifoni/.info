<script setup lang="ts">
import { computed, onMounted, ref, Ref } from "vue";
import { data } from "./data";
const props = defineProps<{
  lang: 'fr' | 'en',
}>();
const currentLang: Ref<"fr" | "en"> = ref(props.lang);

const switchLang = () => {
  const v = currentLang.value;
  currentLang.value = v === "fr" ? "en" : "fr";
};

const t = computed(() => {
  return data[currentLang.value];
});


</script>

<template>
  <div>
    <div class="cv">
      <header class="columns">
        <div class="header-left">
          <p v-html="t.intro"></p>
        </div>
        <div class="header-right">
          <p>
            <a v-if="1" :href="`mailto:contact@lucassifoni.info`">contact<span>@lucassifoni.info</span></a>
            <br>
            <a v-if="1" :href="`tel:33767025572`">+337.67.02.55.72</a>
            <br>
            <a v-if="1" href="/Lucas_Sifoni_CV_english.pdf">CV (pdf)</a>
          </p>
        </div>
      </header>
      <div class="columns">
        <main>
          <h3 id="collabs" v-html="t.titles.collab"></h3>
          <p>
          <ul class="dates">
            <li v-for="item in t.collabs">
              {{ item.start }} &mdash; {{ item.end }} : <span v-html="item.main"></span>
              <p class="small" v-html="item.details"></p>
            </li>
          </ul>
          </p>

          <h3 id="projects" v-html="t.titles.projects"></h3>
          <div v-for="list in t.projects">
            <h4 class="year">{{ list.year }}</h4>
            <ul class="project-list">
              <li v-for="project in list.content">
                <span v-html="project.intro"></span>
                <span class="tags">
                  <div class="tag" :class="tag.key" v-for="tag in project.tags">
                    {{ tag.value[currentLang] }}
                  </div>
                </span>
              </li>
            </ul>
          </div>
        </main>
        <aside>
          <h3 id="tech" v-html="t.titles.tech"></h3>
          <p v-html="t.tech.current_stack"></p>
          <ul>
            <li v-for="item in t.tech.stack" v-html="item"></li>
          </ul>
          <h3 id="teaching" v-html="t.teaching.title"></h3>
          <p v-html="t.teaching.text"></p>
          <h3 id="formation" v-html="t.titles.form"></h3>
          <ul class="dates">
            <li v-for="item in t.formation">
              {{ item.start }} &mdash; {{ item.end }} : {{ item.title }}
              <p class="small" v-html="item.details"></p>
            </li>
          </ul>
          <h3 id="oss" v-html="t.titles.oss"></h3>
          <p v-html="t.oss.title"></p>
          <ul>
            <li v-for="item in t.oss.list" v-html="item"></li>
          </ul>
        </aside>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.cv {
  .hide-small {
    @media screen and (max-width: 961px) {
      display: none;
    }
  }
  .hide-large {
    @media screen and (min-width: 961px) {
      display: none;
    }
  }
  .mobile-menu {
    display: none;

    @media screen and (max-width: 960px) {
      display: block;
    }
  }

  .lang-button {
    border: 1px solid;
    font-size: 1em;
    border-radius: 3px;
    margin-top: 1em;
    background: none;
    font-family: inherit;
  }

  width: 100%;

  p {
    max-width: 70ch;

    &.small {
      font-size: .85em;
      font-style: italic;
      margin-top: 0;
    }
  }

  h4.year {
    margin-top: 0;
    margin-bottom: 0;
    font-family: 'Times New Roman', Times, serif;
    font-weight: 400;
    text-align: left;
    max-width: 70ch;
    margin-bottom: .5em;

    &+ul {
      margin-top: 0;
    }
  }

  ul {
    margin-left: 0;
    padding-left: 0;
    list-style-type: none;

    li {
      &::first-letter {
        //margin-left: -1em;
      }

      &::before {
        content: "- "
      }

    }

    &.dates {
      li::before {
        display: none;
      }

      li::first-letter {
        margin: 0;
      }
    }
  }

  ul.project-list {
    strong {
      font-family: Arial, Helvetica, sans-serif;
      font-size: .9em;
    }

    li {
      max-width: 70ch;
      margin-bottom: .5em;

      &::first-letter {
        //margin-left: -1em;
      }
    }
  }

  .columns {
    display: flex;
    width: 100%;
    flex-wrap: wrap;
  }

  main,
  .header-left {
    flex: 0 0 calc(100% - 44ch - 1em);
    position: relative;

    @media screen and (max-width: 960px) {
      flex: 0 0 100%;
      margin-left: 0;
    }
  }

  aside,
  .header-right {
    flex: 0 0 40ch;
    margin-left: auto;

    @media screen and (max-width: 960px) {
      flex: 0 0 100%;
      margin-left: 0;
    }
  }
}
</style>
