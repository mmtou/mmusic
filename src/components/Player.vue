<template>
  <div class="miniplayer">
    <audio id="audio" :src="src">
    您的浏览器不支持在线播放
    </audio>
    <mu-appbar>
      <mu-avatar slot="left" class="avatar" :src="albumPicUrl"/>
      <mu-circular-progress mode="determinate" slot="right" :size="25" color="red" :value="progress" class="progress"/>
      <mu-button icon slot="right" @click="play" v-if="isPlaying">
        <mu-icon value="pause_circle_outline"/>
      </mu-button>
      <mu-button icon slot="right" @click="play" v-if="!isPlaying">
        <mu-icon value="play_circle_outline"/>
      </mu-button>
      <mu-button icon slot="right">
        <mu-icon value="playlist_play"/>
      </mu-button>
      <div class="songName">
        {{name}}
        <span class="lyric">
          {{currentLyric}}
        </span>
      </div>
    </mu-appbar>
  </div>
</template>
<script>
let timer;
export default {
  data() {
    return {
      isPlaying: false,
      progress: 0,
      src: '',
      name: '',
      lyric: {},
      currentLyric: null,
      albumPicUrl: ''
    }
  },
  props: {
    songId: {
      type: Number,
      required: true
    }
  },
  methods: {
    calculateProgress () {
      let audio =document.querySelector('#audio');
      if (audio) {
        let currentTime = audio.currentTime;
        this.progress = currentTime/audio.duration*100;
        let temp = parseInt(currentTime*1000);
        let minute = parseInt(temp/60000).toString();
        if (minute.length < 2) {
          minute = "0" + minute;
        }
        temp = temp%60000;
        let second = parseInt(temp/1000).toString();
        if (second.length < 2) {
          second = "0" + second;
        }
        temp = temp%1000;
        let millisecond = parseInt(temp/10).toString();
        if (millisecond.length < 2) {
          millisecond = "0" + millisecond;
        }
        this.currentLyric = this.lyric[minute + ":" + second + "." + millisecond] || this.currentLyric || this.lyric['00:00.00'];
      }
    },
    play () {
      let audio =document.querySelector('#audio');
      if(!this.isPlaying){
        // audio.play();
        timer = setInterval(this.calculateProgress, 1);
      } else {
        audio.pause();
        clearInterval(timer);
      }
      this.isPlaying = !this.isPlaying;
    }
  },
  mounted() {
    this.songId = this.$route.query.songId || this.songId;
    console.log('songId: ', this.songId);
    // 歌曲详情
    let data = {
      'id': this.songId,
  		'ids': '[' + this.songId + ']'
    };
    this.$http.post('/api/song/detail', this.querystring.stringify(data))
    .then(response => {
      let data = response.data;
      if (data.code === 200) {
        let songs = data.songs;
        if (songs && songs[0]) {
          let song = songs[0];
          this.name = song.name;
          this.albumPicUrl = song.album.picUrl;
        }
      }
    })
    // 歌词
    this.$http.post('/api/song/lyric?os=osx&id=' + this.songId + '&lv=-1&kv=-1&tv=-1')
    .then(response => {
      let data = response.data;
      if (data.code === 200) {
        let lrc = data.lrc;
        if (lrc) {
          var lyrics = lrc.lyric.split('\n');
          this.lyric = {};
          for (var i in lyrics) {
            let key = lyrics[i].substr(1, 8);
            let content = lyrics[i].split(']');
            content = content[content.length-1];
            let value = content.trim();
            if (value && value != "") {
              this.lyric[key] = value;
            }
          }
        }
      }
    })
    // 歌曲地址
    data = {
      "ids": [this.songId],
      "br": 320000,
      "csrf_token": ''
    };
    // 加密
    let cryptoreq = this.encrypt(data);
    this.$http.post('/weapi/song/enhance/player/url', this.querystring.stringify(cryptoreq))
    .then(response => {
      let data = response.data;
      if (data.code === 200) {
        let result = data.data;
        if (result && result[0]) {
          this.src = result[0].url;
        }
      }
    })
    window.setTimeout(this.play,2000)
  }
}
</script>
<style  lang="stylus" rel="stylesheet/stylus" scoped>
.miniplayer {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 56px;
  background: #474a4f;
  text-align: left;
}
.progress {
  right: -36px;
}
.songName {
  height: 56px;
  .lyric {
    font-size: 14px;
  }
}
.avatar {
  -webkit-animation: circleProgressLoad 5s linear infinite;
}
@-webkit-keyframes circleProgressLoad{
	0% {
		-webkit-transform: rotate(0deg);
	}
  100% {
		-webkit-transform: rotate(360deg);
	}
}
</style>
