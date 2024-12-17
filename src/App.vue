<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { ref } from "vue";
import dayjs from "dayjs";
dayjs.locale('ja');

  const leftDrawerOpen = ref(false)

  function toggleLeftDrawer () {
    leftDrawerOpen.value = !leftDrawerOpen.value
  }

  const month = dayjs().month()+1

</script>

<template>
  <div class="q-pa-md" style="padding: 0%;">
    <q-layout view="hHh lpR fFf">

      <q-header >
        <q-toolbar style="background-color: #D5C6A7;">
          <q-toolbar-title class="text-center jiyu" style="color: #FDFDFD; z-index: 0;" >課金簿</q-toolbar-title>
          <q-btn
            flat
            dense
            round
            @click="toggleLeftDrawer"
            aria-label="Menu"
            icon="menu"
            color="FDFDFD"
            style="z-index: 1;"
          />
        </q-toolbar>
      </q-header>

      <q-drawer
        v-model="leftDrawerOpen"
        show-if-above
        bordered
        class="bg-grey-2"
      >
        <q-list bordered separator>
          <q-item-label header>Page List</q-item-label>
          <q-item clickable to="/" exact>
            <q-item-section avatar>
              <q-icon name="school" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Home</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable to="/about" exact>
            <q-item-section avatar>
              <q-icon name="code" />
            </q-item-section>
            <q-item-section>
              <q-item-label>About</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-drawer>

      
      <q-page-container m>
        <div class="text-right" style="margin-top: 5%;">
          <span class="border">
            <span class="jiyu" style="padding-left: 5%;">「{{month}}</span>
            <span class="higure-light">月はあと</span>
            <span class="jiyu" style="color: #DDBA72;">¥10,000</span>
            <span class="higure-light">の課金に収めましょう</span>
            <span class="jiyu">」</span>
          </span>
        </div>
        <RouterView />
      </q-page-container>
    </q-layout>
  </div>
</template>

<style scoped>
.border {
  border-bottom: 0.124rem solid #DDBA72;
}

div {
  font-family: 'Higure-light';
}

.jiyu {
  font-family: 'JiyunoTsubasa';
}
.higure-light {
  font-family: 'Higure-light';
}
.higure-regular {
  font-family: 'Higure-regular';
}
/* .container {
  background-color: white;
} */

/* header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
} */
</style>
