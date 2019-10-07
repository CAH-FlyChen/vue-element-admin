<template>
  <div class="app-container">
    <titlebar name="title-bar" @onCreateButtonClicked="onCreateButtonClicked" />

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column width="220px" align="center" label="Client Name">
        <template slot-scope="scope">
          <span>{{ scope.row.clientName }}</span>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="Enabled">
        <template slot-scope="scope">
          <span>{{ scope.row.enabled }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="ProtocolType" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.protocolType }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="AccessTokenLifetime" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.accessTokenLifetime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="IdentityTokenLifetime" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.identityTokenLifetime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="RefreshTokenUsage" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.refreshTokenUsage }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column width="180px" align="center" label="Date">
        <template slot-scope="scope">
          <span>{{ scope.row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column> -->

      <el-table-column align="center" label="Description">
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>

      <!-- <el-table-column width="100px" label="Importance">
        <template slot-scope="scope">
          <svg-icon v-for="n in +scope.row.importance" :key="n" icon-class="star" class="meta-item__icon" />
        </template>
      </el-table-column> -->

      <!-- <el-table-column class-name="status-col" label="Status" width="110">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column> -->
      <!--
      <el-table-column min-width="300px" label="Title">
        <template slot-scope="{row}">
          <router-link :to="'/example/edit/'+row.id" class="link-type">
            <span>{{ row.title }}</span>
          </router-link>
        </template>
      </el-table-column> -->

      <el-table-column align="center" label="Actions" width="120">
        <template slot-scope="scope">
          <router-link :to="'/ids/client/edit/'+scope.row.id">
            <el-button type="primary" size="small" icon="el-icon-edit">
              Edit
            </el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog title="创建客户端" :visible.sync="dialogBiomeVisible" width="70%" height="70%">
      <el-row>
        <el-col :span="6">
          <el-card :body-style="{ padding: '0px',height:'250px' }">
            <svg-icon icon-class="kongbai" class-name="icon-size" />
            <div style="padding: 14px;">
              <span>Empty
                空 - 默认</span>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card :body-style="{ padding: '0px' ,height:'250px' }">
            <svg-icon icon-class="web2" class-name="icon-size" @click="onResourceOwnerTypeClicked" />
            <div style="padding: 14px;">
              <span>
                <b>无服务端的Web Spa / JS 应用应用 受信客户端</b>
                密码模式（resource owner password credentials
              </span>
            </div>
          </el-card>
        </el-col>

        <el-col :span="6">
          <el-card :body-style="{ padding: '0px',height:'250px' }">
            <svg-icon icon-class="web2" class-name="icon-size" @click="onImplicitClicked" />
            <div style="padding: 14px;">
              <span>
                <b>无服务端的Web Spa / JS 应用应用 非授信客户端</b>
                简化模式（implicit flow）ID Token和Access Token都是通过<b>浏览器的前端通道</b>传递的。
              </span>
            </div>
          </el-card>
        </el-col>

        <el-col :span="6">
          <el-card :body-style="{ padding: '0px' ,height:'250px' }">
            <svg-icon icon-class="web1" class-name="icon-size" @click="onAuthorizationCodeClicked" />
            <div style="padding: 14px;">
              <span>
                <b>有服务器端的web应用</b>
                Authorization code flow 授权码模式
                用户需要进行手工授权
                <!-- </span>
              <div class="bottom clearfix">
                <el-button type="text" class="button">操作按钮</el-button>
              </div> -->
              </span></div>
          </el-card>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-card :body-style="{ padding: '0px',height:'250px' }">
            <svg-icon icon-class="app" class-name="icon-size" @click="onResourceOwnerTypeClicked" />
            <div style="padding: 14px;">
              <span> <b>原生的移动应用/windows桌面应用 受信客户端</b>
                密码模式（resource owner password credentials）
                适用于当前的APP是专门为服务端设计的情况。
                这种模式下要求客户端不得储存密码。但我们并不能确保客户端是否储存了密码，所以该模式仅适用于受信任的客户端（自己公司研发的客户端）。否则会发生密码泄露的危险
              </span>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card :body-style="{ padding: '0px' ,height:'250px' }">
            <svg-icon icon-class="app" class-name="icon-size" @click="onAuthorizationCodeClicked" />
            <div style="padding: 14px;">
              <span> <b>原生的移动应用/windows桌面应用 非受信客户端</b>
                Authorization code flow 授权码模式
                安卓中可以监控特殊的返回地址
              </span>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card :body-style="{ padding: '0px' ,height:'250px' }">
            <svg-icon icon-class="jiqiren" class-name="icon-size" @click="onClientCredentialsClicked" />
            <div style="padding: 14px;">
              <span> <b>机器对机器的通信</b>
                ClientCredentials
                该模式的适用场景为服务器与服务器之间的通信。
                比如对于一个电子商务网站，将订单和物流系统分拆为两个服务分别部署
              </span>
            </div>
          </el-card>
        </el-col>

      </el-row>
    </el-dialog>
  </div>

</template>

<script>
import { fetchList } from '@/api/identity-client'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import titlebar from '@/components/Form/form-title-bar'
// import { all } from 'q'

export default {
  name: 'ClientList',
  components: { Pagination, titlebar },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        // page: 1,
        // limit: 20
      },
      dialogBiomeVisible: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.items
        this.total = response.total
        this.listLoading = false
      }).catch(error => {
        console.info(error)
      })
    },
    onCreateButtonClicked() {
      this.dialogBiomeVisible = true
    },
    onResourceOwnerTypeClicked() {
      const self = this
      alert('onResourceOwnerTypeClicked')
      debugger
      // 授信客户端，密码模式
      self.$router.push({ path: '/ids/client/create?type=resource_owner' })
    },
    onImplicitClicked() {
      alert('onImplicitClicked')
    },
    onAuthorizationCodeClicked() {
      alert('onAuthorizationCodeClicked')
    },
    onClientCredentialsClicked() {
      alert('onClientCredentialsClicked')
    }
  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
.icon-size{
  width: 10em;
  height: 10em;
  width: 100%;
  color:gainsboro;
}
.icon-size:hover{
  fill:gray;
  cursor:pointer;
}
</style>
