<template>
  <transition v-if="message" name="toastMessage" appear @after-enter="$emit('update:message','')">
    <div class="toastMessage">{{ message }}</div>
  </transition>
</template>

<script>
export default { props: ['message'] }
</script>
<style lang="scss" scoped>
.toastMessage {
  color: #fff;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 2px 2px 0 0;
  bottom: 0;
  padding: 8px 10px;
  background-color: #0000008c;
  &-enter,&-leave-to{
    opacity: 0;
    transform:  translate3d(-50%,100%,0);
  }
  &-enter-to,&-leave {
    opacity: 1;
    transform: translate3d(-50%,0%,0);
  }
  &-enter-active,&-leave-active{ transition: all .1s linear; }
  &-leave-active{ transition-delay: 400ms; }
}
</style>
