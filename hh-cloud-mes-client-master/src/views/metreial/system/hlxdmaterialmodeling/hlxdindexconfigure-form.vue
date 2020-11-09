<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="指标编码" prop="indexCode">
      <el-input v-model="dataForm.indexCode" placeholder="指标编码"></el-input>
    </el-form-item>
    <el-form-item label="指标名称" prop="indexName">
      <el-input v-model="dataForm.indexName" placeholder="指标名称"></el-input>
    </el-form-item>
      <el-form-item label="是否启用" prop="isEnable">
        <el-radio-group v-model="dataForm.isEnable">
          <el-radio v-for="(item,index) in sexList" :key="index" :label="item.value">{{item.label}}</el-radio>
        </el-radio-group>
      </el-form-item>
    <el-form-item label="是否必输项" prop="mustLose">
      <el-radio-group v-model="dataForm.mustLose">
        <el-radio v-for="(item,index) in sexList" :key="index" :label="item.value">{{item.label}}</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="排序" prop="sort">
      <el-input v-model="dataForm.sort" placeholder="排序"></el-input>
    </el-form-item>
    <el-form-item label="模块类型" prop="moduleType">
      <el-input v-model="dataForm.moduleType" :disabled="true" placeholder=""></el-input>
    </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
    import {getObj, addObj, putObj} from '@/api/metreial/system/hlxdindexconfigure'

    export default {
    data () {
      return {
        visible: false,
        sexList:[{label:'是',value:1},{label:'否',value:0}],
        dataForm: {
          id: 0,
          indexCode: '',
          indexName: '',
          mustLose: 1,
          sort: 999,
          moduleType: '',
          isEnable :1,
        },
        moduleTypes: '',
        dataRule: {
          isEnable: [
            { required: true, message: '请选择', trigger: 'blur' }
          ],
          indexCode: [
            { required: true, message: '指标编码不能为空', trigger: 'blur' }
          ],
          indexName: [
            { required: true, message: '指标名称不能为空', trigger: 'blur' }
          ],
          mustLose: [
            { required: true, message: '是否必输项不能为空', trigger: 'blur' }
          ],
          sort: [
            { required: true, message: '排序不能为空', trigger: 'blur' }
          ],
          moduleType: [
            { required: true, message: '模块类型不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id,a) {
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          this.$set(this.dataForm, 'moduleType', a);
          if (this.dataForm.id) {
            getObj(this.dataForm.id).then(response => {
                this.dataForm = response.data.data
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            if (this.dataForm.id) {
                putObj(this.dataForm).then(data => {
                    this.$message.success('修改成功')
                    this.visible = false
                    this.$emit('refreshDataList')
                });
            } else {
                addObj(this.dataForm).then(data => {
                    this.$message.success('添加成功')
                    this.visible = false
                    this.$emit('refreshDataList')
                })
            }
          }
        })
      }
    }
  }
</script>
