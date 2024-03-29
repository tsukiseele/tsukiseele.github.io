export default {
  // 标题
  title: '遠い理想郷 - TsukiSeele\'s Blog',
  // 音乐接口
  musicAPI: 'https://api.hlo.li/playlist/detail?id=7490559834',

  musicRequestMethod: async () => {
    try {
      const playlistId = '7490559834'
      const response = await (await fetch(
        `https://api.hlo.li/playlist/detail?id=${playlistId}`/*, { method: 'GET', mode: 'cors' }*/)).json()
      const result = await (await fetch(
        `https://api.hlo.li/song/detail?ids=${response.playlist.trackIds.map(item => item.id).join(',')}`)).json()
      return result.songs.map((item) => ({
        id: item.id,
        title: item.name,
        artist: item.ar.map((item) => item.name).toString(),
        pic: item.al.picUrl ? item.al.picUrl.replace('http://', 'https://') : '',
        src: `https://music.163.com/song/media/outer/url?id=${item.id}.mp3`,
      }))
    } catch (e) {
      console.log(e)
    }
  },
  musicLyricRequestMethod: async (id) => {
    try {
      const response = await (await fetch(
        `https://api.hlo.li/lyric?id=${id}`/*, { method: 'GET', mode: 'cors' }*/)).json()
      return response.lrc.lyric
    } catch (e) {
      console.log(e)
    }
  },
  // 一言接口（可选，填写后会显示在subtitle)
  hitokotoAPI: 'https://v1.hitokoto.cn/?c=d',
  // 静态资源位置（可选）
  resource: 'https://fastly.jsdelivr.net/gh/tsukiseele/resource@main/',
  // base64编码的Github token
  // token: 'Z2hwX2UzbXo0eDFzMW1JeTlYYjJBYzZoc3lvMVA5eFpLaTN0ZnoxbA==',
  token: ['github', 'pat', '11AGZOCBY0LGJz5sG86RVS_9UJQC7S7NdBe2KYFIkXrKsIJKxPuzX0CH8XX6lxmqyk5ZIJGFKQk6bYGuzj'],
  // token: 'Z2l0aHViX3BhdF8xMUFHWk9DQlkwM1JnOUhPVEdUWFdtX2U3NkVpandCaWZOSmpHem54b1FEMHRsS1RrcHFzQmttUmRPd053eEhFTkVINzdNMlhGV1pZNDFCOGRS',
  // Github OAuth口令，參見https://vssue.js.org/guide/github.html#config-and-start-your-vssue
  oAuth: {
    // Pre
    clientId: '470a7b6c072df5cedab6',
    clientSecret: 'd803f71d288f58ddfa8f36a6e27afc1cda504c81',
  },
  // 博客配置，考慮到GFW，建議不要直接在Issue插入圖片，請使用外鏈以 提升速度和穩定性
  blog: {
    // Github 用户名
    owner: 'tsukiseele',
    // Github 存储文章的仓库名
    repository: 'archives',
    // 每頁顯示的文章數
    paginationSize: 8,
  },
  // 评论配置，雖然評論可以和文章儲存在同一倉庫，但是考慮到需要過濾且影響可讀性，所以請不要這麽做
  vssue: {
    owner: 'tsukiseele',
    repo: 'comment',
  },
  // 导航
  nav: {
    title: '遠い理想郷',
    // title: '',
    subtitle: "TsukiSeele's Blog",
    // subtitle: '',
    avatar: 'https://avatars.githubusercontent.com/u/28500231?v=4',
    owner: 'TsukiSeele',
    introduction: 'しおちゃんがいる場所が、私のハッピーシュガーライフ',
    introductionFrom: '松坂さとう',
    decorateText: '遠い理想郷',//'SWEET', //遠い理想郷
    drawer: false,
    drawerBannerBackground: 'https://cdn.jsdelivr.net/gh/tsukiseele/ImageHosting/upload/826f66f94e3ebf1f62cff7c9109bb118.jpeg',
    nav: [
      { name: 'Blog', icon: 'blog', to: '/post/1' },
      { name: 'Project', icon: 'project', to: '/projects' },
      // { name: 'Experience', icon: 'experience', to: '/experience' },
      { name: 'Timeline', icon: 'event_note', to: '/timeline' },
      { name: 'About', icon: 'about', to: '/about' },
      // { name: 'Friends', icon: 'about', to: '/friends' },
    ],
    links: [
      { icon: 'github', to: 'https://github.com/tsukiseele' },
      { icon: 'twitter', to: 'https://twitter.com/tsukiseele' },
      { icon: 'mail', to: 'mailto:tsukiseele@gmail.com' },
    ],
  },
  // 页面元数据
  meta: [
    {
      charset: 'utf-8',
    },
    {
      name: 'viewport',
      content: 'width=device-width,initial-scale=1.0,maximum-scale=1,minimum-scale=1,user-scalable=no',
    },
    {
      hid: 'description',
      name: 'description',
      content: '遠い理想郷, TsukiSeele的二次元与技术宅的个人博客',
    },
  ],
  backgroundTheme: 'cicada-stripes',
  // backgroundTheme: 'steps',
  sideTheme: 'tartan'
  // backgroundThemes: [
  //   'cicada-stripes',
  //   'arrows',
  //   'zig-zag',
  //   'weave',
  //   'upholstery',
  //   'starry-night',
  //   'carbon',
  //   'carbon-fibre',
  //   'hearts',
  //   'argyle',
  //   'steps',
  //   'stars',
  //   'japanese-cube',
  //   'bricks',
  //   'polka-dot',
  //   'checkerboard',
  //   'diagonal-checkerboard',
  //   'tartan',
  //   'lined-paper',
  //   'blueprint-grid',
  //   'tablecloth',
  //   'honeycomb',
  //   'wave',
  //   'pyramid',
  //   'chocolate-weave',
  //   'cross-dots',
  //   'madras',
  // ],
}
