<template>
  <div  class='black-box'>
    <div>
      <input type="file" @change="fileChange">
      <el-button type="primary" @click="handleUpload">上传</el-button>
    </div>
    <div>
      <div>计算hash</div>
      <el-progress :percentage="hashPercentage"></el-progress>
      <div>总进度</div>
      <el-progress :percentage="uploadPercentage"></el-progress>
    </div>
    <!-- 切片进度条 -->
    <el-table :data="data">
      <el-table-column
        prop="hash"
        label="切片hash"
        align="center"
      ></el-table-column>
      <el-table-column label="大小(KB)" align="center" width="120">
        <template v-slot="{ row }">
          {{ row.size | transformByte }}
        </template>
      </el-table-column>
      <el-table-column label="进度" align="center">
        <template v-slot="{ row }">
          <el-progress
            :percentage="row.percentage"
            color="#909399"
          ></el-progress>
        </template>
      </el-table-column>
    </el-table>
    <video :src="videoUrl" controls="controls" height="360" width="500"></video>
  </div>
</template>

<script>
const SIZE = 10 * 1024 * 1024
export default {
  filters: {
    transformByte(val) {
      return Number((val / 1024).toFixed(0));
    }
  },
  pageName: '',
  data () {
    return {
      container: {
        file: null,
        worker: null
      },
      data: [],
      videoUrl: '',
      hashPercentage: 0
    }
  },  
  computed: {
    uploadPercentage(){
      if (!this.container.file || !this.data.length) return 0
      let loaded = this.data.map(item => {
        return item.size * item.percentage
      }).reduce((a, b) => {
        return a + b
      })
      let total = this.container.file.size
      return parseInt(loaded / total)
    }
  },
  mounted () {

  },
  methods: {
    /**
     * 封装请求函数
    */
    request ({url, method = 'post',data, headers = {}, onProgress = e => e}){
      return new Promise(resolve => {
        let xhr = new XMLHttpRequest()
        xhr.open(method, url)
        xhr.upload.onprogress = onProgress
        for(let key in headers){
          xhr.setRequestHeader(key, headers[key])
        }
        xhr.send(data)
        xhr.onload = e => {
          resolve(e.target.response)
        }
      })
    },
    // 一. 选择文件
    fileChange (e){
      let [file] = e.target.files
      if(!file) return
      this.container.file = file
    },
    // 二. 拿到文件, 把文件分成切片
    createChunk (file, size = SIZE) {
      let chunks = []
      let i = 0
      while(i < file.size){
        chunks.push({file: file.slice(i, i + size)})
        i += size
      }
      return chunks
    },
    // 三, 点击上传, 生成切片, 然后上传所有切片
    async handleUpload () {
      if(!this.container.file) return
      let chunks = this.createChunk(this.container.file)
      this.container.hash = await this.calculateHash(chunks)
      // 先查询文件是否上传过
      let { shouldUpload } = await this.verifyUpload(this.container.file.name, this.container.hash)
      console.log(shouldUpload)
      if(!shouldUpload){
        this.$message.success('秒传成功')
        return 
      }
      this.data = chunks.map(({file}, index) => {
        let chunkHash = `${this.container.hash}-${index}`
        return {
          index,
          chunk: file,
          size: file.size,
          percentage: 0,  
          hash: chunkHash
        }
      })
      await this.uploadChunks()
    },
    // 四. 上传所有切片
    async uploadChunks (){
      let requestList = this.data.map(async ({chunk, hash, index}) => {
        let formData = new FormData()
        formData.append('chunk', chunk)
        formData.append('hash', hash)
        formData.append('filename', this.container.file.name)
        formData.append('fileHash', this.container.hash)
        return this.request({
          url: this.$api.chunk,
          data: formData, 
          onProgress: this.createProgressHandler(this.data[index])
        })
      })
      await Promise.all(requestList)
      await this.mergeChunks()
      console.log(this.data)
    },
    // 五. 合并切片
    async mergeChunks () {
      let data = {
        fileHash: this.container.hash,
        size: SIZE,
        filename: this.container.file.name
      }
      let res = await this.request({
        url: this.$api.merge,
        headers: {
          'content-type': 'application/json'
        },
        data: JSON.stringify(data)
      })
      let resData = JSON.parse(res)
      if(resData.status == 200){
        this.$message.success('合并成功')
        this.videoUrl = resData.filePath
      }
    },
    // 六. 创建每个切片的进度条
    createProgressHandler (item) {
      return function (e) {
        item.percentage = parseInt((e.loaded / e.total) * 100)
      }
    },
    // 七. 生成文件hash
    calculateHash(fileChunkList){
      return new Promise(resolve=>{
        this.container.worker = new Worker('/hash.js')
        this.container.worker.postMessage({fileChunkList})
        this.container.worker.onmessage = e => {
          let { percentage, hash } = e.data
          this.hashPercentage = percentage
          if(hash) resolve(hash)
        }
      })
    },
    // 八. 校验文件是否已上传过   
    async verifyUpload(filename, fileHash){
      let res = await this.request({
        url: this.$api.verify,
        headers: {
          "content-type": "application/json"
        },
        data: JSON.stringify({
          filename,
          fileHash
        })
      })
      return JSON.parse(res)
    },
  }
}
</script>

<style lang='scss' scoped>

</style>
