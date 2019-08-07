<template>
  <client-detail :is-edit="false" />
</template>

<script>
import ClientDetail from './components/detail'

export default {
  name: 'CreateForm',
  components: { ClientDetail }
}
</script>
