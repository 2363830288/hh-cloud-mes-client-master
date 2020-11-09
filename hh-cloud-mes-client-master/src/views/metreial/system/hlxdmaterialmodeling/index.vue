<template>
  <div class="ConsumableMain">
    <div class="left">
      <div class="title">数据索引</div>
      <div class="dep">
      </div>
      <div class="dep">
          <el-input
            placeholder="输入关键字进行过滤"
            v-model="filterText">
          </el-input>
      <div id= "left">
        <el-button v-if="permissions.system_hlxdmaterialmodeling_add"  type="primary" @click="addOrUpdateHandle1()">新增修改</el-button>
      </div>
      </div>
      <!-- 部门 -->
      <div class="dep">
          <el-tree :data="treeList"
                   ref="tree"
                   v-loading="loading"
                   :props="defaultProps"
                   :filter-node-method="filterNode"
                   @node-click="handleNodeClick"
                   >
          </el-tree>
        <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
          <el-button
            type="text"
            size="mini"
            @click="() => remove(node, data)">
            删除
          </el-button>
        </span>
      </span>

      </div>
    </div>


    <!-- 右边 -->
    <div class="right">

      <div class="rightBTN">
        <div class="left">
          &#8195; {{names}}
        </div>
        <el-form
          :inline="true"
          :model="dataForm"
          @keyup.enter.native="getDataList()"
        >
          <el-form-item>
            <el-button v-if="permissions.system_hlxdindexconfigure_add" icon="el-icon-plus" type="primary" @click="addOrUpdateHandle()">新增</el-button>

          </el-form-item>
        </el-form>
      </div>
      <div class="mod-config table">
        <basic-container>
          <div class="avue-crud">
            <el-table
              :data="dataList"
              border
              v-loading="dataListLoading">
              <el-table-column
                prop="deptName"
                header-align="center"
                align="center"
                label="部门">
              </el-table-column>
              <el-table-column
                prop="indexCode"
                header-align="center"
                align="center"
                label="指标编码">
              </el-table-column>
              <el-table-column
                prop="indexName"
                header-align="center"
                align="center"
                label="指标名称">
              </el-table-column>
              <el-table-column
                prop="isEnable"
                header-align="center"
                align="center"
                label="是否启用">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.isEnable" type="1">是</el-tag>
                  <el-tag v-else type="danger">否</el-tag>
                </template>
              </el-table-column>
              <el-table-column
                prop="mustLose"
                header-align="center"
                align="center"
                label="是否必输项">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.mustLose" type="1">是</el-tag>
                  <el-tag v-else type="danger">否</el-tag>
                </template>
              </el-table-column>
              <el-table-column
                prop="sort"
                header-align="center"
                align="center"
                label="排序">
              </el-table-column>
              <!--<el-table-column
                prop="moduleType"
                header-align="center"
                align="center"
                label="模块类型">
              </el-table-column>-->
              <el-table-column
                header-align="center"
                align="center"
                label="操作">
                <template slot-scope="scope">
                  <el-button v-if="permissions.system_hlxdindexconfigure_edit" type="text" size="small" icon="el-icon-edit" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
                  <el-button v-if="permissions.system_hlxdindexconfigure_del" type="text" size="small" icon="el-icon-delete" @click="deleteHandle(scope.row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <div class="avue-crud__pagination">
            <el-pagination
              @size-change="sizeChangeHandle"
              @current-change="currentChangeHandle"
              :current-page="pageIndex"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="pageSize"
              :total="totalPage"
              background
              layout="total, sizes, prev, pager, next, jumper"
            >
            </el-pagination>
          </div>
          <!-- 弹窗, 新增 / 修改 -->
          <table-form
            v-if="addOrUpdateVisible"
            ref="addOrUpdate"
            @refreshDataList="getDataList"
          ></table-form>
          <!--新增编辑模块分类-->
          <modeling
            v-if="addOrUpdateVisible1"
            ref="addOrUpdate"
            @refreshDataList="getPageList"
          ></modeling>
        </basic-container>
      </div>
    </div>
  </div>
</template>
<script>
import {tree} from '@/api/metreial/system/hlxdmaterialmodeling'
import {fetchList, delObj} from '@/api/metreial/system/hlxdindexconfigure'
import TableForm from './hlxdindexconfigure-form'
import {mapGetters} from 'vuex'
import Modeling from "@/views/metreial/system/hlxdmaterialmodeling/hlxdmaterialmodeling-form";
export default {
  data () {
    return {
      dataForm: {
        key: ''
      },
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      dataList: [],
      filterText:'',
      treeList:[],
      treeId:"",
      moduleTypes:"1",
      names:"",
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      addOrUpdateVisible: false,
      addOrUpdateVisible1: false,
      loading: false,
    }
  },
  components: {
    Modeling,
    TableForm
  },
  created () {
    this.getDataList();
    this.getPageList();
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  methods: {

    //树点击获取列表
    handleNodeClick(val){

      this.dataForm.moduleType = val.id
      this.names = val.name+"配置";
      let  params  = this.dataForm;
      this.dataListLoading = true;
      fetchList(Object.assign({
        current: this.pageIndex,
        size: this.pageSize
      },Object.assign(params))).then(response => {
        this.dataList = response.data.data.records;
        this.totalPage = response.data.data.total;
      })
      this.dataListLoading = false;
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    //获取模块列表
    getPageList(){
      this.loading1 = true
      tree().then((res) => {
        this.treeList = res.data.data
        this.loading1 = false
      })
    },
    // 查询事件
    seachEvent(){
      this.dataListLoading = true;
      let  params  = this.dataForm;

      this.dataListLoading = false
    },
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      let  params  = this.dataForm;
      fetchList(Object.assign({
        current: this.pageIndex,
        size: this.pageSize
      },Object.assign(params))).then(response => {
        this.dataList = response.data.data.records
        this.totalPage = response.data.data.total
      })
      this.dataListLoading = false
    },
    // 每页数
    sizeChangeHandle (val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.pageIndex = val
      this.getDataList()
    },
    // 新增 / 修改
    addOrUpdateHandle (id) {
      if(this.dataForm.moduleType != ''&&this.dataForm.moduleType != null){
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id,this.dataForm.moduleType)
      })
      }else{
        this.$message.error('请选择模块')
      }
    },
    addOrUpdateHandle1 (id) {
        this.addOrUpdateVisible1 = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(this.dataForm.moduleType)
        })

    },
    // 删除
    deleteHandle (id) {
      this.$confirm('是否确认删除ID为' + id, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function () {
        return delObj(id)
      }).then(data => {
        this.getDataList()
        this.$message.success('删除成功')
        this.dataListLoading = false;
      })
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
}
</script>
<style lang="scss">
.ConsumableMain {
  .left {
    .el-input__inner {
      width: 180px;
    }
  }
  .right {
    .el-card__body {
      padding: 0;
    }
    .el-dialog {
      max-width: 553px;
    }
    .rightBTN {
      .el-form-item--mini.el-form-item,
      .el-form-item--small.el-form-item {
        margin-bottom: 0;
      }
    }
  }
}
</style>
<style lang="scss">
.ConsumableMain {
  .left {
    .el-input__inner {
      width: 210px;
    }
  }
  .right {
    .el-card__body {
      padding: 0;
    }
    .el-dialog {
      max-width: 553px;
    }
    .rightBTN {
      .el-form-item--mini.el-form-item,
      .el-form-item--small.el-form-item {
        margin-bottom: 0;
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.ConsumableMain {
  height: calc(99% - 10px);
  width: 100%;
  font-size: 13px;
  // background-color: rgba(154, 230, 15, 0.2);

  padding: 0 10px 10px 10px;
  display: flex;
  .left {
    min-width: 220px;
    flex: 1;
    background-color: #fff;
    // background-color: rgba(154, 230, 15, 0.2);
    .title {
      padding-left: 10px;
      height: 45px;
      line-height: 45px;
      width: 100%;
      font-weight: bold;
      border-bottom: 1px solid #d9d9d9;
    }
    .dep {
      line-height: 30px;
      margin-top: 10px;
      display: flex;
      div:nth-child(1) {
        flex: 1.1;
        text-align: right;
      }
      div:nth-child(2) {
        margin: 0 20px 0 6px;
        flex: 2.9;
      }
    }
    .PHname {
      //   height: 545px;
      .table {
        padding-left: 5px;
        height: 455px;
        overflow-y: auto;
        margin: 0 6px;
        flex: 3;
        background-color: #f0f2f5;
        border: 1px solid #d9d9d9;
        span {
          display: block;
          height: 30px;
          line-height: 30px;
          // background-color: rgba(154, 230, 15, 0.5);
        }
        span:hover {
          // background-color: #b2e6ff;
          background-color: rgba(176, 230, 255, 0.5);
        }
        .active {
          font-weight: 550;
          background-color: rgba(176, 230, 255, 1);
        }
      }
    }
    .btn {
      margin-top: 20px;
      padding: 0 20px;
      width: 100%;

      .el-button {
        width: 100%;
      }
    }
  }
  .right {
    background-color: #f0f2f5;
    background-color: #fff;
    margin-left: 10px;
    flex: 5;
    .rightBTN {
      // background-color: #fff;
      width: 100%;
      height: 30px;
      border-bottom: 1px solid #d9d9d9;
      height: 45px;
      display: flex;
      justify-content: flex-end;
      margin-bottom: 10px;
      align-items: center;
      .el-form-item {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }

    // .BTNBOM {
    //     width: calc(100%-20px);
    //     // background-color: rgba(154, 230, 15, 0.4);

    //     margin: 0 10px;
    //     border-bottom: 1px solid #d9d9d9;
    //     font-size: 13px;
    //     span {
    //       font-weight: 700;
    //     }
    //     // .btnContent {
    //     // }
    //   }
  }
}
</style>

