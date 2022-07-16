<template>
  <BkgShadow>
    <DialogBkg>
      <div
        class="diaglog-header"
        font="medium"
        leading="loose"
        text="lg"
      >
        <slot name="header" />
      </div>
      <div
        class="diaglog-body"
        flex="auto"
        text="sm"
      >
        <slot name="body" />
      </div>
      <div
        class="diaglog-footer"
        font="medium"
        leading="loose"
      >
        <slot name="footer" />
      </div>
    </DialogBkg>
  </BkgShadow>
</template>
