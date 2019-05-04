uterVue.js＋Firebase

## Vue CLI導入

Vue.jsには開発環境をセットアップするための便利なツール Vue CLI が用意されています。

* トランスコンパイラ（モダンなJavaScriptをクラシカルなJSに変換）
* Vue.js関連ライブラリ（rooterやVuex)
* リントツール（静的な解析ツール）
* テストツール

以下文中のreturnキーはWindowsの場合はEnterキーのことです。

### Vue CLIをグローバルにインストールする方法です。

* Nodeのバージョン8.9以上

* Vue CLIのNPMパッケージ3.5以上

Nodeバージョン確認

```
node -v
```

Vue CLIバージョン確認（Vは大文字）

```
vue -V
```

Vue CLIのNPMから最新版をインストール

```
npm install -g @vue/cli
```

* Vue CLIのNPMから指定のバージョンをインストールする方法は `npm install -g @vue/cli@3.5.0` とします。

### Vueコマンドを使用して開発環境のセットアップ

プロジェクトを作成するフォルダに移動します。

わかりやすいようにDesktopに移動します。

```
cd ~/Desktop/
```

Vueコマンドでプロジェクトを作成します。

次のコマンドでsample-appフォルダが作成されて必要なものがインストールされます。

```
vue create sample-app
```

コマンドを入力すると**Please pick a preset**と表示されて次々に質問が表示されます。

その質問に答える形で選択していきます。

次のものはデフォルトを選ぶかマニュアルを選ぶか聞いていますので、今回はマニュアルを選びます。矢印キーで下の「Manually select features 」に移動してreturnキーを押します。

```
  default (babel, eslint) 
> Manually select features 
```

次に`**Check the features needed for your project:** (Press **<space>** to sel

ect, **<a>** to toggle all, **<i>** to invert selection)`と表示されます。

矢印キーで移動して、スペースキーでチェックを入れることができます。

今回はBabel , Router , Vuex , CSS Pre-processors , Linter / Formatterにチェックを入れます。

```
 ◉ Babel
 ◯ TypeScript
 ◯ Progressive Web App (PWA) Support
 ◉ Router
 ◉ Vuex
❯◉ CSS Pre-processors
 ◉ Linter / Formatter
 ◯ Unit Testing
 ◯ E2E Testing
```

次にルーターの使用を聞いてきます。

そのままreturnキーを押します。これはYキーを入力してreturnと同じです。

```
Use history mode for router? (Requires proper server setup for in
dex fallback in production) (Y/n)
```

次にSASSの種類を聞いてきます。dart-sassを選んでreturnキーを押します。

```
Pick a CSS pre-processor (PostCSS, Autoprefixer and CSS Modules a
re supported by default): (Use arrow keys)
  Sass/SCSS (with dart-sass) 
  Sass/SCSS (with node-sass) 
  Less 
  Stylus
```

次にESLintについて聞いてきます。

エラーチェックだけを行う場合は、`ESLint with error prevention only`を選んでreturnキーを押します。

```
Pick a linter / formatter config: (Use arrow keys)
❯ ESLint with error prevention only 
  ESLint + Airbnb config 
  ESLint + Standard config 
  ESLint + Prettier 
```

Lintの実行タイミングはLint on saveとします。

```
Pick additional lint features: (Press <space> to select, <a> to t
oggle all, <i> to invert selection)
❯◉ Lint on save
 ◯ Lint and fix on commit
```

次にconfigについて聞かれますので、In dedicated config filesを選択します。

```
Where do you prefer placing config for Babel, PostCSS, ESLint, et
c.? (Use arrow keys)
❯ In dedicated config files 
  In package.json
```

最後にこれまでの設定の保存を聞かれますので、そのままreturnキーを押すかNキーを押します。

```
Save this as a preset for future projects? (y/N)
```

これらの設定が終わるとプロジェクトの設定が始まります。

これらを手動で設定するとなると大変な作業になりますが、Vue CLIが全て行ってくれます。

設定が終了すると最後の表示に以下の内容があります。

```
cd sample-app
npm run serve
```

デスクトップを確認するとsample-appフォルダが新規に作成されていることがわかります。

従って、cdコマンドでカレントディレクトリを sample-app に移動します。

その後`npm run serve`でサーバーが動きます。

次の表示がされますので、ブラウザのURLに`http://localhost:8080/`と入力します。

```
 App running at:
  - Local:   http://localhost:8080/ 
  - Network: http://192.168.1.61:8080/
```

Vue.jsで作成されたテンプレートが表示されます。

サーバーを停止するにはCtrl + C

サーバーを走らせた時に開いたページは`public/index.html`です。

Index.html 自体はほとんど中身はありませんが、ポイントは#appのdiv要素です。

こちらがマウントされてこの中にコンテンツが書き込まれる仕組みになっています。

## 単一ファイルコンポーネントとは

* コンポーネントごとにファイルを分割したもの
* 再利用しやすく、コンポーネントの改修が簡単
* 1つのファイルにテンプレート、JavaScript,cssを書く

Vue.jsのコードは基本的にsrcフォルダ内に記述します。

コンポーネントはsrc/componentsディレクトリ内に作成します。



## アドレス帳管理を作成

### Addresses.vueの作成

src/componentsディレクトリ内にAddresses.vueを作成します。

### テンプレートの作成方法

基本タグの記述は以下

```
<template>
    <div>
        
    </div>
</template>

<script>
export default {
    
}
</script>

<style scoped lang="scss">
    
</style>
```

#### htmlにh1を追加

テンプレートのhtmlにh1要素を追加して表示の確認をします。

##### 手順1

h1の追加はtemplateタグ内を以下のように変更

```
<template>
    <div>
        <h1>My Address Book</h1>
    </div>
</template>
```

##### 手順2

`src/view/Home.vue`ファイルを次のように変更します。

Addressesの追加とHelloWorld部分は不要ですから削除しています。

```
<template>
  <div class="home">
    <Addresses/>
  </div>
</template>

<script>
// @ is an alias to /src
import Addresses from '@/components/Addresses.vue'
export default {
  name: 'home',
  components: {
    Addresses
  }
}
</script>

```

`components: {Addresses}`部分は少し不思議な記述ですが、これはcomponentsキーの値をオブジェクトの型で記述しています。ES6ではオブジェクトのキーと値の変数名が等しい場合はキーを省略して記述できます。

## シングルページアプリケーション（SPA）

SPAは画面のリロードを行わずページ遷移や画面表示の切り替えを行います。

SPAでは1度だけ画面全体の情報を取得しておき、それ以降の画面遷移はJavaScriptの機能で行う仕組みです。

通常のページの場合、リンクをクリックしてページ遷移する場合、必ずリロードマーク（矢印らしき欠けた円が回転）が動きますが、SPAのリンクの場合ページが変わってもリロードマークが動いていないことがわかります。

![reload](/Users/tahara/Desktop/reload.png)

* メリットとして表示後のリロードがないのでページ遷移がスムーズになります。

* デメリットは初回表示が重くなる傾向があります。

## Vue Routerの作成

Vue RouterはSPAのページごとの画面を切り替えるものです。

ルータの設定は`src/main.js`にあります。

ルータを設定するには、まずルータの機能をインポートしておきます。

`import router from './router'`

Vueインスタンスの初期化の際に引数で渡します。引数はES6のオブジェクト形式で指定します。

これもキーを省略した記述です。省略しないと`router:router`のような記述になります。

```
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
```

### router.jsの確認

importでvue本体の`vue`と`vue-router`のライブラリを読み込んでいます。

また、routerで読み込むコンポーネントも読み込みます。

`import Home from './views/Home.vue'`

複数のコンポーネントがある場合はここではルートのページのみとしてその他のコンポーネントは別の方法でimportします。

```
import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)
```

`Vue.use(Router)`のuseメソッドはプラグインの機能を追加するメソッドです。

今回のルーティングの設定は次の記述です。

```
export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    }
  ]
})

```

#### mode

上記コードのmodeはデフォルトは＃モードです。これを省略すると＃モードになります。

けれども＃マークの入ったURLは不自然です。

そのための対策がmode: 'history'`とすることでhistoryモードに切り替えることができます。

これを使うとURLに＃が入らなくなります。

#### base

Base URLを指定する場所です。この記述をすると環境変数に指定した値がベースになります。

今回は特に何も指定していませんので`/`がベースになります。

例えば`base:'/app'`の場合はURLの最初が`/app/`や`/app/about`のようなURLにすることができます。

#### routes

ここは配列を使って設定を行います。

各ページの設定はオブジェクト形式で記述します。

* path: そのページのパスを記述
* name:ルートの名前を設定することで名前で遷移できるようになる
* component:表示したいコンポーネント名を記述（importしたコンポーネント）

ただし、最初にimportでコンポーネントを読み込むこの方法では複雑なコンポーネントを大量に読み込む場合など初回の読み込みに時間がかかってしまいます。



```
{
      path: '/',
      name: 'home',
      component: Home
    }
```

#### その他のコンポーネントの読み込み方

ルート以外のコンポーネントの設定は次のように関数を使って読み込みます。

 `component: () => import(/* webpackChunkName: "about" */ './views/About.vue')`

```
{
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    }
```

### router-vieとrouter-linkの使い方

`src/App.vue`を開きます。

ざっくりと説明すると`<router-view/>`を記述した場所に指定ルーターで指定したコンポーネントが表示され、`<router-link to=" ">`はナビゲーションを作成しています。

```
<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view/>
  </div>
</template>

```

templateタグ内を見るとrouter-viewタグがあります。

このタグを記述した場所に`router.js`で指定したコンポーネントが表示されます。

templateタグ内を見るとrouter-linkタグがあります。

to属性に`router.js`の`routes`に指定したリンク先の場所を指定します。

```
<router-link to="/">Home</router-link> |
<router-link to="/about">About</router-link>
```



## Vuetifyの導入

https://vuetifyjs.com/ja/getting-started/quick-start

#### 導入方法

cdでsample-appフォルダに移ってから、ターミナルから以下のコマンドを実施

```
vue add vuetify
```
選択場面ではDefaultを選択します。

```
? Choose a preset: (Use arrow keys)
$ > Default (recommended)
$   Prototype (rapid development)
$   Configure (advanced)
```

Vuetifyの導入が終わったら一旦サーバーを終了して、再起動します。

```
npm run serve
```

余計なコードが追加されましたので以下のコードのように削除します。

さらに`<v-toolbar-side-icon></v-toolbar-side-icon>`と`<span>My Address Book</span>`を追加します。

```
<template>
  <v-app>
    <v-toolbar app>
    <v-toolbar-side-icon></v-toolbar-side-icon>
      <v-toolbar-title class="headline text-uppercase">
       <span>My Address Book</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>

    <v-content>
     
    </v-content>
  </v-app>
</template>

<script>

export default {
  name: 'App',
  data () {
    return {
      //
    }
  }
}
</script>

```

### サイドメニューコンポーネント作成

src/components/SideNav.vueファイルを作成します。

```
<template>
  <v-layout wrap style="height: 200px;">

    <v-container>
      <v-layout justify-center>
        <v-btn color="pink" dark @click.stop="drawer = !drawer">Toggle</v-btn>
      </v-layout>
    </v-container>

    <v-navigation-drawer v-model="drawer" absolute temporary>
      <v-list class="pa-1">
        <v-list-tile avatar>
          <v-list-tile-avatar>
            <img src="https://avatars2.githubusercontent.com/u/1363954?s=460&v=4">
          </v-list-tile-avatar>

          <v-list-tile-content>
            <v-list-tile-title>Kazuya Kojima</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>

      <v-list class="pt-0" dense>
        <v-divider></v-divider>

        <v-list-tile v-for="item in items" :key="item.title" @click="">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
  </v-layout>
</template>

<script>
export default {
  data () {
    return {
      drawer: false,
      items: [
        { title: '連絡先一覧', icon: 'list' }
      ]
    }
  }
}
</script>
```

App.vueの編集

```
<template>
  <v-app>
    <v-toolbar app>
    <v-toolbar-side-icon></v-toolbar-side-icon>
      <v-toolbar-title class="headline text-uppercase">
       <span>My Address Book</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <SideNav/>
    <v-content>
     
    </v-content>
  </v-app>
</template>

<script>
import SideNav from './components/SideNav'
export default {
  name: 'App',
  components:{
      SideNav
  },
  data () {
    return {
      //
    }
  }
}
</script>

```



## Vuexについて

V上xはstoreというデータの入れ物を作り、各コンポーネントからstoreにアクセスしてデータの出し入れを行うものです。

Vuexの機能は、Action,Mutation,State,Getterで構成されています。

基本的にはアプリケーションで1つのstoreを持ちます。データを1つの場所で管理すると管理しやすくなりその整合性を保つことができます。

### storeの実装

src/store.jsのコードを以下のようにします。

```
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    drawe: false
  },
  mutations: {
    toggleSideMenu(state){
        state.drawer = !state.drawer
    }
  },
  actions: {
    toggleSideMenu({commit}){
        commit('toggleSideMenu')
    }
  }
})
```

### メニュー開閉状態の管理コンポーネントからストアの利用

components/SideNav.vueの変更を行います。

コンポーネント中央に表示してあったトグルボタンは必要ないので以下のコードを消します。

```
 <v-container>
      <v-layout justify-center>
        <v-btn color="pink" dark @click.stop="drawer = !drawer">Toggle</v-btn>
      </v-layout>
 </v-container>
```



v-modelの値をstoreの値にするには`v-model="$store.state.drawer"`とします。

またコンポーネントに持たせていたdrawerの値をstoreのものに変更します。

scriptタグ内の不要なdrawerを削除します。

```
<script>
export default {
  data () {
    return {
      items: [
        { title: '連絡先一覧', icon: 'list' }
      ]
    }
  }
}
</script>
```



src/App.vueの変更を行います。

```
<template>
  <v-app>
    <v-toolbar app>
    <v-toolbar-side-icon @click.store="openSideMenu"></v-toolbar-side-icon>
      <v-toolbar-title class="headline text-uppercase">
       <span>My Address Book</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <SideNav/>
    <v-content>
     
    </v-content>
  </v-app>
</template>

<script>
import SideNav from './components/SideNav'
export default {
  name: 'App',
  components:{
      SideNav
  },
  data () {
    return {
      //
    }
  },
  methods:{
        openSideMenu(){
            this.$store.dispatch('toggleSideMenu')
        }
    }
}
</script>

```

### ナビゲーションの表示

src/App.vueを修正します。

```
<v-content>
     <router-view/>
</v-content>
```



#### 見栄えの修正

SideNav.vueの修正

* template内の`<v-list-tile v-for="item in items" :key="item.title" :to="item.link">`

* script内の

  * ```items: [
            {title:'ホーム',icon:'home',link:{ name:'home'}},
            { title: '連絡先一覧', icon: 'list',link:{ name:'addresses'}}
    ```



```
<template>
    <v-navigation-drawer v-model="$store.state.drawer" absolute temporary>
      <v-list class="pa-1">
        <v-list-tile avatar>
          <v-list-tile-avatar>
            <img src="../assets/logo.png">
          </v-list-tile-avatar>

          <v-list-tile-content>
            <v-list-tile-title>Hydoro</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>

      <v-list class="pt-0" dense>
        <v-divider></v-divider>

        <v-list-tile v-for="item in items" :key="item.title" :to="item.link">
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
export default {
  data () {
    return {
      items: [
        {title:'ホーム',icon:'home',link:{ name:'home'}},
        { title: '連絡先一覧', icon: 'list',link:{ name:'addresses'}}
      ]
    }
  }
}
</script>
```



### 連絡先追加フォーム

src/views/AddressForm.vueファイルの作成

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

データはscriptタグ内のdata()に記述します。adressプロパティにオブジェクト形式で保存されるようになります。

ボタンは次のコードで記述しています。

```
<v-btn @click="$router.push({ name: 'addresses' })">キャンセル</v-btn>
<v-btn color="info" @click="submit">保存</v-btn>
```



router.jsの設定

```
import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Addresses from './views/Addresses.vue'
import AddressForm from './views/AddressForm.vue'

Vue.use(Router)

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [{
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/addresses',
            name: 'addresses',
            component: Addresses
        },
        {
            path: '/addresses/:address_id?/edit',
            name: 'address_edit',
            component: AddressForm
        },
        {
            path: '/about',
            name: 'about',
            // route level code-splitting
            // this generates a separate chunk (about.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import( /* webpackChunkName: "about" */ './views/About.vue')
        }
    ]
})
```



Addresses.vue

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
        { text: '住所', value: 'address' }
      ],
      addresses: []
    }
  }
}
</script>
```

連絡先追加ボタンは以下の記述です。

```
<router-link :to="{ name: 'address_edit' }">
          <v-btn color="info">
            連絡先追加
          </v-btn>
        </router-link>
```

### 連絡先追加機能を実装

src/store,jsの編集をします。

mutationsとactionsを追加しています。

```
import Vue from 'vue'
import Vuex from 'vuex'

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

