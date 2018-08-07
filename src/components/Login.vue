<template>
  <div class="login">
    <div class="indexLogin" v-if="showLogin">
      <img src="../assets/logo.png" alt="logo" class="logo">
      <mu-button color="primary" full-width @click="loginToggle">
        手机号登录
      </mu-button>
      <br><br>
      <mu-button color="primary" primary full-width @click="regToggle">
        注册
      </mu-button>
      <br><br>
      <mu-button full-width flat to="/" style="width: 100%">
        游客试用
      </mu-button>

      <!-- 其他方式登录 -->
      <div class="bottom">
        <div class="title">
          其他登录方式
        </div>
        <mu-divider/>
        <div class="loginMethod">
          <div class="methoItem">
            <mu-button fab small color="white">
              <iconsvg icon-class="wechat" />
            </mu-button>
            <span>微信</span>
          </div>
          <div class="methoItem">
            <mu-button fab small color="white">
              <iconsvg icon-class="qq" />
            </mu-button>
            <span>QQ</span>
          </div>
          <div class="methoItem">
            <mu-button fab small color="white">
              <iconsvg icon-class="weibo" />
            </mu-button>
            <span>微博</span>
          </div>
          <div class="methoItem">
            <mu-button fab small color="white">
              <iconsvg icon-class="netease" />
            </mu-button>
            <span>网易邮箱</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 手机号登录 -->
    <div class="mobileLogin" v-if="showMobileLogin">
      <mu-appbar color="primary">
        <mu-button icon slot="left" @click="loginToggle">
          <mu-icon value="arrow_back"></mu-icon>
        </mu-button>
        手机号登录
      </mu-appbar>

      <div class="form">
        <mu-text-field hintText="请输入手机号" type="number" v-model="mobile" icon="smartphone" fullWidth/>
        <mu-text-field hintText="请输入密码" type="password" v-model="password" icon="lock" fullWidth/>
        <mu-button primary full-width color="primary" @click="login">
          登录
        </mu-button>
      </div>
    </div>

    <div class="mobileReg" v-if="showMobileReg">
      <mu-appbar>
        <mu-button icon slot="left" @click="regToggle">
          <mmu-icon value="arrow_back"/>
        </mu-button>
        手机号注册
      </mu-appbar>
      <mu-text-field hintText="请输入手机号" type="number" icon="smartphone" fullWidth/>
      <mu-text-field hintText="请输入密码" type="password" icon="lock" fullWidth/>
      <mu-raised-button label="注册" primary full-width class="primaryButton"/>
    </div>
    <!-- tips -->
    <mu-snackbar position="top" :open.sync="showErrorMessage">
      {{errorMessage}}
    </mu-snackbar>
  </div>
</template>

<script>
import crypto from 'crypto'

export default {
  data() {
    return {
      showLogin: true,
      showMobileLogin: false,
      showMobileReg: false,
      errorMessage: '',
      showErrorMessage: false,
      mobile: '',
      password: ''
    }
  },
  methods: {
    loginToggle() {
      this.showMobileLogin = !this.showMobileLogin;
      this.showLogin = !this.showMobileLogin;
    },
    regToggle() {
      this.showMobileReg = !this.showMobileReg;
      this.showLogin = !this.showMobileReg;
    },
    login() {
      if (this.mobile && this.password) {
        const md5sum = crypto.createHash("md5");
        md5sum.update(this.password);
        let data = {
          phone: this.mobile,
          password: md5sum.digest("hex"),
          rememberLogin: "true"
        };
        // 加密
        let cryptoreq = this.encrypt(data);
        this.$post('/weapi/login/cellphone', cryptoreq)
        .then(response => {
          if (response.code === 200) {
            window.localStorage.setItem('loginInfo', JSON.stringify(response));
            // location.href = "/";
          } else {
            this.errorMessage = data.msg || '用户名或密码错误';
            this.showErrorMessage = true;
            setTimeout(() => {
              this.showErrorMessage = false;
            }, 3000);
          }
        });
      }
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.login {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  background-image: url(../assets/background@2x.png);
  background-repeat: no-repeat;
  background-size: cover;

  .logo {
    width: 96px;
    height: 96px;
    display: block;
    margin: 48px auto;
  }
  .indexLogin {
    padding: 0 24px;
  }
  .bottom {
    position: fixed;
    left: 0;
    right: 0
    bottom: 0;
    padding: 0 24px;
    text-align: center;
    font-size: 10px;
    color: #888;

    .loginMethod {
      display: flex;
      justify-content: space-around;
      padding: 12px 0;

      .methoItem {
        display: flex;
        flex-direction: column;
        align-items: center;

        span {
          padding-top: .32rem;
        }
      }
    }
  }

  .mobileLogin {
    .form {
      margin-top: 12px;
    }
  }
}
</style>
