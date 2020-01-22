export default {
  baseUrl: {
    dev: {
      normal: '/nginx/',
      done: '/test/',
      obtain: '/obtain/',
      ty: '/ty/'
    },
    pro: {
      done: '/api/',
      public: '/public/'
    }
  },
  publicPath: [/^\/public/, /^\/obtain/]
}
