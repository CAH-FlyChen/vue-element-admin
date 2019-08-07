<template>
  <persisted-grant-detail :is-edit="true" />
</template>

<script>
import PersistedGrantDetail from './components/detail'

export default {
  name: 'EditForm',
  components: { PersistedGrantDetail }
}
</script>
