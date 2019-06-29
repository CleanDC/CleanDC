import axios from 'axios'
const { $, Math, Array, Uint8Array, Editor, Blob, FormData, RegExp } = window

let jjalJson
window.addEventListener('message', function (event) {
  if (event.data.gjjal) jjalJson = event.data.gjjal
}, false)

function base64toBlob (dataURI) {
  const base64Data = dataURI.split(',')[1]
  const type = dataURI.split(',')[0].split(':')[1].split(';')[0]
  const sliceSize = 1024
  const byteCharacters = atob(base64Data)
  const bytesLength = byteCharacters.length
  const slicesCount = Math.ceil(bytesLength / sliceSize)
  const byteArrays = new Array(slicesCount)

  for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
    const begin = sliceIndex * sliceSize
    const end = Math.min(begin + sliceSize, bytesLength)
    const bytes = new Array(end - begin)
    for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
      bytes[i] = byteCharacters[offset].charCodeAt(0)
    }
    byteArrays[sliceIndex] = new Uint8Array(bytes)
  }
  return new Blob(byteArrays, { type })
}

async function onSubmit (e) {
  e.preventDefault()
  if (!jjalJson.url && !jjalJson.base64) {
    return alert('- 클린디씨 -\n' +
    '※이미지가 지정되지 않았습니다※\n' +
    '설정 페이지 기타 설정에서\n' +
    '고정 짤방으로 사용할 이미지를 지정해 주세요.\n' +
    '새로고침 후 적용 됩니다.')
  }

  // 첨부파일이 있으면서 url 첨부 방식이면
  if (Editor.getSidebar().getAttachments().length && jjalJson.url) {
    return Editor.modify({ content: `<img src='${jjalJson.url}'>${Editor.getContent()}<p><br><p>` }) // 본문에 태그만 삽입하고 끝
  }

  const form = new FormData()
  form.append('r_key', $('#r_key').val())
  form.append('files[]', base64toBlob(jjalJson.base64), jjalJson.name)

  // 첨부파일이 없으면 무조건 업로드
  const res = await axios({
    url: `//upimg.dcinside.com/upimg_file.php${window.location.search}`,
    method: 'POST',
    data: form
  })

  const data = res.data.files.pop()
  const file = {
    'file_temp_no': data.file_temp_no,
    'filename': data.name,
    'filesize': data.size,
    'imageurl': data.url,
    'imagealign': 'L',
    'originalurl': data.url,
    'thumburl': data._s_url
  }
  if (data.width >= 850) { file.imageurl = data.web__url }
  Editor.getSidebar().getAttacher('image').attachHandler(file)
  if (jjalJson.url) { // url 첨부인경우 수동으로 태그 삽입
    Editor.modify({ content: `<img src='${jjalJson.url}'>${Editor.getContent()}<p><br><p>` })
  }
  $('#upload_status').val('Y')
}

$('.tx-nav-opt').after(`<form id="gjjal">`).next().submit(onSubmit)
  .append(`<input type="submit" id="do-gjjal" value="고정짤방삽입">`)
