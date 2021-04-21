<template>
  <div class="app-container">
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="40">
        <template slot-scope="scope">
          <span>{{ scope.row.book_id }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="Name">
        <template slot-scope="scope">
          <span>{{ scope.row.book_name }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="Author">
        <template slot-scope="scope">
          <span>{{ scope.row.book_writer }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="Category">
        <template slot-scope="scope">
          <span>{{ scope.row.book_category }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="Type">
        <template slot-scope="scope">
          <span>{{ scope.row.book_type }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="Finish time">
        <template slot-scope="scope">
          <span>{{ scope.row.book_finish_time }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Introduction">
        <template slot-scope="scope">
          <span class="intro" v-html="scope.row.book_introduction" />
        </template>
      </el-table-column>

      <el-table-column align="center" label="Action" width="120">
        <template slot-scope="scope">
          <router-link :to="'/book/edit/' + scope.row.book_id">
            <el-button type="primary" size="small" icon="el-icon-edit">
              Edit
            </el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="pageQuery.page" :limit.sync="pageQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import { fetchBook } from '@/api/book'
import Pagination from '@/components/Pagination'

export default {
  name: 'ArticleList',
  components: { Pagination },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: false,
      pageQuery: {
        page: 1,
        limit: 10
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchBook(this.pageQuery).then(response => {
        this.list = response.data.bookList
        this.total = response.data.total
        this.listLoading = false
      })
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
.intro {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 6;
  -webkit-box-orient: vertical;
}
</style>
