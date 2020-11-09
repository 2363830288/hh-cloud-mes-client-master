<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="模块编码" prop="name">
        <el-input v-model="dataForm.code" placeholder="模块编码"></el-input>
      </el-form-item>
    <el-form-item label="模块名称" prop="name">
      <el-input v-model="dataForm.name" placeholder="模块名称"></el-input>
    </el-form-item>
    <el-form-item label="父级主键" prop="parentId">
      <!--<el-input v-model="dataForm.parentId" placeholder="父级主键"></el-input>-->
      <treeselect v-model="dataForm.parentId"
                  :options="PHvalueOptions"
                  :normalizer="normalizer"
                  :show-count="true"
                   placeholder="请选择分类"/>
    </el-form-item>
    <el-form-item label="排序" prop="sort">
      <el-input v-model="dataForm.sort" placeholder="排序"></el-input>
    </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
    import {getObj, addObj, putObj} from '@/api/metreial/system/hlxdmaterialmodeling'
    import {tree} from '@/api/metreial/system/hlxdmaterialmodeling'
    import Treeselect from "@riophae/vue-treeselect"
    import "@riophae/vue-treeselect/dist/vue-treeselect.css"
    export default {
      name:"Modeling",
      components: {Treeselect},
    data () {
      return {
        visible: false,
        PHvalueOptions:[],
        dataForm: {
          id: 0,
          name: '',
          code:'',
          parentId: '-1',
          sort: '',
        },
        dataRule: {
          name: [
            { required: true, message: '模块名称不能为空', trigger: 'blur' }
          ],
          code: [
            { required: true, message: '模块编码不能为空', trigger: 'blur' }
          ],
          parentId: [
            { required: true, message: '父级主键不能为空', trigger: 'blur' }
          ],
          sort: [
            { required: true, message: '排序不能为空', trigger: 'blur' }
          ],

        }
      }
    },
    created () {
      this.getTreeModule();
    },
    methods: {
      //模块加载
      getTreeModule(){
        tree().then((res) =>{
          this.PHvalueOptions = res.data.data
        })
      },
      normalizer(node) {
        if (node.children && !node.children.length) {
          delete node.children;
        }
        return {
          id: node.id,
          label: node.name,
          children: node.children
        };
      },
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
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
