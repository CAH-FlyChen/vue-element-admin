/* eslint-disable vue/valid-v-for */

<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">
      <sticky :z-index="10" :class-name="'sub-navbar '+postForm.status">
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">
          Publish
        </el-button>
        <el-button v-loading="loading" type="warning" @click="draftForm">
          Draft
        </el-button>
      </sticky>
      <div class="createPost-main-container">
        <el-row>
          <Warning />
          <el-col :span="24">
            <div class="postInfo-container">

              <el-form-item class="postInfo-container-item" label="Key">
                <label slot="label">
                  Key <el-tooltip effect="dark" content="x" placement="top">
                    <i class="el-icon-info" />
                  </el-tooltip>
                </label>
                <el-input v-model="postForm.key" placeholder="" />
              </el-form-item>

              <el-form-item class="postInfo-container-item" label="Type">
                <label slot="label">
                  Type <el-tooltip effect="dark" content="x" placement="top">
                    <i class="el-icon-info" />
                  </el-tooltip>
                </label>
                <el-input v-model="postForm.type" placeholder="" />
              </el-form-item>

              <el-form-item class="postInfo-container-item" label="SubjectId">
                <label slot="label">
                  SubjectId <el-tooltip effect="dark" content="x" placement="top">
                    <i class="el-icon-info" />
                  </el-tooltip>
                </label>
                <el-input v-model="postForm.subjectId" placeholder="" />
              </el-form-item>

              <el-form-item class="postInfo-container-item" label="ClientId">
                <label slot="label">
                  ClientId <el-tooltip effect="dark" content="x" placement="top">
                    <i class="el-icon-info" />
                  </el-tooltip>
                </label>
                <el-input v-model="postForm.clientId" placeholder="" />
              </el-form-item>

              <el-form-item class="postInfo-container-item" label="CreationTime">
                <label slot="label">
                  CreationTime <el-tooltip effect="dark" content="x" placement="top">
                    <i class="el-icon-info" />
                  </el-tooltip>
                </label>
                <el-input v-model="postForm.creationTime" placeholder="" />
              </el-form-item>

              <el-form-item class="postInfo-container-item" label="Expiration">
                <label slot="label">
                  Expiration <el-tooltip effect="dark" content="x" placement="top">
                    <i class="el-icon-info" />
                  </el-tooltip>
                </label>
                <el-input v-model="postForm.expiration" placeholder="" />
              </el-form-item>

              <el-form-item class="postInfo-container-item" label="Expiration">
                <label slot="label">
                  Data <el-tooltip effect="dark" content="x" placement="top">
                    <i class="el-icon-info" />
                  </el-tooltip>
                </label>
                <el-input v-model="postForm.data" placeholder="" />
              </el-form-item>

            </div>
          </el-col>
        </el-row>
      </div>
    </el-form>
  </div>
</template>

<script>
import Sticky from '@/components/Sticky' // 粘性header组件
// import { validURL } from '@/utils/validate'
import { fetchClient } from '@/api/persisted-grant'
// import { searchUser } from '@/api/remote-search'
// import Warning from './Warning'

const defaultForm = {
  status: 'draft',
  title: '', // 文章题目
  content: '', // 文章内容
  content_short: '', // 文章摘要
  source_uri: '', // 文章外链
  image_uri: '', // 文章图片
  display_time: undefined, // 前台展示时间
  id: undefined,
  platforms: ['a-platform'],
  comment_disabled: false,
  importance: 0,
  clientName: '测试',
  enabled: true,
  description: '描述内容'
}

export default {
  name: 'PersistedGrant',
  // components: { Tinymce, MDinput, Upload, Sticky, Warning, CommentDropdown, PlatformDropdown, SourceUrlDropdown },
  components: { Sticky },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        this.$message({
          message: rule.field + '为必传项',
          type: 'error'
        })
        callback(new Error(rule.field + '为必传项'))
      } else {
        callback()
      }
    }
    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      userListOptions: [],
      rules: {
        image_uri: [{ validator: validateRequire }],
        title: [{ validator: validateRequire }],
        content: [{ validator: validateRequire }]
        // source_uri: [{ validator: validateSourceUri, trigger: 'blur' }]
      },
      tempRoute: {}
    }
  },
  computed: {
    contentShortLength() {
      return this.postForm.content_short.length
    },
    lang() {
      return this.$store.getters.language
    },
    displayTime: {
      // set and get is useful when the data
      // returned by the back end api is different from the front end
      // back end return => "2013-06-25 06:59:25"
      // front end need timestamp => 1372114765000
      get() {
        return (+new Date(this.postForm.display_time))
      },
      set(val) {
        this.postForm.display_time = new Date(val)
      }
    }
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    } else {
      this.postForm = Object.assign({}, defaultForm)
    }

    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/PanJiaChen/vue-element-admin/issues/1221
    this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {
    fetchData(id) {
      fetchClient(id).then(response => {
        this.postForm = response
        debugger
        // just for test
        // this.postForm.title += `   Article Id:${this.postForm.id}`
        // this.postForm.content_short += `   Article Id:${this.postForm.id}`

        // set tagsview title
        // this.setTagsViewTitle()

        // set page title
        // this.setPageTitle()
      }).catch(err => {
        console.log(err)
      })
    },
    setTagsViewTitle() {
      const title = this.lang === 'zh' ? '编辑文章' : 'Edit Article'
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.postForm.id}` })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    setPageTitle() {
      const title = 'Edit Article'
      document.title = `${title} - ${this.postForm.id}`
    },
    submitForm() {
      console.log(this.postForm)
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$notify({
            title: '成功',
            message: '发布文章成功',
            type: 'success',
            duration: 2000
          })
          this.postForm.status = 'published'
          this.loading = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    draftForm() {
      if (this.postForm.content.length === 0 || this.postForm.title.length === 0) {
        this.$message({
          message: '请填写必要的标题和内容',
          type: 'warning'
        })
        return
      }
      this.$message({
        message: '保存成功',
        type: 'success',
        showClose: true,
        duration: 1000
      })
      this.postForm.status = 'draft'
    },
    getRemoteUserList(query) {
      // searchUser(query).then(response => {
      //   if (!response.data.items) return
      //   this.userListOptions = response.data.items.map(v => v.name)
      // })
    }
  }
}
</script>
<style>
@import "~@/styles/gloable.scss";
.el-alert__content{
  width:100%
}
</style>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
@import "~@/styles/main.scss";
.article-textarea /deep/ {
  textarea {
    padding-right: 40px;
    resize: none;
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }
}

</style>
