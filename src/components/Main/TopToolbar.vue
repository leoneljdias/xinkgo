<template>
  <div>
    <v-navigation-drawer
      v-model="showMenu"
      app
      fixed
      right
    >
      <v-list dense>
        <v-list-item>
          <v-list-item-action>
            <v-icon>mdi-settings</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Profile</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-action>
            <v-icon>help</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>About</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-action>
            <v-icon>help</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      app
      fixed
      dark
      color="#E74E35"
    >
      <v-toolbar-title
        class="font-weight-bold"
        style="font-size: 26px;color:#393E5E"
      >
        <span style="color:#E74E35">X</span><span style="color:#393E5E">AND</span><span style="color:#F8D643">GO</span>
      </v-toolbar-title>
      <v-spacer />
      <v-app-bar-nav-icon @click.stop="toggleMenu" />
    </v-app-bar>
  </div>
</template>

<script>

export default {
  name: 'TopToolbar',
  components: {
  },
  data () {
    return { showMenu: false }
  },
  methods:
    {
      toggleMenu () {
        this.showMenu = !this.showMenu
      }
    }
}
</script>
