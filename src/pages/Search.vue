<template>
  <div class="search-container">
    <b-header class="homepage-header"></b-header>
    <section class="search-result">
      <div class="homepage-main-wrapper" v-for="item in results" :key="item.id">
        <section class="homepage-title-wrapper">
          <!-- 跳转到文章详情 -->
          <router-link :to="{ name: 'Article', params: { articleId: item.id }}">
            <span class="title">{{item.title}}</span>
          </router-link>
        </section>
        <section class="homepage-content-wrapper" v-if="item.title">
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
import bHeader from './common/bHeader.vue'

export default {
  name: 'Search',
  data () {
    return {
      inputSearch: '',
      results: ''
    }
  },
  components:{
    bHeader
  },
  
  methods:{
    handleResult(){
      if(this.results.length<1){
        this.$root.tooltip('没有搜索到文章',1)
        return
      }
      this.results.forEach(item => {
        item.content = item.content
          .split("<pre>")[0]
          .replace(/<[^>]+>/g, "")
          .trim();
      });
    }
  },
  mounted(){
    this.$root.bus.$on('emitSearchValue',(value)=>{
      if(!value){
        this.results=''
        return
      }
      this.results=value
      this.handleResult()
    })
  }
}

</script>

<style lang="scss" scoped>
  .search-container{
    .search-result{
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
