<script setup lang="ts">
import { RouterView } from 'vue-router'

</script>

<template>
  <div class="q-pa-xs">
    <q-layout view="hHh lpR fFf">

      <q-header >
        <q-toolbar style="background-color: #D5C6A7;">
          <q-toolbar-title class="text-center jiyu tool-bar-title" style="color: #FDFDFD; z-index: 0;" >課金簿</q-toolbar-title>
          <q-btn
            flat
            no-wrap
            dense
            round
            aria-label="Menu"
            icon="menu"
            color="FDFDFD"
            style="z-index: 1;"
          >
            <q-menu auto-close>
              <q-list dense>
                <q-item clickable class="GL__menu-link" to="/">
                  <q-item-section>ホーム</q-item-section>
                </q-item>
                <q-item clickable class="GL__menu-link" to="/about">
                  <q-item-section>課金状況</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </q-toolbar>
      </q-header>

      <q-page-container m>
            <RouterView />
      </q-page-container>
    </q-layout>
  </div>
</template>

<style scoped>
.border {
  border-bottom: 0.124rem solid #D6C494;
}

.tool-bar-title {
  letter-spacing: 0.7rem;
  font-size: x-large;
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
</style>
