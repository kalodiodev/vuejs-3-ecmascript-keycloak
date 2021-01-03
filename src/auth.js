import Keycloak from 'keycloak-js'

const auth = {
  state: {
    authenticated: false,
    keycloak: null,
    refresh: null,
    initOptions: {
      url: 'http://localhost:8080/auth',
      realm: 'my-demo',
      clientId: 'spring-boot',
      onLoad: 'check-sso'
    },
    profile: null
  },
  init: function () {
    if (!this.state.keycloak) {
      this.state.keycloak = Keycloak(this.state.initOptions)

      const state = this.state
      this.state.keycloak.onReady = function (auth) {
        state.authenticated = auth
      }

      this.state.keycloak.onAuthSuccess = function () {
        state.authenticated = true
      }

      this.state.keycloak.onAuthLogout = function () {
        state.authenticated = false
      }

      this.state.keycloak.init({ onLoad: 'check-sso' }).then(auth => {
        if (auth) {
          this.state.refresh = setInterval(() => {
            this.state.keycloak.updateToken(5).catch(() => {
              this.state.keycloak.clearToken()
            })
          }, 6000)

          const state = this.state
          this.state.keycloak.loadUserProfile()
            .then(function (profile) {
              state.profile = profile
            })
        }
      })
    }
  },
  login: function () {
    this.state.keycloak.login()
  },
  logout: function () {
    clearInterval(this.state.refresh)
    this.state.keycloak.logout()
    this.state.authenticated = false
  },
  auth: function () {
    if (this.state.profile) {
      return this.state.profile
    }

    return false
  },
  hasRole: function (role) {
    if (this.state.authenticated) {
      return this.state.keycloak.hasResourceRole(role)
    }

    return false
  },
  hasRealmRole: function (role) {
    if (this.state.authenticated) {
      return this.state.keycloak.hasRealmRole(role)
    }

    return false
  },
  isAuthenticated: function () {
    return this.state.authenticated
  },
  authorize: function (role, callback) {
    if (this.state.keycloak.hasResourceRole(role)) {
      callback()
    }
  }
}

export default auth
