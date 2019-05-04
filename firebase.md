# Firebaseでアドレス帳管理

## Firebaseとは

FirebaseはBaas(backend as a Service)と呼ばれるサービスです。

サーバー構築する必要がなく、認証機能やデータベース機能が使えます。

利用料金は基本は従量課金制です。無料プランもあります。

### コンソール

Firebaseのコンソールに入るとプロジェクト管理画面になります。

プロジェクト追加で新規プロジェクトを作成

必要事項を記入します。



![firebase1](/Users/tahara/Desktop/sample-app/img/firebase1.png)

次にアプリの登録を求められますので、アプリの名前を入れて登録します。

登録するとJavaScriptのコードが表示されます。これをmain.jsに貼り付けます。

HTMLのコメントアウトやscriptタグは削除しておきます。また1つ目のscriptタグも消します。

```
import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
import firebase from 'firebase'

Vue.config.productionTip = false
    // Your web app's Firebase configuration
    var firebaseConfig = {
        apiKey: "AIzaSyC1IGn2mKjnBUTjLHOyjKu5yGujAFmFs8o",
        authDomain: "my-address-book-e6b44.firebaseapp.com",
        databaseURL: "https://my-address-book-e6b44.firebaseio.com",
        projectId: "my-address-book-e6b44",
        storageBucket: "my-address-book-e6b44.appspot.com",
        messagingSenderId: "99776770053",
        appId: "1:99776770053:web:db22fcb44e0b2a95"
    };
// Initialize Firebase
firebase.initializeApp(firebaseConfig); 

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

```





#### Firebaseのライブラリの設定

ターミナルに以下のコマンドを実行

```
npm install firebase
```

### ログイン

Firebaseの左メニューからAuthenticationを選択します。

Authenticationの画面になったら、「ログイン方法を設定」ボタンをクリックします。

ログインプロバイダの種類が表示されますので、「Google」を選択します。

これはGoogleアカウントで認証するということです。

「Google」を選択した段階で設定画面が表示されています。

右上の有効にするスライドボタンを動かして有効にします。

プロジェクト名と

自分のメールアドレスを入力します。

これで元の画面に戻り、「Google」が有効になっているのが確認できます。



承認済みドメインはローカル環境はすでに承認済みになっていますので今のところ設定の必要はありません。

**公開の際にはここの設定が必要になりますので覚えておきましょう。**

### アプリケーションのログイン機能の実装

src/store.jsのコードを編集

firebaseを使用するためのライブラリをimportします。`import firebase from 'firebase'`

Google認証に必要な記述として、actionsに以下のコードを追加しています。

```
login() {
            const google_auth_provider = new firebase.auth.GoogleAuthProvider()
            firebase.auth().signInWithRedirect(google_auth_provider)
        },
```

修正後のsrc/store.jsのコード

```
import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        drawer: false,
        addresses: []
    },
    mutations: {
        toggleSideMenu(state) {
            state.drawer = !state.drawer
        },
        addAddress(state, address) {
            state.addresses.push(address)
        }
    },
    actions: {
        login() {
            const google_auth_provider = new firebase.auth.GoogleAuthProvider()
            firebase.auth().signInWithRedirect(google_auth_provider)
        },
        toggleSideMenu({
            commit
        }) {
            commit('toggleSideMenu')
        },
        addAddress({
            commit
        }, address) {
            commit('addAddress', address)
        }
    }
})
```



Home.vueにログインボタンを設置します。

ポイントは以下の部分です。

```
<script>
import { mapActions } from 'vuex'
export default {
  methods: {
    ...mapActions(['login'])
  }
}
</script>
```

template側のポイントは以下のコード

```
<v-btn color='info' @click="login">Googleアカウントでログイン</v-btn>
```



views/Home.vueの編集後コード

```
<template>
  <v-container text-xs-center justify-center>
    <v-layout row wrap>
      <v-flex xs12>
        <h1>マイアドレス帳</h1>
        <p>マイアドレス帳をご利用の方は、Googleアカウントでログインしてください。</p>
      </v-flex>

      <v-flex xs12 mt-5>
        <v-btn color='info' @click="login">Googleアカウントでログイン</v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  methods: {
    ...mapActions(['login'])
  }
}
</script>
```

### ログインユーザーの情報を取得する方法



import firebase from 'firebase'を追加

次にcreated()を追加

```
created () {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setLoginUser(user)
      }
    })
  }
```



src/App.vue

```
<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-side-icon @click.stop="toggleSideMenu"></v-toolbar-side-icon>
      <v-toolbar-title class="headline text-uppercase">
        <span>マイアドレス帳</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <SideNav/>

    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
import firebase from 'firebase'
import SideNav from './components/SideNav'
import { mapActions } from 'vuex'
export default {
  name: 'App',
  components: {
    SideNav
  },
  created () {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setLoginUser(user)
      }
    })
  },
  data () {
    return {
      //
    }
  },
  methods: {
    ...mapActions(['toggleSideMenu', 'setLoginUser'])
  }
}
</script>

```



mutations:に以下のコードを追加

```
setLoginUser (state, user) {
      state.login_user = user
},
```

actions:に次のコードを追加

```
setLoginUser ({ commit }, user) {
      commit('setLoginUser', user)
}
```



src/store.js

```
import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    login_user: null,
    drawer: false,
    addresses: []
  },
  mutations: {
    setLoginUser (state, user) {
      state.login_user = user
    },
    toggleSideMenu (state) {
      state.drawer = !state.drawer
    },
    addAddress (state, address) {
      state.addresses.push(address)
    }
  },
  actions: {
    setLoginUser ({ commit }, user) {
      commit('setLoginUser', user)
    },
    login () {
      const google_auth_provider = new firebase.auth.GoogleAuthProvider()
      firebase.auth().signInWithRedirect(google_auth_provider)
    },
    toggleSideMenu ({ commit }) {
      commit('toggleSideMenu')
    },
    addAddress ({ commit }, address) {
      commit('addAddress', address)
    }
  }
})
```

#### Chromeの拡張機能

[Vue.js devtools](https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd?hl=ja)

この拡張ツールを導入すると検証画面にvueタブが追加される。こちらを使うとVue.jsの動きを知ることができます。

#### ログアウト機能

store.jsにログアウトのコードを追加します。

```
deleteLoginUser (state) {
      state.login_user = null
}
```



```
 logout () {
      firebase.auth().signOut()
    },
    deleteLoginUser ({ commit }) {
      commit('deleteLoginUser')
 }
```



src/store.jsの追加後のコード

```
import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    login_user: null,
    drawer: false,
    addresses: []
  },
  mutations: {
    setLoginUser (state, user) {
      state.login_user = user
    },
    deleteLoginUser (state) {
      state.login_user = null
    },
    toggleSideMenu (state) {
      state.drawer = !state.drawer
    },
    addAddress (state, address) {
      state.addresses.push(address)
    }
  },
  actions: {
    setLoginUser ({ commit }, user) {
      commit('setLoginUser', user)
    },
    login () {
      const google_auth_provider = new firebase.auth.GoogleAuthProvider()
      firebase.auth().signInWithRedirect(google_auth_provider)
    },
    logout () {
      firebase.auth().signOut()
    },
    deleteLoginUser ({ commit }) {
      commit('deleteLoginUser')
    },
    toggleSideMenu ({ commit }) {
      commit('toggleSideMenu')
    },
    addAddress ({ commit }, address) {
      commit('addAddress', address)
    }
  }
})

```



ログアウトボタンの追加はApp.vueに行います。

```
<v-toolbar-items>
        <v-btn @click="logout">ログアウト</v-btn>
</v-toolbar-items>
```

methodesにログアウトの記述を追加

```
methods: {
    ...mapActions(['toggleSideMenu', 'setLoginUser', 'logout', 'deleteLoginUser'])
  }
```



App.vueログアウト処理追加後のコード

```
<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-side-icon @click.stop="toggleSideMenu"></v-toolbar-side-icon>
      <v-toolbar-title class="headline text-uppercase">
        <span>マイアドレス帳</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn @click="logout">ログアウト</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <SideNav/>

    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
import firebase from 'firebase'
import SideNav from './components/SideNav'
import { mapActions } from 'vuex'
export default {
  name: 'App',
  components: {
    SideNav
  },
  created () {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setLoginUser(user)
      } else {
        this.deleteLoginUser()
      }
    })
  },
  data () {
    return {
      //
    }
  },
  methods: {
    ...mapActions(['toggleSideMenu', 'setLoginUser', 'logout', 'deleteLoginUser'])
  }
}
</script>

```



### ログイン状態による表示の切り替え



src/store.js

```
import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    login_user: null,
    drawer: false,
    addresses: []
  },
  mutations: {
    setLoginUser (state, user) {
      state.login_user = user
    },
    deleteLoginUser (state) {
      state.login_user = null
    },
    toggleSideMenu (state) {
      state.drawer = !state.drawer
    },
    addAddress (state, address) {
      state.addresses.push(address)
    }
  },
  actions: {
    setLoginUser ({ commit }, user) {
      commit('setLoginUser', user)
    },
    login () {
      const google_auth_provider = new firebase.auth.GoogleAuthProvider()
      firebase.auth().signInWithRedirect(google_auth_provider)
    },
    logout () {
      firebase.auth().signOut()
    },
    deleteLoginUser ({ commit }) {
      commit('deleteLoginUser')
    },
    toggleSideMenu ({ commit }) {
      commit('toggleSideMenu')
    },
    addAddress ({ commit }, address) {
      commit('addAddress', address)
    }
  },
  getters: {
    userName: state => state.login_user ? state.login_user.displayName : '',
    photoURL: state => state.login_user ? state.login_user.photoURL : ''
  }
})

```





src/App.vue

```
<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-side-icon @click.stop="toggleSideMenu"></v-toolbar-side-icon>
      <v-toolbar-title class="headline text-uppercase">
        <span>マイアドレス帳</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items v-if="$store.state.login_user">
        <v-btn @click="logout">ログアウト</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <SideNav/>

    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
import firebase from 'firebase'
import SideNav from './components/SideNav'
import { mapActions } from 'vuex'
export default {
  name: 'App',
  components: {
    SideNav
  },
  created () {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setLoginUser(user)
      } else {
        this.deleteLoginUser()
      }
    })
  },
  data () {
    return {
      //
    }
  },
  methods: {
    ...mapActions(['toggleSideMenu', 'setLoginUser', 'logout', 'deleteLoginUser'])
  }
}
</script>

```



src/components/SideNav.vue

```
<template>
  <v-navigation-drawer v-model="$store.state.drawer" absolute temporary>
    <v-list class="pa-1">
      <v-list-tile avatar>
        <v-list-tile-avatar>
          <img v-if="photoURL" :src="photoURL">
        </v-list-tile-avatar>

        <v-list-tile-content>
          <v-list-tile-title>{{ userName }}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>

    <v-list class="pt-0" dense>
      <v-divider></v-divider>

      <v-list-tile v-for="item in items" :key="item.title" :to='item.link'>
        <v-list-tile-action>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-tile-action>

        <v-list-tile-content>
          <v-list-tile-title>{{ item.title }}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      items: [
        { title: 'ホーム', icon: 'home', link: { name: 'home'} },
        { title: '連絡先一覧', icon: 'list', link: { name: 'addresses' } }
      ]
    }
  },
  computed: {
    ...mapGetters(['userName', 'photoURL'])
  }
}
</script>

```



### ログイン状態によるルートの制御





App.vue

```
<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-side-icon v-show="$store.state.login_user" @click.stop="toggleSideMenu"></v-toolbar-side-icon>
      <v-toolbar-title class="headline text-uppercase">
        <span>マイアドレス帳</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items v-if="$store.state.login_user">
        <v-btn @click="logout">ログアウト</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <SideNav/>

    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
import firebase from 'firebase'
import SideNav from './components/SideNav'
import { mapActions } from 'vuex'
export default {
  name: 'App',
  components: {
    SideNav
  },
  created () {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setLoginUser(user)
        if (this.$router.currentRoute.name === 'home') this.$router.push({ name: 'addresses' })
      } else {
        this.deleteLoginUser()
        this.$router.push({ name: 'home' })
      }
    })
  },
  data () {
    return {
      //
    }
  },
  methods: {
    ...mapActions(['toggleSideMenu', 'setLoginUser', 'logout', 'deleteLoginUser'])
  }
}
</script>

```



src/components/SideNa.vue

```
<template>
  <v-navigation-drawer v-model="$store.state.drawer" absolute temporary>
    <v-list class="pa-1">
      <v-list-tile avatar>
        <v-list-tile-avatar>
          <img v-if="photoURL" :src="photoURL">
        </v-list-tile-avatar>

        <v-list-tile-content>
          <v-list-tile-title>{{ userName }}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>

    <v-list class="pt-0" dense>
      <v-divider></v-divider>

      <v-list-tile v-for="item in items" :key="item.title" :to='item.link'>
        <v-list-tile-action>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-tile-action>

        <v-list-tile-content>
          <v-list-tile-title>{{ item.title }}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      items: [
        { title: '連絡先一覧', icon: 'list', link: { name: 'addresses' } }
      ]
    }
  },
  computed: {
    ...mapGetters(['userName', 'photoURL'])
  }
}
</script>
```



## データベースの設定

Firebaseのコンソール画面から左のメニューのDatabaseを選択します。

「データベースの作成」ボタンをクリックします。

セキュリティールールは一旦「ロックモードで開始」を選択して「有効にするボタン」をクリック

メニューのルールタグを選択すると次の表示がされます。

```
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

以下のように変更します。**この辺このやり方が超大事**

```
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/addresses/{addressId} {
      allow read, update, delete: if request.auth.uid == userId;
      allow create : if request.auth.uid != null;
    }
  }
}
```



#### データベースへの保存

store.js

```
import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    login_user: null,
    drawer: false,
    addresses: []
  },
  mutations: {
    setLoginUser (state, user) {
      state.login_user = user
    },
    deleteLoginUser (state) {
      state.login_user = null
    },
    toggleSideMenu (state) {
      state.drawer = !state.drawer
    },
    addAddress (state, { id, address }) {
      address.id = id
      state.addresses.push(address)
    },
    updateAddress (state, { id, address }) {
      const index = state.addresses.findIndex(address => address.id === id)

      state.addresses[index] = address
    }
  },
  actions: {
    setLoginUser ({ commit }, user) {
      commit('setLoginUser', user)
    },
    fetchAddresses ({ getters, commit }) {
      firebase.firestore().collection(`users/${getters.uid}/addresses`).get().then(snapshot => {
        snapshot.forEach(doc => commit('addAddress', { id: doc.id, address:  doc.data() }))
      })
    },
    login () {
      const google_auth_provider = new firebase.auth.GoogleAuthProvider()
      firebase.auth().signInWithRedirect(google_auth_provider)
    },
    logout () {
      firebase.auth().signOut()
    },
    deleteLoginUser ({ commit }) {
      commit('deleteLoginUser')
    },
    toggleSideMenu ({ commit }) {
      commit('toggleSideMenu')
    },
    addAddress ({ getters, commit }, address) {
      if (getters.uid) {
        firebase.firestore().collection(`users/${getters.uid}/addresses`).add(address).then(doc => {
          commit('addAddress', { id: doc.id, address })
        })
      }
    },
    updateAddress ({ getters, commit }, { id, address }) {
      if (getters.uid) {
        firebase.firestore().collection(`users/${getters.uid}/addresses`).doc(id).update(address).then(() => {
          commit('updateAddress', { id, address })
        })
      }
    }
  },
  getters: {
    userName: state => state.login_user ? state.login_user.displayName : '',
    photoURL: state => state.login_user ? state.login_user.photoURL : '',
    uid: state => state.login_user ? state.login_user.uid : null,
    getAddressById: state => id => state.addresses.find(address => address.id === id)
  }
})

```





src/views/AddressForm.vue

```
<template>
  <v-container text-xs-center>
    <v-layout row wrap justify-center>
      <v-flex xs12>
        <h1>連絡先編集</h1>
      </v-flex>

      <v-flex xs5 mt-5>
        <v-card>
          <v-card-text>
            <v-form>
               <v-text-field v-model="address.name" label="名前"></v-text-field>
               <v-text-field v-model="address.tel" label="電話番号"></v-text-field>
               <v-text-field v-model="address.email" label="メールアドレス"></v-text-field>
               <v-text-field v-model="address.address" label="住所"></v-text-field>
               <v-btn @click="$router.push({ name: 'addresses' })">キャンセル</v-btn>
               <v-btn color="info" @click="submit">保存</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  created () {
    if (!this.$route.params.address_id) return
    const address = this.$store.getters.getAddressById(this.$route.params.address_id)
    if (address) {
      this.address = address
    } else {
      this.$router.push({ name: 'addresses' })
    }
  },
  data () {
    return {
      address: {}
    }
  },
  methods: {
    submit () {
      if (this.$route.params.address_id) {
        this.updateAddress({ id: this.$route.params.address_id, address: this.address })
      } else {
        this.addAddress(this.address)
      }
      this.$router.push({ name: 'addresses' })
      this.address = {}
    },
    ...mapActions(['addAddress', 'updateAddress'])
  }
}
</script>

```



ここまで記述すると新規データがデータベースに保存されるようになります。

#### データベースからデータの取得

src/store.js

```
import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    login_user: null,
    drawer: false,
    addresses: []
  },
  mutations: {
    setLoginUser (state, user) {
      state.login_user = user
    },
    deleteLoginUser (state) {
      state.login_user = null
    },
    toggleSideMenu (state) {
      state.drawer = !state.drawer
    },
    addAddress (state, address) {
      state.addresses.push(address)
    }
  },
  actions: {
    setLoginUser ({ commit }, user) {
      commit('setLoginUser', user)
    },
    fetchAddresses ({ getters, commit }) {
      firebase.firestore().collection(`users/${getters.uid}/addresses`).get().then(snapshot => {
        snapshot.forEach(doc => commit('addAddress', doc.data()))
      })
    },
    login () {
      const google_auth_provider = new firebase.auth.GoogleAuthProvider()
      firebase.auth().signInWithRedirect(google_auth_provider)
    },
    logout () {
      firebase.auth().signOut()
    },
    deleteLoginUser ({ commit }) {
      commit('deleteLoginUser')
    },
    toggleSideMenu ({ commit }) {
      commit('toggleSideMenu')
    },
    addAddress ({ getters, commit }, address) {
      if (getters.uid) firebase.firestore().collection(`users/${getters.uid}/addresses`).add(address)
      commit('addAddress', address)
    }
  },
  getters: {
    userName: state => state.login_user ? state.login_user.displayName : '',
    photoURL: state => state.login_user ? state.login_user.photoURL : '',
    uid: state => state.login_user ? state.login_user.uid : null
  }
})

```



src/App.vue

```
<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-side-icon v-show="$store.state.login_user" @click.stop="toggleSideMenu"></v-toolbar-side-icon>
      <v-toolbar-title class="headline text-uppercase">
        <span>マイアドレス帳</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items v-if="$store.state.login_user">
        <v-btn @click="logout">ログアウト</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <SideNav/>

    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
import firebase from 'firebase'
import SideNav from './components/SideNav'
import { mapActions } from 'vuex'
export default {
  name: 'App',
  components: {
    SideNav
  },
  created () {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setLoginUser(user)
        this.fetchAddresses()
        if (this.$router.currentRoute.name === 'home') this.$router.push({ name: 'addresses' })
      } else {
        this.deleteLoginUser()
        this.$router.push({ name: 'home' })
      }
    })
  },
  data () {
    return {
      //
    }
  },
  methods: {
    ...mapActions(['toggleSideMenu', 'setLoginUser', 'logout', 'deleteLoginUser', 'fetchAddresses'])
  }
}
</script>

```



#### 編集画面の作成



src/store.js

```
import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    login_user: null,
    drawer: false,
    addresses: []
  },
  mutations: {
    setLoginUser (state, user) {
      state.login_user = user
    },
    deleteLoginUser (state) {
      state.login_user = null
    },
    toggleSideMenu (state) {
      state.drawer = !state.drawer
    },
    addAddress (state, { id, address }) {
      address.id = id
      state.addresses.push(address)
    }
  },
  actions: {
    setLoginUser ({ commit }, user) {
      commit('setLoginUser', user)
    },
    fetchAddresses ({ getters, commit }) {
      firebase.firestore().collection(`users/${getters.uid}/addresses`).get().then(snapshot => {
        snapshot.forEach(doc => commit('addAddress', { id: doc.id, address:  doc.data() }))
      })
    },
    login () {
      const google_auth_provider = new firebase.auth.GoogleAuthProvider()
      firebase.auth().signInWithRedirect(google_auth_provider)
    },
    logout () {
      firebase.auth().signOut()
    },
    deleteLoginUser ({ commit }) {
      commit('deleteLoginUser')
    },
    toggleSideMenu ({ commit }) {
      commit('toggleSideMenu')
    },
    addAddress ({ getters, commit }, address) {
      if (getters.uid) {
        firebase.firestore().collection(`users/${getters.uid}/addresses`).add(address).then(doc => {
          commit('addAddress', { id: doc.id, address })
        })
      }
    }
  },
  getters: {
    userName: state => state.login_user ? state.login_user.displayName : '',
    photoURL: state => state.login_user ? state.login_user.photoURL : '',
    uid: state => state.login_user ? state.login_user.uid : null
  }
})
```



src/views/Addresses.vue

```
<template>
  <v-container text-xs-center justify-center>
    <v-layout row wrap>
      <v-flex xs12>
        <h1>連絡先一覧</h1>
      </v-flex>

      <v-flex xs12 mt-5 mr-5 text-xs-right>
        <router-link :to="{ name: 'address_edit' }">
          <v-btn color="info">
            連絡先追加
          </v-btn>
        </router-link>
      </v-flex>
      <v-flex xs12 mt-3 justify-center>
        <v-data-table :headers='headers' :items='addresses'>
          <template v-slot:items="props">
            <td class="text-xs-left">{{ props.item.name }}</td>
            <td class="text-xs-left">{{ props.item.tel }}</td>
            <td class="text-xs-left">{{ props.item.email }}</td>
            <td class="text-xs-left">{{ props.item.address }}</td>
            <td class="text-xs-left">
              <span>
                <router-link :to="{ name: 'address_edit', params: { address_id: props.item.id }}">
                  <v-icon small class="mr-2">edit</v-icon>
                </router-link>
              </span>
            </td>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  created () {
    this.addresses = this.$store.state.addresses
  },
  data () {
    return {
      headers: [
        { text: '名前', value: 'name' },
        { text: '電話番号', value: 'tel' },
        { text: 'メールアドレス', value: 'email' },
        { text: '住所', value: 'address' },
        { text: '操作', sortable: false }
      ],
      addresses: []
    }
  }
}
</script>

<style scoped lang="scss">
a {
  text-decoration: none;
}
</style>

```



### 編集フォームへのデータ復元

src/store.js

```
import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    login_user: null,
    drawer: false,
    addresses: []
  },
  mutations: {
    setLoginUser (state, user) {
      state.login_user = user
    },
    deleteLoginUser (state) {
      state.login_user = null
    },
    toggleSideMenu (state) {
      state.drawer = !state.drawer
    },
    addAddress (state, { id, address }) {
      address.id = id
      state.addresses.push(address)
    }
  },
  actions: {
    setLoginUser ({ commit }, user) {
      commit('setLoginUser', user)
    },
    fetchAddresses ({ getters, commit }) {
      firebase.firestore().collection(`users/${getters.uid}/addresses`).get().then(snapshot => {
        snapshot.forEach(doc => commit('addAddress', { id: doc.id, address:  doc.data() }))
      })
    },
    login () {
      const google_auth_provider = new firebase.auth.GoogleAuthProvider()
      firebase.auth().signInWithRedirect(google_auth_provider)
    },
    logout () {
      firebase.auth().signOut()
    },
    deleteLoginUser ({ commit }) {
      commit('deleteLoginUser')
    },
    toggleSideMenu ({ commit }) {
      commit('toggleSideMenu')
    },
    addAddress ({ getters, commit }, address) {
      if (getters.uid) {
        firebase.firestore().collection(`users/${getters.uid}/addresses`).add(address).then(doc => {
          commit('addAddress', { id: doc.id, address })
        })
      }
    }
  },
  getters: {
    userName: state => state.login_user ? state.login_user.displayName : '',
    photoURL: state => state.login_user ? state.login_user.photoURL : '',
    uid: state => state.login_user ? state.login_user.uid : null,
    getAddressById: state => id => state.addresses.find(address => address.id === id)
  }
})
```



src/App.vue

```
<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-side-icon v-show="$store.state.login_user" @click.stop="toggleSideMenu"></v-toolbar-side-icon>
      <v-toolbar-title class="headline text-uppercase">
        <span>マイアドレス帳</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items v-if="$store.state.login_user">
        <v-btn @click="logout">ログアウト</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <SideNav/>

    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
import firebase from 'firebase'
import SideNav from './components/SideNav'
import { mapActions } from 'vuex'
export default {
  name: 'App',
  components: {
    SideNav
  },
  created () {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setLoginUser(user)
        this.fetchAddresses()
        if (this.$router.currentRoute.name === 'home') this.$router.push({ name: 'addresses' })
      } else {
        this.deleteLoginUser()
        this.$router.push({ name: 'home' })
      }
    })
  },
  data () {
    return {
      //
    }
  },
  methods: {
    ...mapActions(['toggleSideMenu', 'setLoginUser', 'logout', 'deleteLoginUser', 'fetchAddresses'])
  }
}
</script>

```



src/views/AddressForm.vue

```
<template>
  <v-container text-xs-center>
    <v-layout row wrap justify-center>
      <v-flex xs12>
        <h1>連絡先編集</h1>
      </v-flex>

      <v-flex xs5 mt-5>
        <v-card>
          <v-card-text>
            <v-form>
               <v-text-field v-model="address.name" label="名前"></v-text-field>
               <v-text-field v-model="address.tel" label="電話番号"></v-text-field>
               <v-text-field v-model="address.email" label="メールアドレス"></v-text-field>
               <v-text-field v-model="address.address" label="住所"></v-text-field>
               <v-btn @click="$router.push({ name: 'addresses' })">キャンセル</v-btn>
               <v-btn color="info" @click="submit">保存</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  created () {
    if (!this.$route.params.address_id) return
    const address = this.$store.getters.getAddressById(this.$route.params.address_id)
    if (address) {
      this.address = address
    } else {
      this.$router.push({ name: 'addresses' })
    }
  },
  data () {
    return {
      address: {}
    }
  },
  methods: {
    submit () {
      this.addAddress(this.address)
      this.$router.push({ name: 'addresses' })
      this.address = {}
    },
    ...mapActions(['addAddress'])
  }
}
</script>
```



#### データの更新

src/store.js

```
import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    login_user: null,
    drawer: false,
    addresses: []
  },
  mutations: {
    setLoginUser (state, user) {
      state.login_user = user
    },
    deleteLoginUser (state) {
      state.login_user = null
    },
    toggleSideMenu (state) {
      state.drawer = !state.drawer
    },
    addAddress (state, { id, address }) {
      address.id = id
      state.addresses.push(address)
    },
    updateAddress (state, { id, address }) {
      const index = state.addresses.findIndex(address => address.id === id)

      state.addresses[index] = address
    }
  },
  actions: {
    setLoginUser ({ commit }, user) {
      commit('setLoginUser', user)
    },
    fetchAddresses ({ getters, commit }) {
      firebase.firestore().collection(`users/${getters.uid}/addresses`).get().then(snapshot => {
        snapshot.forEach(doc => commit('addAddress', { id: doc.id, address:  doc.data() }))
      })
    },
    login () {
      const google_auth_provider = new firebase.auth.GoogleAuthProvider()
      firebase.auth().signInWithRedirect(google_auth_provider)
    },
    logout () {
      firebase.auth().signOut()
    },
    deleteLoginUser ({ commit }) {
      commit('deleteLoginUser')
    },
    toggleSideMenu ({ commit }) {
      commit('toggleSideMenu')
    },
    addAddress ({ getters, commit }, address) {
      if (getters.uid) {
        firebase.firestore().collection(`users/${getters.uid}/addresses`).add(address).then(doc => {
          commit('addAddress', { id: doc.id, address })
        })
      }
    },
    updateAddress ({ getters, commit }, { id, address }) {
      if (getters.uid) {
        firebase.firestore().collection(`users/${getters.uid}/addresses`).doc(id).update(address).then(() => {
          commit('updateAddress', { id, address })
        })
      }
    }
  },
  getters: {
    userName: state => state.login_user ? state.login_user.displayName : '',
    photoURL: state => state.login_user ? state.login_user.photoURL : '',
    uid: state => state.login_user ? state.login_user.uid : null,
    getAddressById: state => id => state.addresses.find(address => address.id === id)
  }
})

```



src/views.AddressForm.vue

```
<template>
  <v-container text-xs-center>
    <v-layout row wrap justify-center>
      <v-flex xs12>
        <h1>連絡先編集</h1>
      </v-flex>

      <v-flex xs5 mt-5>
        <v-card>
          <v-card-text>
            <v-form>
               <v-text-field v-model="address.name" label="名前"></v-text-field>
               <v-text-field v-model="address.tel" label="電話番号"></v-text-field>
               <v-text-field v-model="address.email" label="メールアドレス"></v-text-field>
               <v-text-field v-model="address.address" label="住所"></v-text-field>
               <v-btn @click="$router.push({ name: 'addresses' })">キャンセル</v-btn>
               <v-btn color="info" @click="submit">保存</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  created () {
    if (!this.$route.params.address_id) return
    const address = this.$store.getters.getAddressById(this.$route.params.address_id)
    if (address) {
      this.address = address
    } else {
      this.$router.push({ name: 'addresses' })
    }
  },
  data () {
    return {
      address: {}
    }
  },
  methods: {
    submit () {
      if (this.$route.params.address_id) {
        this.updateAddress({ id: this.$route.params.address_id, address: this.address })
      } else {
        this.addAddress(this.address)
      }
      this.$router.push({ name: 'addresses' })
      this.address = {}
    },
    ...mapActions(['addAddress', 'updateAddress'])
  }
}
</script>

```



#### 削除機能



src/store.js

```
import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    login_user: null,
    drawer: false,
    addresses: []
  },
  mutations: {
    setLoginUser (state, user) {
      state.login_user = user
    },
    deleteLoginUser (state) {
      state.login_user = null
    },
    toggleSideMenu (state) {
      state.drawer = !state.drawer
    },
    addAddress (state, { id, address }) {
      address.id = id
      state.addresses.push(address)
    },
    updateAddress (state, { id, address }) {
      const index = state.addresses.findIndex(address => address.id === id)

      state.addresses[index] = address
    },
    deleteAddress (state, { id }) {
      const index = state.addresses.findIndex(address => address.id === id)

      state.addresses.splice(index, 1)
    },
  },
  actions: {
    setLoginUser ({ commit }, user) {
      commit('setLoginUser', user)
    },
    fetchAddresses ({ getters, commit }) {
      firebase.firestore().collection(`users/${getters.uid}/addresses`).get().then(snapshot => {
        snapshot.forEach(doc => commit('addAddress', { id: doc.id, address:  doc.data() }))
      })
    },
    login () {
      const google_auth_provider = new firebase.auth.GoogleAuthProvider()
      firebase.auth().signInWithRedirect(google_auth_provider)
    },
    logout () {
      firebase.auth().signOut()
    },
    deleteLoginUser ({ commit }) {
      commit('deleteLoginUser')
    },
    toggleSideMenu ({ commit }) {
      commit('toggleSideMenu')
    },
    addAddress ({ getters, commit }, address) {
      if (getters.uid) {
        firebase.firestore().collection(`users/${getters.uid}/addresses`).add(address).then(doc => {
          commit('addAddress', { id: doc.id, address })
        })
      }
    },
    updateAddress ({ getters, commit }, { id, address }) {
      if (getters.uid) {
        firebase.firestore().collection(`users/${getters.uid}/addresses`).doc(id).update(address).then(() => {
          commit('updateAddress', { id, address })
        })
      }
    },
    deleteAddress ({ getters, commit }, { id }) {
      if (getters.uid) {
        firebase.firestore().collection(`users/${getters.uid}/addresses`).doc(id).delete().then(() => {
          commit('deleteAddress', { id })
        })
      }
    }
  },
  getters: {
    userName: state => state.login_user ? state.login_user.displayName : '',
    photoURL: state => state.login_user ? state.login_user.photoURL : '',
    uid: state => state.login_user ? state.login_user.uid : null,
    getAddressById: state => id => state.addresses.find(address => address.id === id)
  }
})
```



src/views/Addresses.vue

```
<template>
  <v-container text-xs-center justify-center>
    <v-layout row wrap>
      <v-flex xs12>
        <h1>連絡先一覧</h1>
      </v-flex>

      <v-flex xs12 mt-5 mr-5 text-xs-right>
        <router-link :to="{ name: 'address_edit' }">
          <v-btn color="info">
            連絡先追加
          </v-btn>
        </router-link>
      </v-flex>
      <v-flex xs12 mt-3 justify-center>
        <v-data-table :headers='headers' :items='addresses'>
          <template v-slot:items="props">
            <td class="text-xs-left">{{ props.item.name }}</td>
            <td class="text-xs-left">{{ props.item.tel }}</td>
            <td class="text-xs-left">{{ props.item.email }}</td>
            <td class="text-xs-left">{{ props.item.address }}</td>
            <td class="text-xs-left">
              <span>
                <router-link :to="{ name: 'address_edit', params: { address_id: props.item.id }}">
                  <v-icon small class="mr-2">edit</v-icon>
                </router-link>
              </span>
              <span>
                <v-icon small class="mr-2" @click="deleteConfirm(props.item.id)">delete</v-icon>
              </span>
            </td>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  created () {
    this.addresses = this.$store.state.addresses
  },
  data () {
    return {
      headers: [
        { text: '名前', value: 'name' },
        { text: '電話番号', value: 'tel' },
        { text: 'メールアドレス', value: 'email' },
        { text: '住所', value: 'address' },
        { text: '操作', sortable: false }
      ],
      addresses: []
    }
  },
  methods: {
    deleteConfirm (id) {
      if (confirm('削除してよろしいですか？')) {
        this.deleteAddress({ id })
      }
    },
    ...mapActions(['deleteAddress'])
  }
}
</script>

<style scoped lang="scss">
a {
  text-decoration: none;
}
</style>

```

