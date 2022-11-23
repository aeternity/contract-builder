module.exports = {
  require: [
    '@babel/register',
    'ts-node/register'
  ],
  recursive: true,
  extension: '.js,.ts',
  timeout: '4s',
}
