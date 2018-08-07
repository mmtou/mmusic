<template>
  <div class="index">
    <!-- appbar -->
    <mu-appbar color="primary">
      <mu-button icon slot="left" label="undocked drawer" @click="toggleDrawer(true)">
        <mu-icon value="menu"></mu-icon>
      </mu-button>
      <mu-button icon class="inactive">
        <mu-icon value="music_note"></mu-icon>
      </mu-button>
      <mu-button icon>
        <mu-icon value="apps"></mu-icon>
      </mu-button>
      <mu-button icon  class="inactive">
        <mu-icon value="ondemand_video"></mu-icon>
      </mu-button>
      <mu-button icon slot="right">
        <mu-icon value="search"></mu-icon>
      </mu-button>
    </mu-appbar>

    <!-- index tabs -->
    <mu-tabs color="primary" indicator-color="white" full-width :value.sync="indexTab" @change="changeIndexTab">
      <mu-tab>推荐</mu-tab>
      <mu-tab>朋友</mu-tab>
      <mu-tab>电台</mu-tab>
    </mu-tabs>

    <recommend v-if="0 === indexTab"/>
    <friend v-if="1 === indexTab"/>

    <mu-divider class="bottomLine"/>

    <player v-bind:songId="557584888"/>

    <mu-drawer :open="drawerOpen" :docked="drawerDocked" @close="toggleDrawer()" class="drawer" width="85%">
      <mu-card>
        <mu-card-media class="drawerCover">
          <img :src="profile.backgroundUrl" />
        </mu-card-media>
        <div class="drawerOwnerInfo">
          <mu-list>
            <mu-list-item :title="profile.nickname" afterText="签到" afterTextClass="signin">
              <mu-avatar slot="left" :src="profile.avatarUrl" class="signin"/>
            </mu-list-item>
          </mu-list>
        </div>
      </mu-card>

      <mu-list>
        <mu-list-item title="我的消息">
          <mu-icon slot="left" value="mail_outline"/>
        </mu-list-item>
        <mu-list-item title="我的VIP">
          <mu-icon slot="left" value="attach_money"/>
        </mu-list-item>
        <mu-list-item title="商城">
          <mu-icon slot="left" value="shopping_cart"/>
        </mu-list-item>
        <mu-list-item title="我的好友">
          <mu-icon slot="left" value="people_outline"/>
        </mu-list-item>
        <mu-list-item title="附近的人">
          <mu-icon slot="left" value="location_on"/>
        </mu-list-item>
        <mu-list-item title="扫一扫">
          <mu-icon slot="left" value="image_search"/>
        </mu-list-item>
        <mu-list-item title="音乐云盘">
          <mu-icon slot="left" value="cloud_queue"/>
        </mu-list-item>
      </mu-list>

      <div class="drawerBottom">
        <mu-divider/>
        <mu-bottom-nav :value="0">
          <mu-bottom-nav-item value="1" title="设置" icon="settings"/>
          <mu-bottom-nav-item value="2" title="退出" icon="power_settings_new" to="login"/>
        </mu-bottom-nav>
      </div>
    </mu-drawer>
  </div>
</template>

<script>
import player from './Player.vue'
import recommend from './Recommend.vue'
import friend from './Friend.vue'

export default {
  name: 'Index',
  data () {
    return {
      drawerOpen: false,
      drawerDocked: true,
      indexTab: 0,
      loginInfo: {},
      profile: {}
    }
  },
  components: {
    player,
    recommend,
    friend
  },
  mounted() {
    this.loginInfo = JSON.parse(window.localStorage.getItem('loginInfo') || '{}');
    this.profile = this.loginInfo.profile || {};
  },
  methods: {
    toggleDrawer (flag) {
      this.drawerOpen = !this.drawerOpen
      this.drawerDocked = !flag
    },
    changeIndexTab(val) {
      this.indexTab = val;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
.index {
  text-align: center;

  .inactive {
    opacity: .5;
  }
  .bottomLine {
    margin-bottom: 56px;
  }
  .drawer {
    text-align: left;

    .drawerBottom {
      position: fixed;
      bottom: 0;
      width: 100%;
    }
    .drawerCover {
      position: relative;
      height: 150px;
      overflow: hidden;
    }
    .drawerOwnerInfo {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;

      .signin {
        color: #FFF;
        border: 1px solid #FFF;
        border-radius: 50px;
        padding: 1px 5px;
      }
    }
  }
}
</style>
