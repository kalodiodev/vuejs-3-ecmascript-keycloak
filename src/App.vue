<template>
  <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/about" v-if="auth.hasRole('user')">About</router-link>
  </div>
  <router-view/>
  <button @click="logout" v-if="authenticated">Logout</button>
  <button @click="login" v-if="!authenticated">Login</button>
</template>

<script>
import auth from './auth'

export default {
  data () {
    return {
      auth: auth,
      authenticated: false
    }
  },
  created () {
    const app = this
    auth.state.keycloak.onReady = function (status) {
      app.authenticated = status
    }
  },
  methods: {
    logout () {
      auth.logout()
    },
    login () {
      auth.login()
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
