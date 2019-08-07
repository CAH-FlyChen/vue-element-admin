<template>
  <client-detail :is-edit="true" />
</template>

<script>
import ClientDetail from './components/detail'

export default {
  name: 'EditForm',
  components: { ClientDetail }
}
</script>
