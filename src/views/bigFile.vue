<template>
  <div  class='black-box'>
    <div class="header">
      <input type="file" @change="fileChange">
      <el-button type="primary" @click="handleUpload" :disabled="status !== STATUS.wait || !container.file">上传</el-button>
      <el-button type="info" @click="handleResume" v-if="status == STATUS.pause">继续</el-button>
      <el-button type="danger" @click="handlePause" v-else :disabled="status !== STATUS.uploading">暂停</el-button>
      <el-button type="danger" @click="clearDir" >清空大文件夹</el-button>
    </div>
    <div class="bigfile-list">
      <el-table :data="bigFiles">
        <el-table-column label="文件名" prop="name">
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="{ row }">
            <el-button type="primary" @click="play(row)">播放</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="progress">
      <div>计算hash</div>
      <el-progress :text-inside="true" :stroke-width="20" status="warning" :percentage="hashPercentage"></el-progress>
      <div>总进度</div>
      <el-progress :text-inside="true" :stroke-width="20" :percentage="fakeUploadPercentage"></el-progress>
    </div>
    <div class="chunk-list">
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
            ></el-progress>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="file-display">
      <video v-if="videoUrl" :src="videoUrl" autoplay controls="controls" height="360" width="500"></video>
      <p>路径: <a :href="`http://localhost:3000${videoUrl}`" target="_blank">http://localhost:3000{{videoUrl}}</a></p>
    </div>
  </div>
</template>

<script>
const SIZE = 10 * 1024 * 1024
const STATUS = {
  wait: "wait",  // 等待
  pause: "pause", // 暂停
  uploading: "uploading" // 上传中
}
export default {
  filters: {
    transformByte(val) {
      return Number((val / 1024).toFixed(0));
    }
  },
  pageName: '',
  data () {
    return {
      STATUS,
      container: {
        file: null,
        worker: {},
        hash: ''
      },
      status: STATUS.wait,
      data: [],
      videoUrl: '',
      hashPercentage: 0,
      requestList: [],
      fakeUploadPercentage: 0,
      bigFiles: []
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
  watch: {
    uploadPercentage (n) {
      if(n > this.fakeUploadPercentage){
        this.fakeUploadPercentage = n
      }
    }
  },
  mounted(){
    this.getLocationBigFiles()
  },
  methods: {
    /**
     * 封装请求函数
    */
    request ({url, method = 'post',data, headers = {}, onProgress = e => e, requestList}){
      return new Promise(resolve => {
        let xhr = new XMLHttpRequest()
        xhr.open(method, url)
        xhr.upload.onprogress = onProgress
        for(let key in headers){
          xhr.setRequestHeader(key, headers[key])
        }
        xhr.send(data)
        xhr.onload = e => {
          // 9.2 删除已经请求成功的xhr
          if(requestList && requestList.length){
            let i = requestList.findIndex(t => t === xhr)
            requestList.splice(i, 1)
          }
          resolve(e.target.response)
        }
        // 9.1 把请求放到请求列表
        requestList?.push(xhr)
      })
    },
    // 一. 选择文件
    fileChange (e){
      let [file] = e.target.files
      if(!file) return
      this.init()
      this.container.file = file
    },
    init () {
      this.resetData() // 11.2 重新选择文件, 取消请求, 重置数据
      this.data = [] // 选择文件清空data 来清空进度条
      this.hashPercentage = 0
      this.fakeUploadPercentage = 0
      this.videoUrl = ''
      this.status = STATUS.wait
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
      let { shouldUpload, filePath, uploadedList} = await this.verifyUpload(this.container.file.name, this.container.hash)
      if(!shouldUpload){
        this.$message.success('秒传成功')
        this.fakeUploadPercentage = 100
        return 
      }
      this.data = chunks.map(({file}, index) => {
        let chunkHash = `${this.container.hash}-${index}`
        return {
          index,
          chunk: file,
          size: file.size,
          percentage: uploadedList.includes(chunkHash) ? 100 : 0,   // 10.1 上传过的 进度条变100%
          hash: chunkHash
        }
      })
      await this.uploadChunks(uploadedList)
    },
    // 四. 上传所有切片
    async uploadChunks (uploadedList = []){
      this.status = STATUS.uploading
      //10.2 过滤已经上传过的
      let requestList = this.data
      .filter(({ hash }) => !uploadedList.includes(hash))
      .map(async ({chunk, hash, index}) => {
        let formData = new FormData()
        formData.append('chunk', chunk)
        formData.append('hash', hash)
        formData.append('filename', this.container.file.name)
        formData.append('fileHash', this.container.hash)
        return this.request({
          url: this.$api.chunk,
          data: formData, 
          onProgress: this.createProgressHandler(this.data[index]),
          requestList: this.requestList // 9.2 将requestList传进去 接收xhr
        })
      })
      await Promise.all(requestList)
      // 9.6 之前上传的切片数量 + 本次上传的切片数量 = 所有切片数量时
      if(uploadedList.length + requestList.length === this.data.length){
        await this.mergeChunks()
      }
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
          "content-type": "application/json"
        }, 
        data: JSON.stringify(data)
      })
      let resData = JSON.parse(res)
      if(resData.status == 200){
        this.$message.success('合并成功')
        this.getLocationBigFiles()
        this.status = STATUS.wait
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
    // 九. 暂停
    handlePause () {
      this.resetData()
      this.status = STATUS.pause
    },
    // 十. 继续
    async handleResume () {
      let { uploadedList } = await this.verifyUpload(this.container.file.name, this.container.hash)
      await this.uploadChunks(uploadedList)
    },
    resetData () {
      this.requestList.forEach(xhr => xhr?.abort())
      this.requestList = []
      if(this.container.worker){
        this.container.worker.onmessage = null
      }
    },
    async clearDir(){
      let res = await this.request({
        url: this.$api.clearBigDir,
        headers: {
          "content-type": "application/json"
        }
      })
      let resData = JSON.parse(res)
      if(resData.status == 200){
        this.$message.success('清除成功')
        this.getLocationBigFiles()
      } else {
        this.$message.success('清除失败')
      }
      this.init()
    },
    async getLocationBigFiles () {
      let res = await this.request({
        url: this.$api.getLocationBigFiles,
        headers: {
          "content-type": "application/json"
        }
      })
      let resData = JSON.parse(res)
      if(resData.status == 200){
        this.bigFiles = resData.files
      } else {
        this.$message.success('获取失败')
      }
    },
    play (row) {
      this.videoUrl = row.fileUrl
    }
  }
}
</script>

<style lang='scss' scoped>
@mixin box-style {
  box-shadow: 0px 0px 10px #aaa;
  padding: 24px;
  border-radius: 5px;
  margin: 24px 0;
}
.header{
  @include box-style;
}
.file-display{
  @include box-style;
  display: flex;
  justify-content: center;
  margin-top: 24px;
  flex-direction: column;
  align-items: center;
}
.bigfile-list{
  @include box-style;
}
.progress {
  @include box-style;
}
.chunk-list{
  @include box-style;
}
</style>
