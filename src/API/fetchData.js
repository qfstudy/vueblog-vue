import axios from 'axios'
// const url = 'http://api.qifei.site'
const url = 'http://localhost:3000'
let $axios = axios.create({
  baseURL: url + '/blog/',
});

// function getCookieValue(name) {
//   let reg = new RegExp(name + '=' + '([^;]*)(;|$)')
//   let result = reg.exec(document.cookie)
//   return (result && result[1]) || null
// }

function $fetch(method, url, data) {
  // console.log(method)
  // console.log(url)
  // console.log(data)
  return new Promise((resolve, reject) => {
    $axios({
      method,
      url,
      withCredentials: true,
      data: data
    }).then(res => {
      console.log(res)
      let result = res.data
      if (result.code == 200 || result.code == 201) {
        console.log('66666666resolve')
        resolve(result)        
      } else {
        console.log('55555555result')
        reject(result)
      }
    }).catch(err => {
      console.log('111111111')
      reject(err)
    })

  })
}
// method, url, data
// 注册
export const signup = (userName, password, avatar) => {
  return $fetch('post','signup', {userName,password,avatar})
}

// 登录
export const signin = (userName, password) => {
  return $fetch('post','signin', {userName,password})
}

// 登出
export const signout = () => {
  return $fetch('post','signout')
}
// 获取用户个人信息　比如头像，用户名等navbar
export const getUserInfo = () => {
  return $fetch('get','getuserinfo')
}

// 写博客
export const saveWriteData = (title, content) => {
  return $fetch('post','write', {title,content})
}

// 获取用户所有博客
export const getUserAllArticle = (userName) => {
  return $fetch('post','userallarticle', {userName})
}

// 获取所有用户的博客
export const getAllArticles = () => {
  return $fetch('get','allarticles')
}

//编辑博客时获取博客
export const getEditArticle = (articleId) => {
  return $fetch('post','getedit',{articleId})
}

//保存编辑后的博客
export const saveEditArticle = (articleId,title,content) => {
  return $fetch('post','saveeditarticle',{articleId,title,content})
}

// 获取单篇博客详情
export const getAnArticle = (articleId) => {
  return $fetch('post','getanarticle', {articleId})
}
// 删除博客
export const deleteAnArticle = (articleId) => {
  return $fetch('post','deleteanarticle', {articleId})
}

//保存评论
export const saveComment = (userName,content,articleId) => {
  return $fetch('post','saveusercomment',{userName,content,articleId})
}
// 获取评论
export const getComment = (articleId) => {
  return $fetch('post','getallcomment',{articleId})
}
// 删除评论
export const deleteComment = (commentId,userName,articleId) => {
  return $fetch('post','deleteusercomment',{commentId,userName,articleId})
}
