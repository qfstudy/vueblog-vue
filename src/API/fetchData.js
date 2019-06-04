import axios from 'axios'
// const url = 'http://api.qifei.site'
export const url = 'http://localhost:5000'
let $axios = axios.create({
  baseURL: url + '/blog/',
  withCredentials: true
});

// function getCookieValue(name) {
//   let reg = new RegExp(name + '=' + '([^;]*)(;|$)')
//   let result = reg.exec(document.cookie)
//   console.log('cookie'+result)
//   return (result && result[1]) || null
// }
// getCookieValue()

function $fetch(method, url, data) {
  // console.log(method)
  // console.log(url)
  // console.log(data)
  return new Promise((resolve, reject) => {
    $axios({
      method,
      url,
      data: data
    }).then(res => {
      console.log(res)
      let result = res.data
      if (result.code == 200 || result.code == 201) {
        resolve(result)        
      } else {
        reject(result)
      }
    }).catch(err => {
      reject(err)
    })

  })
}
// method, url, data
// 注册
export const signup = (userName, password) => {
  return $fetch('post','signup', {userName,password})
}

// 登录
export const signin = (userName, password) => {
  return $fetch('post','signin', {userName,password})
}

// 验证码
export const verifyCodeChange=()=>{
  return $fetch('get','verifycode')
}

// 登出
export const signout = () => {
  return $fetch('post','signout')
}
// 获取用户个人信息　比如头像，用户名等
export const getUserInfo = () => {
  return $fetch('get','getuserinfo')
}

// 写博客
export const saveWriteData = (userName, avatar ,title, content) => {
  return $fetch('post','write', {userName, avatar,title,content})
}

// 获取单个用户所有博客
export const getUserAllArticle = (userName) => {
  return $fetch('post','userallarticle', {userName})
}

// 获取所有的博客
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
export const saveComment = (userName,avatar,content,articleId) => {
  return $fetch('post','saveusercomment',{userName,avatar,content,articleId})
}
// 获取评论
export const getComment = (articleId) => {
  return $fetch('post','getallcomment',{articleId})
}
// 删除评论
export const deleteComment = (commentId,userName,articleId) => {
  return $fetch('post','deleteusercomment',{commentId,userName,articleId})
}

// 上传头像----
export const uploadAvatar = (userName, avatar) => $fetch('post', 'uploadavatar', {
  avatar,
  userName
})

// 收藏
export const saveCollection = (userName, articleId) => $fetch('post', 'addcollection', {
  userName,
  articleId
})

// 获取收藏
export const getCollection = (userName, articleId) => $fetch('post', 'getcollection', {
  userName,
  articleId
})

// 获取所有收藏
export const getAllCollection = (userName) => $fetch('post', 'getallcollection', {
  userName
})

// 点赞
export const saveLike = (userName, articleId) => $fetch('post', 'addlike', {
  userName,
  articleId
})

// 获取点赞
export const getLike = (userName, articleId) => $fetch('post', 'getlike', {
  userName,
  articleId
})

// 获取所有点赞
export const getAllLike = (userName) => $fetch('post', 'getalllike', {
  userName
})

//　获取五篇文章 getnewarticle
export const getNewArticle = (userName) => $fetch('post', 'getnewarticle', {
  userName
})

// 保存用户信息 saveuserinfo

export const saveUserInfo=(avatar,github,blog,email,userName)=>$fetch('post', 'saveuserinfo', {
  avatar,
  github,
  blog,
  email,
  userName
})
