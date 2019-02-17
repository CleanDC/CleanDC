<template>
  <div class="side">
    <mu-list style="flex-grow: 0.4;">
      <mu-list-item button to="/style">
        <mu-list-item-action>
          <mu-icon value=":fas fa-palette" />
        </mu-list-item-action>
        <mu-list-item-title>스타일</mu-list-item-title>
      </mu-list-item>
      <mu-list-item button to="/userblock">
        <mu-list-item-action>
          <mu-icon value=":fas fa-user-lock" />
        </mu-list-item-action>
        <mu-list-item-title>유저 차단</mu-list-item-title>
      </mu-list-item>
      <mu-list-item button to="/wordblock">
        <mu-list-item-action>
          <mu-icon value=":fas fa-filter" />
        </mu-list-item-action>
        <mu-list-item-title>키워드 차단</mu-list-item-title>
      </mu-list-item>
      <mu-list-item button to="/etc">
        <mu-list-item-action>
          <mu-icon value=":fas fa-cog" />
        </mu-list-item-action>
        <mu-list-item-title>기타 설정</mu-list-item-title>
      </mu-list-item>
    </mu-list>
    <mu-divider />
    <mu-list>
      <mu-list-item button :href="store" target="_blank">
        <mu-list-item-title>웹 스토어</mu-list-item-title>
        <mu-list-item-action>
          <img src="../assets/market.svg" width="20">
        </mu-list-item-action>
      </mu-list-item>
      <mu-list-item button :href="issue" target="_blank">
        <mu-list-item-title>문제 제보</mu-list-item-title>
        <mu-list-item-action>
          <mu-icon value="info" />
        </mu-list-item-action>
      </mu-list-item>
    </mu-list>
  </div>
</template>
<script>
import packageJson from '../../package.json'
export default {
  name: 'SideNav',
  computed: {
    store () { return `https://chrome.google.com/webstore/detail/${chrome.runtime.id}` },
    issue () { return packageJson.bugs.url }
  }
}
</script>
<style scoped>
.side {border-right: 1px solid rgba(0,0,0,.12); font-weight: bolder;display: flex;flex-direction: column;}
.side i{font-size: 20px;}
</style>
