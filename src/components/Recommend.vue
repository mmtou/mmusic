<template>
  <div class="recommend">
    <!-- banners -->
    <mu-carousel hide-controls class="banner">
      <mu-carousel-item v-for="banner,index in banners" :key="index">
        <!-- <img :src="banner.pic"> -->
        <div :style="{ backgroundImage: 'url(' + banner.pic + ')' }" class="bannerItem">
        </div>
      </mu-carousel-item>
    </mu-carousel>

    <!-- 菜单 -->
    <div class="menu">
      <div class="menu-item" v-for="menu in menus">
        <mu-button fab small color="primary">
          <mu-icon :value="menu.icon"></mu-icon>
        </mu-button>
        <span>{{menu.name}}</span>
      </div>
    </div>

    <mu-divider />

    <!-- 首页内容分类 -->
    <div class="categoryTitle">
      <span>推荐歌单</span>
      <mu-icon value="keyboard_arrow_right"></mu-icon>
    </div>
    <div class="categoryContent">
      <div class="contentItem" v-for="item,index in songList" :key="index">
        <div class="cover" :style="{ backgroundImage: 'url(' + item.picUrl + ')' }">
          <div class="playCount">
            <mu-icon value="headset" :size="12"/>{{item.playcount | calculatePlayCount}}
          </div>
        </div>
        <div class="desc">
          {{item.name}}
        </div>
      </div>
    </div>

    <mu-divider />

    <div class="categoryTitle">
      <span>最新音乐</span>
      <mu-icon value="keyboard_arrow_right"></mu-icon>
    </div>
    <div class="categoryContent">
      <div class="contentItem" v-for="item,index in newSongList" :key="index">
        <div class="cover" :style="{ backgroundImage: 'url(' + item.song.album.picUrl + ')' }">
        </div>
        <div class="desc">
          {{item.name}} by {{item.song.artists[0].name}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      banners: [],
      menus: [
        {
          name: '私人FM',
          icon: 'radio'
        },
        {
          name: '每日推荐',
          icon: 'calendar_today'
        },
        {
          name: '歌单',
          icon: 'list'
        },
        {
          name: '排行榜',
          icon: 'filter_list'
        }
      ],
      songList: [],
      newSongList: []
    }
  },
  components: {
  },
  computed: {
  },
  mounted() {
    this.$get('/api/v2/banner/get').then(response => {
      if (response.code === 200) {
        this.banners = response.banners;
      }
    });
    this.$get('/api/discovery/hotspot').then(response => {
      if (response.code === 200) {
        this.songList = response.data;
      }
    });

    const data = {
      "type": "recommend"
    };
    this.$post('/weapi/personalized/newsong', this.encrypt(data)).then(response => {
      this.newSongList = response.result;
    });
  },
  methods: {

  },
  filters: {
    calculatePlayCount(playCount) {
      if (playCount > 10000) {
        return parseInt(playCount/10000) + '万';
      }
      return playCount;
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.recommend {
  .banner {
    height: 5rem;

    .bannerItem {
      width: 100%;
      height: 100%;
      background-size: cover;
    }
  }
  .menu {
    display: flex;
    justify-content: space-around;
    padding: .48rem 0;

    .menu-item {
      display: flex;
      flex-direction: column;
      align-items: center;

      span {
        padding-top: .32rem;
      }
    }
  }
  .categoryTitle {
    display: flex;
    align-items: flex-end;
    padding: .16rem 0 .08rem .08rem;
  }
  .categoryContent {
    padding: 0 .16rem;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-content: flex-start;

    .contentItem {
      width: 3rem;
      padding-bottom: .16rem;

      .cover {
        height: 3rem;
        background-size: cover;
        position: relative;

        .playCount {
          position: absolute;
          top: .07rem;
          right: .07rem;
          font-size: .16rem;
          color: #FFF;
        }
      }
      .desc {
        font-size: .13rem;
        line-height: .48rem;
        text-align: left;
        padding-bottom: .16rem;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
      }
    }
  }
  .subTitle {
    overflow: auto;
    white-space: normal;
    word-wrap: normal;
    text-align: left;
  }
  .hotImage {
    position: relative;
  }
}
</style>
