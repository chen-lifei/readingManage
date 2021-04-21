<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">

      <sticky :z-index="10" :class-name="'sub-navbar ' + status">
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">
          Publish
        </el-button>
      </sticky>

      <div class="createPost-main-container">
        <el-row>
          <el-col :span="8">
            <el-form-item label-width="120px" label="Book name:" class="postInfo-container-item">
              <el-input v-model="postForm.book_name" placeholder="Enter book name" />
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label-width="120px" label="Book author:" class="postInfo-container-item">
              <el-input v-model="postForm.book_writer" placeholder="Enter book author" />
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label-width="120px" label="Book country:" class="postInfo-container-item">
              <el-select v-model="postForm.book_country" placeholder="Select book country">
                <el-option v-for="(item, index) in country" :key="index" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label-width="120px" label="Book category:" class="postInfo-container-item">
              <el-select v-model="postForm.book_category" placeholder="Select book category" @change="handleCategry">
                <el-option v-for="(item, index) in category" :key="index" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col v-show="postForm.book_category === 'masterpiece' || postForm.book_category === 'story'" :span="8">
            <el-form-item label-width="120px" label="Book type:" class="postInfo-container-item">
              <el-select v-if="postForm.book_category === 'masterpiece'" v-model="postForm.book_type" placeholder="Select book type">
                <el-option v-for="(item, index) in masterpiece" :key="index" :label="item.label" :value="item.value" />
              </el-select>
              <el-select v-else v-model="postForm.book_type" placeholder="Select book type">
                <el-option v-for="(item, index) in story" :key="index" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label-width="120px" label="Book publisher:" class="postInfo-container-item">
              <el-input v-model="postForm.book_publisher" placeholder="Enter book publisher" />
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label-width="120px" label="Finish time:" class="postInfo-container-item">
              <el-date-picker v-model="postForm.book_finish_time" type="date" format="yyyy-MM-dd" placeholder="Select date" />
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label-width="120px" label="Publish time:" class="postInfo-container-item">
              <el-date-picker v-model="postForm.book_publish_time" type="date" format="yyyy-MM-dd" placeholder="Select date" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-form-item label-width="120px" label="Upload cover:" class="postInfo-container-item">
            <el-upload
              action="http://localhost:8888/book/upload/cover"
              :on-success="recieveCover"
            >
              <el-button slot="trigger" size="small" type="primary">上传封面</el-button>
              <span slot="tip" class="el-upload__tip" style="padding-left: 10px">只能上传jpg/png文件，且不超过500kb</span>
            </el-upload>
          </el-form-item>
        </el-row>

        <el-row>
          <el-form-item label-width="120px" label="Book introduction:" class="postInfo-container-item">
            <el-input v-model="postForm.book_introduction" type="textarea" :autosize="{ minRows: 10 }" />
          </el-form-item>
        </el-row>
      </div>
    </el-form>
  </div>
</template>

<script>
import Sticky from '@/components/Sticky' // 粘性header组件
import { createBook } from '@/api/book'
import { updateBook } from '@/api/book'
import { getCurrentBook } from '@/api/book'
import { countryOption, categoryOption, masterpieceOption, storyOption } from '@/utils/bookOption'

const defaultForm = {
  book_id: '',
  book_name: '',
  book_writer: '',
  book_introduction: '',
  book_cover: '',
  book_country: '',
  book_category: '',
  book_type: '',
  book_publisher: '',
  book_finish_time: '',
  book_publish_time: ''
}

export default {
  name: 'ArticleDetail',
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
      rules: {
        book_name: [{ validator: validateRequire }],
        book_writer: [{ validator: validateRequire }],
        book_introduction: [{ validator: validateRequire }]
      },
      country: countryOption,
      category: categoryOption,
      masterpiece: masterpieceOption,
      story: storyOption,
      status: 'draft'
    }
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.fetchBook(id)
    }
  },
  methods: {
    submitForm() {
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          if (this.isEdit) {
            this.updateInfo()
          } else {
            this.createInfo()
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleCategry() {
      this.postForm.book_type = ''
    },
    recieveCover(response, file, fileList) {
      this.postForm.book_cover = response
    },
    createInfo() {
      createBook(this.postForm).then(res => {
        if (res.code === 20000) {
          this.$notify({
            title: '成功',
            message: '添加书本信息成功',
            type: 'success',
            duration: 2000
          })
          this.status = 'published'
          this.loading = false
        }
      })
    },
    updateInfo() {
      updateBook(this.postForm).then(res => {
        if (res.code === 20000) {
          this.$notify({
            title: '成功',
            message: '修改书本信息成功',
            type: 'success',
            duration: 2000
          })
          this.status = 'published'
          this.loading = false
        }
      })
    },
    fetchBook(id) {
      getCurrentBook(id).then(res => {
        this.postForm = res.data[0]
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.createPost-container {
  position: relative;

  .createPost-main-container {
    padding: 20px 45px 20px 50px;

    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;

      .postInfo-container-item {
        float: left;
      }
    }
  }

  .word-counter {
    width: 40px;
    position: absolute;
    right: 10px;
    top: 0px;
  }
}

.article-textarea ::v-deep {
  textarea {
    padding-right: 40px;
    resize: none;
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }
}
</style>
