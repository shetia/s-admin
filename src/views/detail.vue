<template>
  <div  class='black-box'>
      <el-form  :model="detail" :rules="rules" ref="ruleForm" >
        <el-form-item label="姓名" prop="name">
          <el-input v-model="detail.name" placeholder="审批人"></el-input>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model="detail.age" placeholder="审批人"></el-input>
        </el-form-item>
        <el-form-item label="照片" prop="fileId">
          <el-upload
            :action="uploadUrl"
            list-type="picture-card"
            :file-list="fileList"
            :on-preview="handlePictureCardPreview"
            :on-success="uploadOk"
            :limit="1"
            :on-exceed="onExceed"
            :before-upload="beforeUpload"
            :on-remove="handleRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>

        <el-form-item>
          <el-button  @click="$router.go(-1)">返回</el-button>
          <el-button type="primary" @click="onSubmit">提交</el-button>
        </el-form-item>
      </el-form>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
export default {
  pageName: '',
  data () {
    return {
      uploadUrl: this.$axios.defaults.baseURL + this.$api.upload,
      detail: {},
      fileList:[],
      rules: {
        name: [
          { required: true, message: '请输入名字', trigger: 'blur' },
        ],
        age: [
          { required: true, message: '请输入年龄', trigger: 'blur' },
          { pattern: /^[0-9]+$/, message: '请输入整数', trigger: 'blur' },
        ],
        fileId:[
          { required: true, message: '请上传图片', trigger: 'blur' }
        ]
      },
      dialogImageUrl: '',
      dialogVisible: false
    }
  },
  mounted () {
    if(!this.Add){
      this.getDetail()
    }
  },
  computed: {
    isAdd () {
      return this.$route.params.type == 'add'
    }
  },
  methods: {
    getDetail () {
      this.$axios.get(this.$api.detail, {
        params: {
          id: this.$route.query.id
        }
      }).then(res => {
        if(res.data.code === '200') {
          let resData = res.data.data
          if(Object.keys(resData).length){
            this.detail = resData
            let base = this.$axios.defaults.baseURL
            this.fileList.push({
              name: resData.fileId,
              url: base + resData.fileUrl
            })
          }
        }
      })
    },
    onSubmit () { 
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          if(this.isAdd){
            this.add()
          } else {
            this.update()
          }
        } else {
          this.$message.error('请完成必填项')
          return false;
        }
      });
    },
    add () {
      this.$axios.get(this.$api.add, {
        params: this.detail
      }).then(res => {
        if(res.data.code === '200') {
          this.$message.success('新增成功')
          this.$router.replace('/')
        } else {
          this.$message.success('新增失败')
        }
      })
    },
    update () {
      this.$axios.post(this.$api.update, this.detail).then(res => {
        if(res.data.code === '200') {
          this.$message.success('修改成功')
          this.$router.replace('/')
        } else {
          this.$message.success('修改失败')
        }
      })
    },
    beforeUpload () {

    },
    onExceed (e) {
      this.$message.error('只能上传一张照片, 请先删除原来的')
    },
    uploadOk (file, fileList) {
      if(file.status === 200){
        try{
          let res = file.data
          this.detail.fileId = res.id
          this.detail.fileUrl = res.path
        } catch {
          this.$message.error('上传失败')
          this.fileList = []
        }
      }else {
        this.$message.error('上传失败')
        this.fileList = []
      }
    },
    handleRemove(file, fileList) {
      this.fileList = []
      this.detail.fileId = ''
      this.detail.fileUrl = ''
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    }
  }
}
</script>

<style lang='scss' scoped>
.el-input{
  width: 200px;
}
</style>
