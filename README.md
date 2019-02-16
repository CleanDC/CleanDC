# CleanDC  [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
DCInside Chrome extension

## 폴더구조
```
CleanDC
├── helper              - 브라우저에 Inject 되는 헬퍼 파일들
│ └── helper.js         - 진입점
├── icons
├─┬ pages               - 보여주는 페이지를 가진 요소들
│ ├── assets
│ ├── components        - Vue 컴포넌트들
│ ├── options.html
│ ├── options.js        - 옵션 페이지 진입점
│ ├── Options.vue
│ ├── popup.html
│ ├── popup.js          - 팝업 페이지 진입점
│ ├── Popup.vue
│ └── theme.js
├─┬ src
│ ├── background.js     - 백그라운드 스크립트
│ ├── cleandc.js        - 콘텐트 스크립트
│ ├── css
│ ├── font
│ ├─┬ functions         - 클린디씨 주요 기능들
│ │ └── index.js        - 기능들을 이곳에 나열
│ └── sw.js
└── utils
```

## 클린디씨 functions

### functions 기능 예시
```js
export default {
  list (head, options) {
    // 글목록 관련 기능
  },
  update (options) { 
    // 기능 새로운 옵션 적용
  },
  // body, head, article ...
}
```

### Lifecycle

`functions`에 파일을 추가하고 `export default` 오브젝트의 속성으로 사용합니다.

 Lifecycle | 시점 | 파라미터
-|-|-
 head | 헤드 나옴 | head Element, options Promise 
 body | 바디 나옴 | body Element, options Promise 
 list | 글 목록 나옴| list Element, options Promise 
 article| 글 내용 나옴| article Element, options Promise 
 attachment | 첨부파일 나옴 | attachment Element, options Promise 
 comments | 댓글 목록 발생(지속) | comments Element, options Promise 
 ready | 도큐먼트 로딩 완료| options Promise 
 update | 옵션 변경 발생| options Object

## License
GPL-3.0
