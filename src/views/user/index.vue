<template>
  <div class="user-container">
    <el-table v-loading="loading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.user_id }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Name">
        <template slot-scope="scope">
          <span>{{ scope.row.user_name }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Email">
        <template slot-scope="scope">
          <span>{{ scope.row.user_email }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Phone">
        <template slot-scope="scope">
          <span>{{ scope.row.user_phone }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Region">
        <template slot-scope="scope">
          <span>{{ scope.row.user_region }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Prefer">
        <template slot-scope="scope">
          <el-tag v-for="(item, index) in scope.row.user_prefer" :key="index" type="success" style="margin-right: 10px">
            {{ item }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Action">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="editInfo(scope.row)">
            <i class="el-icon-edit" />
            <span>Edit</span>
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination v-show="total>0" :total="total" :page.sync="pageQuery.page" :limit.sync="pageQuery.limit" @pagination="getList" />

    <el-dialog title="修改用户信息" :visible.sync="userFormVisible">
      <el-form :model="userForm">
        <el-form-item label="用户名" label-width="120px">
          <el-input v-model="userForm.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="手机号码" label-width="120px">
          <el-input v-model="userForm.phone" autocomplete="off" />
        </el-form-item>
        <el-form-item label="用户邮箱" label-width="120px">
          <el-input v-model="userForm.email" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="userFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateInfo">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { allUser } from '@/api/user'
import { updateInfo } from '@/api/user'
import Pagination from '@/components/Pagination'

export default {
  components: {
    Pagination
  },
  data() {
    return {
      loading: false,
      list: [],
      total: 0,
      pageQuery: {
        limit: 10,
        page: 1
      },
      userFormVisible: false,
      userForm: {
        token: '',
        name: '',
        email: '',
        phone: ''
      }
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      allUser(this.pageQuery).then(res => {
        this.list = res.data.userList
        this.total = res.data.total
        this.list.forEach(item => {
          if (item.user_prefer) {
            item.user_prefer = item.user_prefer.split('-')
          }
        })
        this.loading = false
      })
    },
    editInfo(info) {
      this.userFormVisible = true
      this.userForm.token = info.user_id
      this.userForm.name = info.user_name
      this.userForm.phone = info.user_phone
      this.userForm.email = info.user_email
    },
    updateInfo() {
      this.userFormVisible = false
      updateInfo(this.userForm).then(res => {
        if (res.code === 20000) {
          this.$notify({
            title: '成功',
            message: '修改用户信息成功',
            type: 'success',
            duration: 2000
          })
          this.getList()
        }
      })
    }
  }
}
</script>

<style lang="css" scoped>
</style>
