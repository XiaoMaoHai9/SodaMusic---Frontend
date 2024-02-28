module.exports = {
  env: {
    development: {
      sourceMaps: true,
      retainLines: true
    }
  },
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    ['import', {
      libraryName: 'ant-design-vue',
      libraryDirectory: 'es',
      style: true // 默认导入的样式文件为less文件
    }]
  ]
}
