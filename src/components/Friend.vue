<template>
  <div class="friend">
    <mu-load-more @refresh="refresh" :refreshing="refreshing" :loading="loading" @load="load">
      <div class="list">
        <div class="itemWithDivider" v-for="item,index in events" :key="index">
          <div class="item">
            <div class="avatar">
              <mu-avatar>
                <img :src="item.user.avatarUrl">
              </mu-avatar>
            </div>
            <div class="content">
              <div class="msg">
                {{JSON.parse(item.json).msg}}
              </div>
              <div class="video" v-if="JSON.parse(item.json).video && JSON.parse(item.json).video.videoId">
                <video width="100%" src="https://music.mmtou.xyz/20180803143439/3001d597e379a9f667a922597fd02712/web/cloudmusic/ICAgMCI0IjAhMiEhMCAkYw==/mv/5843014/1642f963835dd4b7c3cb0ed1fc74593f.mp4" controls="controls">
                  您的浏览器不支持 video 标签。
                </video>
              </div>
              <div class="pics">
                <mu-ripple class="picItem" @click="enlargeImg(pic.originUrl)" v-for="pic in item.pics" :style="{ backgroundImage: 'url(' + pic.originUrl + ')' }">
                </mu-ripple>
              </div>
              <div class="song" v-if="JSON.parse(item.json).song">
                <div class="songCover">
                  <img :src="JSON.parse(item.json).song.album.picUrl" alt="">
                </div>
                <div class="songContent">
                  <div class="songName">
                    {{JSON.parse(item.json).song.name}}
                  </div>
                  <div class="songAuthor">
                    {{JSON.parse(item.json).song.artists[0].name}}
                  </div>
                </div>
              </div>
              <div class="actions">
                <mu-ripple class="actionItem">
                  <mu-icon value="favorite_border" :color="item.info.liked ? 'primary': ''"></mu-icon>
                  {{item.info.likedCount}}
                </mu-ripple>
                <mu-ripple class="actionItem">
                  <mu-icon value="comment"></mu-icon>
                  {{item.info.commentCount}}
                </mu-ripple>
                <mu-ripple class="actionItem">
                  <mu-icon value="share"></mu-icon>
                  {{item.info.shareCount}}
                </mu-ripple>
              </div>
            </div>
          </div>
          <mu-divider></mu-divider>
        </div>
      </div>
    </mu-load-more>

    <mu-dialog width="360" transition="slide-bottom" fullscreen :open.sync="showBigImg">
      <div class="bigImg" @click="closeBigImg">
        <img :src="currentImg">
      </div>
    </mu-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      refreshing: true,
      loading: false,
      events: [],
      currentImg: '',
      showBigImg: false,
      offset: 0
    }
  },
  components: {
  },
  mounted() {
    this.getEvent();
  },
  methods: {
    getEvent() {
      const data = {
        offset: this.offset,
        csrf_token: ""
      };
      this.$post('/eapi/v1/event/get', this.encrypt(data)).then(response => {
        this.events = this.events.concat(response.event);
        this.refreshing = false;
        this.loading = false;
      });
    },
    load() {
      this.offset++;
      this.loading = true;
      this.getEvent();
    },
    refresh() {
      this.offset = 0;
      this.events = [];
      this.refreshing = true;
      this.getEvent();
    },
    enlargeImg(url) {
      this.currentImg = url;
      this.showBigImg = true;
    },
    closeBigImg() {
      this.showBigImg = false;
    }
  },
  filters: {

  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.friend {
  padding: .32rem;

  .item {
    display: flex;
    padding: .32rem 0;

    .avatar {
      padding-right: .08rem;
    }
    .content {
      text-align: left;

      .msg {
        line-height: .64rem;
      }

      .actions {
        display: flex;
        font-size: .13rem;
        color: #888;
        padding-top: .32rem;

        .actionItem {
          position: relative;
          display: flex;
          align-items: center;
          padding-right: .43rem;
          width: 1.71rem;
        }
      }

      .pics {
        display: flex;
        justify-content: space-between;
        padding: 0 .16rem;
        flex-wrap: wrap;

        .picItem {
          position: relative;
          width: 2.56rem;
          height: 2.56rem;
          background-repeat: no-repeat;
          background-size: cover;
          background-position: center;
          margin-bottom: .16rem;
        }
      }

      .song {
        display: flex;
        align-items: center;
        background-color: #ececec;

        .songCover {
          padding-right: .16rem;

          img {
            width: .96rem;
            height: .96rem;
          }
        }
        .songAuthor {
          font-size: .13rem;
          color: #888;
        }
      }
    }
  }
}

.bigImg {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow-y: auto;

  img {
    width: 100%;
  }
}
</style>
