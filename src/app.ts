import Express = require('express')
import path = require('path') // 標準モジュール
import fetch from 'node-fetch'

import assert from 'assert'

// 引数が渡ってきた場合はそれをport番号として使う
let port = 3000
if (
  process.argv[2]
  && Number.isInteger(
    parseInt(process.argv[2])
  )
) port = parseInt(process.argv[2])

const app = Express()

// localのimagesディレクトリにfilesパスでアクセス出来るように
app.use('/files', Express.static(
  path.join(__dirname, '/../images')
))
// localのjsonsディレクトリにfilesパスでアクセス出来るように
app.use('/files', Express.static(
  path.join(__dirname, '/../jsons')
))

// GET method routeを設定
app.get('/');

// Starts the HTTP server listening for connections
app.listen(port, () => {
  console.log('server is up')

  const url = `http://localhost:${port}/`

  // 第二引数のmethod: 'GET'はdefault値のため省略可
  let imageLength: number
  fetch(url + 'files/pokemon.png', { method: "GET" })
    .then(res => {
      if (res.ok) {
        // Content-Typeはimage/png
        assert.equal(res.headers.get('Content-Type'), 'image/png')
        imageLength = parseInt(res.headers.get('Content-Length') || '0', 10)

        return res.buffer() // res.text() だとサイズが変わる
      }
      throw new Error('Network response was not ok.')
    })
    .then(buffer => {
      assert.equal(imageLength, buffer.length)
    })
    .catch((err) => {
      console.log('There has been a problem with fetch image operation: ', err)
    })

  // 第二引数のmethod: 'GET'はdefault値のため省略可
  let jsonLength: number
  fetch(url + 'files/tenki.json', { method: "GET" })
    .then(res => {
      if (res.ok) {
        // Content-Typeはapplication/json
        assert.equal(res.headers.get('Content-Type'), 'application/json; charset=UTF-8')
        jsonLength = parseInt(res.headers.get('Content-Length') || '0', 10)

        return res.text()
      }
      throw new Error('Network response was not ok.')
    })
    .then(text => {
      assert.equal(jsonLength, text.length)
    })
    .catch((err) => {
      console.log('There has been a problem with fetch json operation: ', err)
    })
});
