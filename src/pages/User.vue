<template>
  <div class="mypage-wrapper"> 
    <b-header class="b-header"></b-header>
    <div class="main-wrapper">
      <section class="main-left">
        <div class="no-upload-avatar" >
          <img src="../assets/images/avatar-placeholder.svg"  v-if="!avatar">
          <img :src="baseUrl+'/images/avatar/'+avatar" v-else>
        </div>
        <div class="user-info-wrapper">
          <section class="user-info">
            <div class="user-name">
              <span>{{userName}}</span>
            </div> 
            <div class="github">
              <span>Github:</span>
              <a :href="userData.github" target="_black" v-if="userData.github">
                {{userData.github}}
              </a>              
              <span v-else>没有Github链接</span>             
            </div>
            <div class="blog">
              <span>我的博客:</span>
              <a :href="userData.blog" target="_black" v-if="userData.blog">
                {{userData.blog}}
              </a>
              <span v-else>没有博客网址</span>           
            </div>
            <div class="email">
              <span>我的邮箱:</span>
              <span v-if="userData.email">{{userData.email}}</span>    
              <span v-else>没有邮箱</span>
            </div>
          </section> 
          <span @click="linkToSetting" class="edit-user-info" v-if="siginUser">编辑个人资料</span>  
        </div>      
      </section>
      <section class="main-right">
        <div class="main-right-one">
          <span class="user-text">个人成就</span>
          <div class="icon-and-text">
            <svg class="icon-dianzan" id="sel-show">
              <use xlink:href="#icon-dianzan" id="sel-show"></use>
            </svg>
            <span>获得点赞 {{likeNum}}</span>
          </div>
          <div class="icon-and-text">
            <svg class="icon-yuedu" id="sel-show">
              <use xlink:href="#icon-yuedu" id="sel-show"></use>
            </svg>
            <span>文章被阅读 {{readNumber}}</span>
          </div>          
        </div>

        <div class="main-right-two">
          <div>
            <span>收藏数</span>
            <span>{{collectionNum}}</span>
          </div>
          <div>
            <span>加入于</span>
            <span>{{userData.time}}</span>
          </div>
        </div>
      </section>  
    </div>
    <section class="user-article">
      <span class="user-article-text">个人文章</span>  
      <div class="homepage-main-wrapper" v-for="item in userArticle" :key="item.id">
        <section class="homepage-title-wrapper">
          <!-- 跳转到文章详情 -->
          <router-link :to="{ name: 'Article', params: { articleId: item.id }}">
            <span class="title">{{item.title}}</span>
          </router-link>
        </section>
        <section class="homepage-content-wrapper">
          <div class="content" v-if="item.content" v-html="item.content"></div>
          <div class="content" v-else>{{item.title}}</div>
        </section>
        <section class="homepage-bottom-wrapper">
          <div class="bottom-wrapper">
            <span class="time">{{item.moment}}</span>
            <router-link :to="{ name: 'User', params: { userName: item.name }}">
              <span class="author">{{item.name}}</span>
            </router-link>          
            <span class="comment">评论:({{item.comments}})</span>
            <span class="reading">阅读:({{item.pv}})</span>
          </div>
          <div class="article-link">
            <!-- 跳转到文章详情 -->
            <router-link :to="{ name: 'Article', params: { articleId: item.id }}">
              <span class="title">阅读全文</span>
            </router-link>
          </div>
        </section>
      </div>
    </section> 
  </div>  
</template>

<script>
import {url,getUserNoSignin,getUserAllArticle,getAllCollection,getAllLike} from '../API/fetchData.js'
import bHeader from './common/bHeader.vue'

export default {
  name: 'Mypage',
  data () {
    return {
      userName:'',
      siginUser: true,
      avatar:'',
      userData: '',
      baseUrl: '',
      userArticle: [],
      likeNum: '',
      collectionNum: '',
      readNumber: 0
    }
  },
  components:{
    bHeader
  },
  methods:{
    linkToSetting(){
      if(this.userName){
        this.$router.push({name: 'Setting',params: {userName: this.userName}})
      }else{
        this.$root.tooltip('没有登录无法继续操作')
      }
    },
    setUserInfoData(){
      let timer=setTimeout(()=>{
        this.userName=this.$store.state.userInfo.userName        
        if(this.$route.params.userName===this.userName){      
          this.siginUser=true
          this.userName=this.$store.state.userInfo.userName
        }else{
          this.siginUser=false
          this.userName = this.$route.params.userName
        }
        this.getUserNoSignin()
        this.getUserArticle()
        this.getUserAllLike()
        this.getAllCollection()
        clearTimeout(timer)
      },0)
    },
    getUserNoSignin(){
      getUserNoSignin(this.userName).then((res)=>{
        // console.log(res)
        if(res.code===200){
          this.userData=res.data  
          this.avatar=this.userData.avatar   
        }
      })
    },
    getUserArticle(){
      getUserAllArticle(this.userName).then(res=>{
        if(res.code===200){
          this.userArticle=res.data
          this.readNum()
        }
      })
    },
    readNum(){
      let readnum=0
      for(let i=0;i<this.userArticle.length;i++){
        readnum=readnum+this.userArticle[i].pv        
      }
      this.readNumber=readnum
    },
    getUserAllLike(){
      getAllLike(this.userName).then(res=>{
        // console.log(res)
        this.likeNum=res.data.length
      })
    },
    getAllCollection(){
      getAllCollection(this.userName).then(res=>{
        // console.log(res)
        this.collectionNum=res.data.length
      })
    }
  },
  mounted () { 
    this.baseUrl=url
    this.setUserInfoData()    
  }
}

</script>

<style lang="scss" scoped>
  .mypage-wrapper{
    background: #f4f5f5;
    .b-header{
      background: #fff;
    }
    .main-wrapper{
      display: flex; 
      justify-content: space-between;
      padding: 20px 60px;
      .main-left{
        display: flex;
        align-items: center;
        width: 66%;
        background: #fff;
        .no-upload-avatar{
          padding: 10px;
          img{
            width: 100px;
            height: 100px;
            border-radius: 50%;
          }
        }
        .user-info-wrapper{
          .user-info{
            padding: 6px 0;
            .user-name{
              font-weight: 600;
              padding: 5px 0;
            }
            .github{
              padding: 5px 0;
              a{
                color: #007fff;
              }
              input{
                border: none;
                padding: 8px 6px;
              }
              input:focus{
                outline: none;
              }
            }
            .blog{
              padding: 5px 0;
              a{
                color: #007fff;
              }
              input{
                border: none;
                padding: 8px 6px;
              }
              input:focus{
                outline: none;
              }
            }
            .email{
              padding: 5px 0;
              input{
                border: none;
                padding: 8px 6px;
              }
              input:focus{
                outline: none;
              }
            }
          } 
          .edit-user-info{
            font-size: 14px;            
            display: inline-block;
            border: 1px solid #007fff;
            padding: 5px 5px;
            margin-bottom: 10px;
            border-radius: 5px;
            color: #007fff;
            cursor: pointer;
          }
        }
      }
      .main-right{
        width: 34%;
        background: #fff;
        margin-left: 10px;
        .main-right-one{
          padding: 10px;
          .user-text{
            font-weight: 600;
          }
          .icon-and-text{
            display: flex;
            align-items: center;
            .icon-dianzan{
              width: 22px;
              height: 22px;
              fill: #92c6ff;
              border-radius: 50%;
              background: #f4f5f5;
            }
            .icon-yuedu{
              width: 22px;
              height: 22px;
              fill: #92c6ff;
              border-radius: 50%;
              background: #f4f5f5;
            }
            span{
              padding-left: 10px;
              font-size: 14px;
              margin: 10px 0;
            }
          }
        }
        .main-right-two{
          padding: 0 10px;
          div{
            display: flex;
            align-items: center;
            padding-bottom: 8px;
            span:nth-child(2){
              padding-left: 30px;
            }
          }
        }
      }  
    } 
    .user-article{
      padding: 20px 60px;     
      background: #fff;
      height: 100%;
      .user-article-text{
        display: inline-block;
        padding: 10px 10px;
        font-size: 22px;
        width: 100%;
        border-bottom: 1px solid #e9e9e9;
      }
      .homepage-main-wrapper{
        padding: 10px;
        border-bottom: 1px solid #e9e9e9;
        .homepage-title-wrapper{
          .title{
            font-size: 22px;
            color: #000;
            font-weight: 500;
          }
        }
        .homepage-content-wrapper{
          margin-top: 16px;
          word-wrap: break-word;
          word-break: break-all;
          .content{
            font-size: 16px;
            color: #86868f;
            line-height: 1.8;
            padding: 10px 0;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
          }
        }
        .homepage-bottom-wrapper{
          display: flex;
          margin-bottom: 3px;
          justify-content: space-between;
          align-items: center;
          font-size: 14px;
          .bottom-wrapper{
            span{
              color: #86868f;
              padding: 0 2px;
              font-size: 12px;    
              &.author{
                color: #2175bc;
              }
            }
            
          }
          .article-link{
            span{
              color: #2175bc;
              font-size: 12px;
              margin-right: 50px;
            }
          }
        }
      }
    }
  }
</style>
