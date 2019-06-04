<template>
  <div class="mypage-wrapper"> 
    <b-header class="b-header"></b-header>
    <div class="main-wrapper">
      <section class="main-left">
        <div class="no-upload-avatar" >
          <img src="../assets/images/avatar-placeholder.svg"  v-if="!avatar">
          <img :src="baseUrl+'/images/avatar/'+avatar" v-else>
        </div>
        <div class="user-info-wrapper" >
          <section class="user-info">
            <div class="user-name">
              <span>{{userData.userName}}</span>
            </div> 
            <div class="github">
              <span>Github:</span>
              <a :href="userData.github" target="_black" v-if="userData.github">
                {{userData.github}}
              </a>
              <router-link v-else :to="{name: 'Setting',params:{userName: userName}}">     
                <input type="text" placeholder="添加Github链接">   
              </router-link>   
            </div>
            <div class="blog">
              <span>我的博客:</span>
              <a :href="userData.blog" target="_black" v-if="userData.blog">
                {{userData.blog}}
              </a>
              <router-link v-else :to="{name: 'Setting',params:{userName: userName}}">
                <input type="text" placeholder="添加博客网址"> 
              </router-link>     
            </div>
            <div class="email">
              <span>我的邮箱:</span>
              <span v-if="userData.email">{{userData.email}}</span> 
              <router-link v-else :to="{name: 'Setting',params:{userName: userName}}">
                <input type="text"  placeholder="添加邮箱">  
              </router-link>   
            </div>
          </section> 
          <router-link :to="{name: 'Setting',params:{userName: userName}}" class="edit-user-info">
            <span>编辑个人资料</span>  
          </router-link> 
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
      <div v-for="item in userArticle" :key="item.id" class="article-wrapper">
        <section class="user-title-wrapper">
          <router-link :to="{ name: 'Article', params: { articleId: item.id }}">
            <span class="title">{{item.title}}d</span>
          </router-link>
        </section>
        <section class="user-content-wrapper">
          <div class="content" v-if="item.content" v-html="item.content"></div>
          <div class="content" v-else>{{item.title}}</div>
        </section>
      </div>
    </section> 
  </div>  
</template>

<script>
import {url,getUserInfo,getUserAllArticle,getAllCollection,getAllLike} from '../API/fetchData.js'
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
    setUserInfoData(){
      let timer=setTimeout(()=>{
        this.userName=this.$store.state.userInfo.userName
        this.avatar=this.$store.state.userInfo.avatar
        if(this.$route.params.userName===this.userName){      
          this.siginUser=true
          this.userName=this.$store.state.userInfo.userName
        }else{
          this.siginUser=false
          this.userName = this.$route.params.userName
        }
        this.getUserInfo()
        this.getUserArticle()
        this.getUserAllLike()
        this.getAllCollection()
        clearTimeout(timer)
      },0)
    },
    getUserInfo(){
      getUserInfo(this.userName).then((res)=>{
        // console.log(res)
        if(res.code===200){
          this.userData=res.data         
        }
      })
    },
    getUserArticle(){
      getUserAllArticle(this.userName).then(res=>{
        console.log(res)
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
            span{
              color: #007fff;
            }
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
            }
            .icon-yuedu{
              width: 22px;
              height: 22px;
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
      margin: 20px 60px;     
      background: #fff;
      height: 100%;
      .user-article-text{
        display: inline-block;
        font-weight: 600;
        padding: 10px 10px;
      }
      .article-wrapper{
        padding: 6px 10px;
        border-bottom: 1px solid #ddd;
        .user-title-wrapper{
          .title{
            font-size: 16px;
            font-weight: 600;
            color: #909090;
          }
        }
        .user-content-wrapper{
          padding: 6px 0;
          word-wrap: break-word;
          word-break: break-all;
          .content{
            color: #909090;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
          }
        }
      }
    }
  }
</style>
