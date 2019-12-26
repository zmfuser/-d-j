<template>
  <div class="organization-view-wrapper">
    <div class="header-wrap">
      <div class="title">组织架构</div>
      <div class="org-opts-wrap" v-show="!isNormalEmp">
        <Button
          class="btn-item"
          :disabled="globalEditMode"
          @click="openCreateOrgMode"
          v-show="!(isNormalEmp || isZBManager)"
        >
          <div class="plus-icon"></div>添加部门
        </Button>
        <Button class="btn-item" :disabled="globalEditMode" @click="openCreateMemberMode">
          <div class="plus-icon"></div>添加人员
        </Button>
        <Button
          class="btn-item"
          :disabled="globalEditMode"
          @click="openPersonMove"
          v-if="isJTManager || isSysManager"
        >
          <div class="move-icon"></div>人员移动
        </Button>
        <Button
          class="btn-item"
          :disabled="globalEditMode"
          @click="openOrgDrag"
          v-if="isJTManager || isSysManager"
        >
          <div class="sort-icon"></div>组织排序
        </Button>
        <template v-if="!isNormalEmp && !isZBManager">
          <template v-if="!globalEditMode">
            <Button class="btn-item" @click="openOrgEditMode">
              <div class="edit-icon"></div>修改组织
            </Button>
          </template>
          <template v-else>
            <Button class="btn-item" @click="saveOrgData">
              <div class="complete-icon"></div>完成
            </Button>
          </template>
        </template>
      </div>
    </div>
    <div class="org-view-container">
      <div class="root-node-wrap">
        <div class="node-info">
          <div
            class="title jt-title"
            :title="orgDataCpd.orgname"
            :class="orgDataCpd.editMode?'whiteBg':''"
            @click="orgRename(orgDataCpd)"
          >{{ orgDataCpd.orgname }}</div>
          <div class="node-members">
            <span class="common-link" @click="viewJTmemberFlag=true">查看机关人员名单</span>
            <span class="common-link" @click="myWorkPlan" v-if="isJTManager || isSysManager">部门工作计划</span>
          </div>
          <div class="node-icon" @click="lowerHideShow(orgDataCpd)">
            <img src="../../images/zz_icon_jian_24.png" alt v-show="orgDataCpd.isShow" />
            <img src="../../images/zz_icon_jia_24.png" alt v-show="!orgDataCpd.isShow" />
          </div>
        </div>
      </div>
      <div class="children-node-wrap" v-show="orgDataCpd.isShow">
        <div class="border-container">
          <div
            class="node-item-wrap margin-b-50"
            v-for="(secNode, sec) of orgDataCpd.orgList"
            :key="sec"
          >
            <div
              class="node-info margin-r-26"
              :class="sec == 0?'level-first-node':'level-middle-node'"
            >
              <div
                class="title"
                :title="secNode.orgname"
                :class="secNode.editMode?'whiteBg':''"
                @click="orgRename(secNode)"
              >
                <span>{{ secNode.orgname }}</span>
              </div>
              <div class="delete-node" v-if="secNode.editMode" @click="deleteNode(secNode)"></div>
              <div class="node-icon" @click="lowerHideShow(secNode)">
                <img src="../../images/zz_icon_jian_24.png" alt v-show="secNode.isShow" />
                <img src="../../images/zz_icon_jia_24.png" alt v-show="!secNode.isShow" />
              </div>
            </div>
            <div class="border-container" v-show="secNode.isShow">
              <div
                class="node-item-wrap width-686"
                v-for="(thiNode, thi) of secNode.orgList"
                :key="thi"
              >
                <div class="node-info" :class="thi == 0?'level-first-node':'level-middle-node'">
                  <div
                    class="title"
                    :title="thiNode.orgname"
                    :class="(thiNode.editMode) ?'whiteBg':''"
                    @click="orgRename(thiNode)"
                  >
                    <span>{{ thiNode.orgname }}</span>
                  </div>
                  <div
                    class="delete-node"
                    v-if="thiNode.editMode && !isZBManager && thiNode.orgname != secNode.orgList[0].orgname"
                    @click="deleteNode(thiNode)"
                  ></div>
                  <div class="node-icon" @click="lowerHideShow(thiNode)">
                    <img src="../../images/zz_icon_jian_24.png" alt v-show="thiNode.isShow" />
                    <img src="../../images/zz_icon_jia_24.png" alt v-show="!thiNode.isShow" />
                  </div>
                  <div class="node-members">
                    <template
                      v-if="!isNormalEmp && (getLoginUserInfo.oid == (thiNode.orgname == secNode.orgList[0].orgname ? thiNode.upperid : thiNode.id))"
                    >
                      <span class="common-link" @click="myWorkPlan">部门工作计划</span>
                    </template>
                    <!-- <template v-else-if="(!isNormalEmp && (getLoginUserInfo.orgDept.upperid == thiNode.upperid || getLoginUserInfo.orgDept.orgcode+2 == thiNode.orgcode) && !isZBManager) || isSysManager"> -->
                    <template
                      v-else-if="(!isNormalEmp && (getLoginUserInfo.oid == thiNode.upperid || getLoginUserInfo.orgDept.orgcode+2 == thiNode.orgcode)&& !isZBManager) || isSysManager || isJTManager"
                    >
                      <span class="common-link" @click="watchWorkPlan(thiNode)">查看工作计划</span>
                    </template>
                  </div>
                </div>
                <template v-if="thiNode.empList.length && thiNode.isShow">
                  <div class="all-member-content">
                    <div class="member-inner">
                      <CheckboxGroup v-model="thiNode.deleteMemberList">
                        <div
                          class="member-wrap"
                          :class="thiNode.editMemberMode?'edit-mode':''"
                          v-for="(m, i) of thiNode.empList"
                          :key="i"
                        >
                          <Checkbox :label="m.id" v-if="thiNode.editMemberMode"></Checkbox>
                          <span class="member">{{ m.name }}</span>
                        </div>
                      </CheckboxGroup>
                    </div>
                  </div>
                  <div
                    class="member-edit-wrap"
                    v-if="((!isNormalEmp && getLoginUserInfo.oid.includes(thiNode.id) || getLoginUserInfo.oid.includes(thiNode.upperid))  || isSysManager || isJTManager )"
                  >
                    <template v-if="!thiNode.editMemberMode">
                      <div
                        class="member-edit-btn"
                        :class="globalEditMode?'disabled':''"
                        @click="openMemberEditMode(thiNode)"
                      >
                        <div class="icon edit-icon"></div>
                        <div class="label">编辑</div>
                      </div>
                      <div
                        class="member-edit-btn"
                        :class="globalEditMode?'disabled':''"
                        @click="openMemberDelMode(thiNode)"
                      >
                        <div class="icon delete-icon"></div>
                        <div class="label">删除</div>
                      </div>
                    </template>
                    <template v-else>
                      <div class="member-edit-btn" @click="thiNode.editMemberMode=false">
                        <div class="icon complete-icon"></div>
                        <div class="label">取消</div>
                      </div>
                      <div class="member-edit-btn" @click="confirmDelMemberList(thiNode)">
                        <div class="icon delete-icon"></div>
                        <div class="label">删除</div>
                      </div>
                    </template>
                  </div>
                </template>
                <template v-else-if="thiNode.isShow">
                  <div class="all-member-content">
                    <div class="no-data-tips">
                      <span>暂无人员信息</span>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Modal
      v-model="editMemberFlag"
      title="编辑人员"
      :width="720"
      class="member-edit-modal"
      :mask-closable="false"
    >
      <div class="modal-content-back">
        <Form
          ref="editMemberForm"
          :model="editMemberForm"
          :rules="memberValidateRules"
          label-position="left"
          :label-width="160"
        >
          <Row>
            <Col span="24">
              <FormItem label="选择组织人名">
                <div class="member-list-wrap">
                  <div
                    class="member-item"
                    :class="(item.isChecked || item.isEdited)?'active':''"
                    v-for="(item, i) of editMemberForm.empList"
                    :key="i"
                    @click="memberEditCheck(item, i)"
                  >
                    <span>{{ item.name }}</span>
                  </div>
                </div>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="24">
              <FormItem label="输入修改后名字" prop="newName">
                <div class="edit-input-wrap">
                  <Input
                    v-model="editMemberForm.newName"
                    :maxlength="5"
                    @on-blur="saveMemberEditor('name')"
                  ></Input>
                </div>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="24">
              <FormItem label="输入修改后电话号码" prop="newPhone">
                <div class="edit-input-wrap">
                  <Input v-model="editMemberForm.newAccount" @on-blur="saveMemberEditor('account')"></Input>
                </div>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="24">
              <div class="edited-member-list-wrap">
                <template v-for="(item, i) of editMemberForm.addMemberList">
                  <div class="edited-member" :key="i" @click="reEditToForm(item)">
                    <span class="member-name">{{ item.name }}</span>
                    <div class="del-icon" @click="removeAddMember3(i, item.mapIndex)">
                      <Icon type="md-close" />
                    </div>
                  </div>
                </template>
              </div>
            </Col>
          </Row>
        </Form>
      </div>
      <div class="member-edit-footer" slot="footer">
        <div class="btn bgc-red" @click="confirmEditInfo">
          <span>确认</span>
        </div>
        <div class="btn" @click="closeModal('editMemberForm')">
          <span>取消</span>
        </div>
      </div>
    </Modal>
    <Modal
      v-model="createOrgModalFlag"
      title="添加部门"
      :width="720"
      class="create-org-modal"
      :mask-closable="false"
    >
      <div class="modal-content-back">
        <Form
          ref="createOrgForm"
          :model="createOrgForm"
          :rules="orgValidateRules"
          label-position="left"
          :label-width="140"
        >
          <div class="top">
            <Row>
              <Col span="24">
                <FormItem label="选择上级组织" prop="parentOrg">
                  <div class="input-wrap">
                    <Select v-model="createOrgForm.parentOrg">
                      <Option
                        v-for="(item, i) of parentOrgList"
                        :value="item.id"
                        :key="i"
                      >{{ item.orgname }}</Option>
                    </Select>
                  </div>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="24">
                <FormItem label="输入部门名称" prop="orgname">
                  <div class="input-wrap">
                    <Input v-model="createOrgForm.orgname"></Input>
                  </div>
                </FormItem>
              </Col>
            </Row>
          </div>
          <!-- <div class="bottom">
                        <Row>
                            <Col span="24">
                                <FormItem label="输入组织人名" :rules="memberValidateSwitch?memberNameRules:{}" prop="empname">
                                    <div class="input-wrap">
                                        <Input v-model="createOrgForm.empname" :maxlength="4" @on-blur="addMember('name')" @on-focus="openRule"></Input>
                                    </div>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span="24">
                                <FormItem label="输入电话号码" :rules="memberValidateSwitch?memberAccountRules:{}" prop="empAccount">
                                    <div class="input-wrap">
                                        <Input v-model="createOrgForm.empAccount" @on-blur="addMember('account')" @on-focus="openRule"></Input>
                                    </div>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span="24">
                                <div class="add-member-wrap">
                                    <template v-for="(item, i) of createOrgForm.empList">
                                        <div class="add-member-item" :key="i" @click="reEditToOrgForm(item, i)">
                                            <span>{{ item.name }}</span>
                                            <div class="del-icon" @click="removeAddMember(i)">
                                                <Icon type="md-close" />
                                            </div>
                                        </div>
                                    </template>
                                </div>
                            </Col>
                        </Row>
          </div>-->
        </Form>
      </div>
      <div class="create-org-footer" slot="footer">
        <div class="btn bgc-red" @click="validateForm">
          <span>确认</span>
        </div>
        <div class="btn" @click="closeModal('createOrgForm')">
          <span>取消</span>
        </div>
      </div>
    </Modal>
    <Modal
      v-model="createMemberModalFlag"
      title="添加人员"
      :width="720"
      class="create-member-modal"
      :mask-closable="false"
      :transfer="true"
    >
      <div class="modal-content-back">
        <Form
          ref="createMemberForm"
          :model="createMemberForm"
          :rules="orgValidateRules"
          label-position="left"
          :label-width="140"
        >
          <div class="top">
            <Row>
              <Col span="24">
                <FormItem label="选择组织" prop="parentOrg">
                  <div class="input-wrap">
                    <Select
                      v-model="createMemberForm.parentOrg"
                      label-in-value
                      @on-change="parentOrgChange"
                    >
                      <Option
                        v-for="(item, i) of parentOrgList2"
                        :value="item.id"
                        :key="i"
                      >{{ item.orgname }}</Option>
                    </Select>
                  </div>
                </FormItem>
              </Col>
            </Row>
          </div>
          <div class="bottom">
            <Row>
              <Col span="24">
                <FormItem label="输入组织人名" prop="empname">
                  <div class="input-wrap">
                    <Input
                      v-model="createMemberForm.empname"
                      :maxlength="4"
                      @on-blur="addMember2('name')"
                    ></Input>
                  </div>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="24">
                <FormItem label="输入电话号码" prop="empAccount">
                  <div class="input-wrap">
                    <Input v-model="createMemberForm.empAccount" @on-blur="addMember2('account')"></Input>
                  </div>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="24">
                <div class="add-member-wrap">
                  <template v-for="(item, i) of createMemberForm.empList">
                    <div class="add-member-item" :key="i" @click="reEditToMemberForm(item, i)">
                      <span>{{ item.name }}</span>
                      <div class="del-icon" @click="removeAddMember2(i)">
                        <Icon type="md-close" />
                      </div>
                    </div>
                  </template>
                </div>
              </Col>
            </Row>
          </div>
        </Form>
      </div>
      <div class="create-org-footer" slot="footer">
        <div class="btn bgc-red" @click="validateForm2">
          <span>确认</span>
        </div>
        <div class="btn" @click="closeModal('createMemberForm')">
          <span>取消</span>
        </div>
      </div>
    </Modal>
    <Modal v-model="viewJTmemberFlag" :width="720" class="view-member-modal" :mask-closable="false">
      <div class="modal-heander" slot="header">
        <div class="title">查看机关人员</div>
        <div class="opt-wrap" v-show="isJTManager || isSysManager">
          <template v-if="!jtMemberEditFlag">
            <div class="opt-item" @click="openEditJTMemberModal">
              <div class="icon edit-icon"></div>
              <div class="label">编辑</div>
            </div>
            <div class="opt-item" @click="jtMemberEditFlag=true">
              <div class="icon edit-icon"></div>
              <div class="label">删除</div>
            </div>
          </template>
          <template v-else>
            <div class="opt-item" @click="deleteJTMember">
              <div class="icon delete-icon"></div>
              <div class="label">删除</div>
            </div>
            <div class="opt-item" @click="jtMemberEditFlag=false">
              <div class="icon complete-icon"></div>
              <div class="label">取消</div>
            </div>
          </template>
        </div>
      </div>
      <div class="modal-content-back">
        <div class="jt-member-list-wrap">
          <CheckboxGroup v-model="orgData.deleteMemberList">
            <div
              class="member-wrap"
              :class="jtMemberEditFlag?'edit-mode':''"
              v-for="(m, i) of orgData.empList"
              :key="i"
            >
              <Checkbox :label="m.id" v-if="jtMemberEditFlag"></Checkbox>
              <span class="member">{{ m.name }}</span>
            </div>
          </CheckboxGroup>
        </div>
      </div>
      <div class="modal-footer" slot="footer"></div>
    </Modal>
    <Modal
      v-model="editJTMemberFlag"
      title="编辑机关人员"
      :width="720"
      class="member-edit-modal"
      :mask-closable="false"
    >
      <div class="modal-content-back">
        <Form
          ref="editJTMemberForm"
          :model="editJTMemberForm"
          :rules="memberValidateRules"
          label-position="left"
          :label-width="160"
        >
          <Row>
            <Col span="24">
              <FormItem label="选择组织人名">
                <div class="member-list-wrap">
                  <div
                    class="member-item"
                    :class="(item.isChecked || item.isEdited)?'active':''"
                    v-for="(item, i) of orgData.empList"
                    :key="i"
                    @click="jtMemberEditCheck(item, i)"
                  >
                    <span>{{ item.name }}</span>
                  </div>
                </div>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="24">
              <FormItem label="输入修改后名字" prop="newName">
                <div class="edit-input-wrap">
                  <Input
                    v-model="editJTMemberForm.newName"
                    :maxlength="5"
                    @on-blur="saveMemberEditor2('name')"
                  ></Input>
                </div>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="24">
              <FormItem label="输入修改后电话号码" prop="newPhone">
                <div class="edit-input-wrap">
                  <Input
                    v-model="editJTMemberForm.newAccount"
                    @on-blur="saveMemberEditor2('account')"
                  ></Input>
                </div>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="24">
              <div class="edited-member-list-wrap">
                <template v-for="(item, i) of editJTMemberForm.addMemberList">
                  <div class="edited-member" :key="i" @click="reEditToForm2(item)">
                    <span class="member-name">{{ item.name }}</span>
                    <div class="del-icon" @click="removeAddMember4(i, item.mapIndex)">
                      <Icon type="md-close" />
                    </div>
                  </div>
                </template>
              </div>
            </Col>
          </Row>
        </Form>
      </div>
      <div class="member-edit-footer" slot="footer">
        <div class="btn bgc-red" @click="confirmEditInfo2">
          <span>确认</span>
        </div>
        <div class="btn" @click="closeModal('editJTMemberForm')">
          <span>取消</span>
        </div>
      </div>
    </Modal>
    <Modal
      v-model="orgRenameModal"
      title="修改部门名称"
      :width="720"
      class="org-rename-modal"
      @on-ok="orgRenameSubmit"
    >
      <div class="modal-content-back">
        <Form
          ref="orgRenameForm"
          :model="orgRenameForm"
          :rules="orgValidateRules"
          label-position="left"
          :label-width="160"
        >
          <Row>
            <Col span="24">
              <FormItem label="输入修改后名字" prop="orgname">
                <div class="edit-input-wrap">
                  <Input v-model="orgRenameForm.orgname"></Input>
                </div>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
    </Modal>

    <org-sort :org-sort-show="orgSortShow" @closeOrgSort="closeOrgSort" @refresh="refreshOrgData"></org-sort>
    <Spin size="large" fix v-if="spinShow"></Spin>

    <person-move
      :person-move-show="personMoveShow"
      @closePersonMove="closePersonMove"
      @refresh="refreshOrgData"
    ></person-move>
  </div>
</template>

<script>
import util from "@/tools/util";
import { mapGetters, mapActions } from "vuex";
import OrgSort from "./components/orgSort";
import PersonMove from "./components/personMove";
export default {
  components: {
    OrgSort,
    PersonMove
  },
  data() {
    const validateAccount = (rule, value, callback) => {
      if (value) {
        // if(!value){
        //     return callback(new Error('请输入正确电话号码'));
        // }
        this.getEmpInfo({ account: value }).then(res => {
          console.log("getEmpInfo", res);
          if (res.success && !util.isEmptyObject(res.data)) {
            return callback(
              new Error(
                "电话号码已存在" +
                  res.data.orgname +
                  "-" +
                  (res.data.roleType == "0"
                    ? "普遍用户"
                    : res.data.roleType == "1"
                    ? "集团管理员"
                    : res.data.roleType == "2"
                    ? "党委管理员"
                    : res.data.roleType == "3"
                    ? "支部管理员"
                    : res.data.roleType == "4"
                    ? "系统管理员"
                    : "")
              )
            );
          } else {
            callback();
          }
        });
      } else {
        callback();
      }
    };
    const validateEmpName = (rule, value, callback) => {
      if (value) {
        callback();
      } else {
        return callback(new Error("人员姓名为空"));
      }
    };
    return {
      personMoveShow: false,
      orgSortShow: false,
      orgData: {},
      globalEditMode: false,
      deleteMemberList: [],
      editMemberFlag: false,
      editJTMemberFlag: false,
      editMemberForm: {
        orgname: "",
        newName: "",
        newAccount: "",
        empList: [],
        addMemberList: []
      },
      editJTMemberForm: {
        orgname: "",
        newName: "",
        newAccount: "",
        empList: [],
        addMemberList: []
      },
      memberValidateSwitch: false,
      memberNameRules: {
        validator: validateEmpName,
        trigger: "input"
      },
      memberAccountRules: {
        validator: validateAccount,
        trigger: "input"
      },
      memberValidateRules: {
        newName: [{ required: true, message: "请输入正确人名" }],
        empname: [{ validator: validateEmpName, trigger: "blur" }],
        newPhone: [
          { required: true, validator: validateAccount, trigger: "blur" }
        ]
      },
      orgValidateRules: {
        parentOrg: [
          {
            required: true,
            type: "number",
            message: "请选择上级组织",
            trigger: "blur"
          }
        ],
        orgname: [
          { required: true, message: "请输入部门名称", trigger: "blur" }
        ],
        empAccount: [{ validator: validateAccount, trigger: "blur" }]
      },
      createOrgModalFlag: false,
      createOrgForm: {
        parentOrg: "",
        orgname: "",
        empname: "",
        empAccount: "",
        empList: []
      },
      createMemberModalFlag: false,
      createMemberForm: {
        parentOrg: "",
        orgname: "",
        empname: "",
        empAccount: "",
        empList: []
      },
      orgRenameForm: {
        orgname: ""
      },
      spinShow: false,
      viewJTmemberFlag: false,
      jtMemberEditFlag: false,
      orgRenameModal: false,
      parentOrgList:[],
      parentOrgList2:[],
    };
  },
  computed: {
    orgDataCpd() {
      let ret = {};
      if (this.orgData.hasOwnProperty("orgList")) {
        ret = this.appendEditNode(this.orgData);
      }
      console.log("orgDataCpd", ret);
      return ret;
    },
    // parentOrgList() {
    //   let ret = [];
    //   if (this.orgData.orgList && this.orgData.orgList.length) {
    //     let { roleType, orgname, orgid, oName } = this.getLoginUserInfo;
    //     let upperid = this.getLoginUserInfo.orgDept.upperid;
    //     if (this.isJTManager || this.isSysManager) {
    //       ret.push({
    //         id: this.orgData.id,
    //         orgcode: "1",
    //         orgname: this.orgData.orgname
    //       });
    //       for (let item of this.orgData.orgList) {
    //         let kuangName = item.orgname;
    //         let kuangCode = item.orgcode;
    //         let kuangId = item.id;

    //         for (let org of item.orgList) {
    //           if (org.orgcode == "2") {
    //             ret.push({
    //               id: kuangId,
    //               orgcode: "3",
    //               orgname: `${kuangName + "-"}${org.orgname}`
    //             });
    //           }
    //         }
    //       }
    //     } else if (this.isDWManager) {
    //       console.log(this.getLoginUserInfo.oid);
    //       ret.push({
    //         id: this.getLoginUserInfo.oid,
    //         orgcode: "3",
    //         orgname: oName
    //       });
    //       console.log(ret);
    //     }
    //   }
    //   return ret;
    // },
    // parentOrgList2() {
    //   let ret = [];
    //   if (this.orgData.orgList && this.orgData.orgList.length) {
    //     let { roleType, orgname, orgid, oid, oName } = this.getLoginUserInfo;
    //     if (this.isJTManager || this.isSysManager) {
    //       ret.push({
    //         id: this.orgData.id,
    //         orgcode: "0",
    //         orgname: this.orgData.orgname
    //       });
    //       for (let item of this.orgData.orgList) {
    //         let kuangName = item.orgname;
    //         let kuangId = item.id;
    //         let dwName = "";
    //         for (let org of item.orgList) {
    //           if (org.orgcode == "2") {
    //             dwName = org.orgname;
    //             ret.push({
    //               id: org.id,
    //               orgcode: org.orgcode,
    //               orgname: `${kuangName + "-"}${org.orgname}`
    //             });
    //           } else {
    //             ret.push({
    //               id: org.id,
    //               orgcode: org.orgcode,
    //               orgname: `${kuangName + "-"}${dwName + "-"}${org.orgname}`
    //             });
    //           }
    //         }
    //       }
    //     } else if (this.isDWManager) {
    //       let orgcode = "2";
    //       console.log(this.orgData.orgList);
    //       for (let childOrg of this.orgData.orgList) {
    //         console.log(childOrg);
    //         if (childOrg.orgList.length && childOrg.id == oid) {
    //           let arr = util.deepClone(childOrg.orgList);
    //           ret = arr.map(item => {
    //             return {
    //               id: item.id,
    //               orgcode: item.orgcode,
    //               orgname: item.orgname
    //             };
    //           });
    //           break;
    //         }
    //       }
    //       console.log(ret);
    //     } else if (this.isZBManager) {
    //       let orgcode = "3";
    //       ret.push({
    //         id: oid,
    //         orgcode,
    //         orgname: oName
    //       });
    //     }
    //   }

    //   return ret;
    // },
    isNormalEmp() {
      let { roleType } = this.getLoginUserInfo;
      if (roleType == "0") {
        return true;
      } else {
        return false;
      }
    },
    isJTManager() {
      let { roleType } = this.getLoginUserInfo;
      if (roleType == "1") {
        return true;
      } else {
        return false;
      }
    },
    isDWManager() {
      let { roleType } = this.getLoginUserInfo;
      if (roleType == "2") {
        return true;
      } else {
        return false;
      }
    },
    isZBManager() {
      let { roleType } = this.getLoginUserInfo;
      if (roleType == "3") {
        return true;
      } else {
        return false;
      }
    },
    isSysManager() {
      let { roleType } = this.getLoginUserInfo;
      if (roleType == "4") {
        return true;
      } else {
        return false;
      }
    },
    ...mapGetters(["getLoginUserInfo"])
  },
  created() {
    this.getSeleteList(1);
    this.getSeleteList(2);
  },
  mounted() {
    console.log("getLoginUserInfo", this.getLoginUserInfo);
    this.refreshOrgData();
  },
  methods: {
    getSeleteList(valid) {
      let obj = {
        type: valid
      };
      if (valid == 1) {
        this.getOrganizationList(obj).then(res => {
          if (res.success) {
            this.parentOrgList=res.data
          }
          console.log(res);
        });
      } else if (valid==2) {
         this.getOrganizationList(obj).then(res => {
           if (res.success) {
            this.parentOrgList2=res.data
          }
          console.log(res);
        });
      }
    },
    lowerHideShow(node) {
      console.log(node);
      if (node.isShow) {
        node.isShow = false;
      } else {
        node.isShow = true;
      }
    },
    openPersonMove() {
      this.personMoveShow = true;
    },
    closePersonMove() {
      console.log("test");
      this.personMoveShow = false;
    },
    openOrgDrag() {
      this.orgSortShow = true;
    },
    closeOrgSort() {
      console.log("close");
      this.orgSortShow = false;
    },
    appendEditNode(data) {
      if (data.orgList.length) {
        this.$set(data, "editMode", false);
        this.$set(data, "deleteMemberList", []);
        for (const item of data.orgList) {
          if (item.orgList.length) {
            this.$set(item, "editMode", false);
            for (const item2 of item.orgList) {
              this.$set(item2, "editMode", false);
              this.$set(item2, "editMemberMode", false);
              this.$set(item2, "deleteMemberList", []);
            }
          }
        }
      }
      console.log("all", data);
      return data;
    },
    deleteNode(node) {
      let _this = this;
      this.$Modal.confirm({
        title: "提示",
        content: "是否确认删除该部门？",
        okText: "是",
        cancelText: "否",
        loading: true,
        onOk() {
          let { id, orgcode, orgname, upperid } = node;
          let params = {
            empStatus: 0,
            employees: [],
            orgStatus: 2,
            orgDepts: [
              {
                id,
                orgcode,
                orgname,
                upperid
              }
            ]
          };
          _this.organizationOptions(params).then(res => {
            if (res.success) {
              _this.$Modal.remove();
              _this.$Message.success("删除成功！");
              // node.editMemberMode = false;
              _this.refreshOrgData();
              _this.globalEditMode = false;
            }
          });
        }
      });
    },
    openMemberDelMode(node) {
      if (this.globalEditMode) {
        return;
      }
      node.deleteMemberList = [];
      node.editMemberMode = true;
    },
    confirmDelMemberList(node) {
      let _this = this;
      let employees = util.deepClone(node.deleteMemberList).map(item => {
        return { id: item };
      });
      if (!employees.length) {
        this.$Modal.warning({
          title: "提示信息",
          content: "请至少勾选一人！"
        });
        return;
      }
      this.$Modal.confirm({
        title: "提示信息",
        content: "是否确认删除已选人员？",
        okText: "是",
        cancelText: "否",
        loading: true,
        onOk() {
          let params = {
            empStatus: 2,
            employees,
            orgStatus: 0,
            orgDepts: []
          };
          _this.organizationOptions(params).then(res => {
            if (res.success) {
              this.$Modal.remove();
              this.$Message.success("删除成功！");
              node.editMemberMode = false;
              _this.refreshOrgData();
            }
          });
        },
        onCancel() {
          node.editMemberMode = false;
        }
      });
    },
    openMemberEditMode(node) {
      if (this.globalEditMode) {
        return;
      }
      if (node.empList.length) {
        for (const member of node.empList) {
          this.$set(member, "orgname", node.orgname);
          this.$set(member, "newName", member.name);
          this.$set(member, "newAccount", member.account);
          this.$set(member, "isChecked", false);
          this.$set(member, "isEdited", false);
        }
        this.$set(node, "addMemberList", []);
      }
      this.editMemberForm = node;
      this.editMemberFlag = true;
    },
    memberEditCheck(member, index = 0) {
      for (const item of this.editMemberForm.empList) {
        item.isChecked = false;
      }
      member.isChecked = true;
      let { id, orgid, orgname, name, account } = member;
      this.editMemberForm.memberId = id;
      this.editMemberForm.memberOrgid = orgid;
      this.editMemberForm.newName = name;
      this.editMemberForm.newAccount = account;
      this.editMemberForm.memberOrgname = orgname;
      this.editMemberForm.mapIndex = index;
    },
    jtMemberEditCheck(member, index = 0) {
      for (const item of this.editJTMemberForm.empList) {
        item.isChecked = false;
      }
      member.isChecked = true;
      let { id, orgid, orgname, name, account } = member;
      this.editJTMemberForm.memberId = id;
      this.editJTMemberForm.memberOrgid = orgid;
      this.editJTMemberForm.newName = name;
      this.editJTMemberForm.newAccount = account;
      this.editJTMemberForm.memberOrgname = orgname;
      this.editJTMemberForm.mapIndex = index;
    },
    confirmEditInfo() {
      if (
        this.editMemberForm.newAccount != "" ||
        this.editMemberForm.newName != ""
      ) {
        return;
      }
      if (this.editMemberForm.addMemberList.length) {
        this.$Spin.show();
        let params = {
          orgStatus: 0,
          orgDepts: [],
          empStatus: 1,
          employees: this.editMemberForm.addMemberList
        };
        this.organizationOptions(params).then(res => {
          if (res.success) {
            this.$Spin.hide();
            this.closeModal("editMemberForm");
            this.$Message.success("编辑成功！");
            this.refreshOrgData();
          }
        });
      }
    },
    confirmEditInfo2() {
      if (
        this.editJTMemberForm.newAccount != "" ||
        this.editJTMemberForm.newName != ""
      ) {
        return;
      }
      if (this.editJTMemberForm.addMemberList.length) {
        this.$Spin.show();
        let params = {
          orgStatus: 0,
          orgDepts: [],
          empStatus: 1,
          employees: this.editJTMemberForm.addMemberList
        };
        this.organizationOptions(params).then(res => {
          if (res.success) {
            this.$Spin.hide();
            this.closeModal("editJTMemberForm");
            this.$Message.success("编辑成功！");
            this.refreshOrgData();
          }
        });
      }
    },
    openCreateOrgMode() {
      this.createOrgModalFlag = true;
    },
    openCreateMemberMode() {
      this.createMemberModalFlag = true;
    },
    validateForm() {
      if (
        // parentOrg
        this.createOrgForm.empAccount != "" ||
        this.createOrgForm.empname != ""
      ) {
        return;
      }
      this.memberValidateSwitch = false;
      this.$nextTick(() => {
        this.$refs.createOrgForm.validate(valid => {
          if (valid) {
            this.$Spin.show();
            let { parentOrg, orgname } = this.createOrgForm;
            let orgcode = "";
            let employees = [];
            orgcode = this.parentOrgList.filter(item => item.id == parentOrg)[0]
              .orgcode;
            if (this.createMemberForm.empList.length) {
              employees = this.createOrgForm.empList.map(item => {
                item.orgname = orgname;
                item.orgid = parentOrg;
                return item;
              });
            }
            let params = {
              orgStatus: 0,
              orgDepts: [
                {
                  upperid: parentOrg,
                  orgname,
                  orgcode
                }
              ],
              empStatus: 0,
              employees
            };
            if (this.createOrgForm.empList.length) {
              params.employees = this.createOrgForm.empList;
            }
            this.organizationOptions(params).then(res => {
              if (res.success) {
                this.$Spin.hide();
                this.closeModal("createOrgForm");
                this.$Message.success("添加成功！");
                this.refreshOrgData();
              } else {
                this.$Spin.hide();
                this.$Modal.error({
                  title: "提示信息",
                  content: res.message
                });
              }
              this.memberValidateSwitch = true;
            });
          }
        });
      });
    },
    validateForm2() {
      if (
        this.createMemberForm.empAccount != "" ||
        this.createMemberForm.empname != ""
      ) {
        return;
      }
      if (!this.createMemberForm.empList.length) {
        this.$Modal.error({
          title: "提示信息",
          content: "当前暂未添加人员，无法保存！"
        });
        return;
      }
      this.$refs.createMemberForm.validate(valid => {
        if (valid) {
          this.$Spin.show();
          let { parentOrg, orgname } = this.createMemberForm;
          let employees = [];
          if (this.createMemberForm.empList.length) {
            employees = this.createMemberForm.empList.map(item => {
              item.orgname = orgname;
              item.orgid = parentOrg;
              return item;
            });
          }
          let params = {
            orgStatus: 0,
            orgDepts: [],
            empStatus: 0,
            employees
          };
          this.organizationOptions(params).then(res => {
            if (res.success) {
              this.$Spin.hide();
              this.closeModal("createMemberForm");
              this.$Message.success("添加成功！");
              this.refreshOrgData();
            } else {
              this.$Spin.hide();
              this.$Modal.error({
                title: "提示信息",
                content: res.message
              });
            }
          });
        }
      });
    },
    closeModal(ref) {
      if (ref == "editMemberForm") {
        this.$refs.editMemberForm.resetFields();
        this.editMemberForm.newName = "";
        this.editMemberForm.newAccount = "";
        this.editMemberFlag = false;
        console.log("reseted editMemberForm: ", this.editMemberForm);
      } else if (ref == "editJTMemberForm") {
        this.$refs.editJTMemberForm.resetFields();
        this.editJTMemberForm.newName = "";
        this.editJTMemberForm.newAccount = "";
        this.editJTMemberFlag = false;
      } else if (ref == "createOrgForm") {
        this.$refs.createOrgForm.resetFields();
        this.createOrgForm = util.initializationObject(this.createOrgForm);
        this.createOrgModalFlag = false;
        console.log("reseted createOrgForm: ", this.createOrgForm);
      } else if (ref == "createMemberForm") {
        this.$refs.createMemberForm.resetFields();
        this.createMemberForm = util.initializationObject(
          this.createMemberForm
        );
        this.createMemberModalFlag = false;
        console.log("reseted createMemberForm: ", this.createMemberForm);
      } else if (ref == "editMemberForm") {
        this.$refs.editMemberForm.resetFields();
        this.editMemberForm = util.initializationObject(this.editMemberForm);
        this.editMemberFlag = false;
        console.log("reseted editMemberForm: ", this.createMemberForm);
      }
    },
    addMember(triggerTarget) {
      let { orgname, empname, empAccount } = this.createOrgForm;
      if (empname == "" && empAccount == "") {
        return;
      }
      this.$refs.createOrgForm.validateField("empAccount", valid => {
        if (valid == "") {
          if (empname && empAccount) {
            this.$refs.createOrgForm.validateField("empname");
            if (typeof this.createOrgForm.editIndex != "undefined") {
              this.createOrgForm.empList[this.createOrgForm.editIndex] = {
                name: empname,
                account: empAccount,
                orgname
              };
            } else {
              this.createOrgForm.empList.push({
                name: empname,
                account: empAccount,
                orgname
              });
            }

            this.createOrgForm.empname = "";
            this.createOrgForm.empAccount = "";
            if (typeof this.createOrgForm.editIndex != "undefined") {
              if (triggerTarget == "name") {
                this.$Message.success("修改姓名成功！");
              } else {
                this.$Message.success("修改电话成功！");
              }
              delete this.createOrgForm.editIndex;
            }
          } else {
            this.$refs.createOrgForm.validateField("empname");
          }
        }
      });
    },
    addMember2(triggerTarget) {
      let { orgname, empname, empAccount } = this.createMemberForm;
      if (empname == "" && empAccount == "") {
        return;
      }
      this.$refs.createMemberForm.validateField("empAccount", valid => {
        if (valid == "") {
          if (empname && empAccount) {
            this.$refs.createMemberForm.validateField("empname");
            if (typeof this.createMemberForm.editIndex != "undefined") {
              this.createMemberForm.empList[this.createMemberForm.editIndex] = {
                name: empname,
                account: empAccount,
                orgname
              };
            } else {
              this.createMemberForm.empList.push({
                name: empname,
                account: empAccount,
                orgname
              });
            }

            this.createMemberForm.empname = "";
            this.createMemberForm.empAccount = "";
            if (typeof this.createMemberForm.editIndex != "undefined") {
              if (triggerTarget == "name") {
                this.$Message.success("修改姓名成功！");
              } else {
                this.$Message.success("修改电话成功！");
              }
              delete this.createMemberForm.editIndex;
            }
          } else {
            this.$refs.createMemberForm.validateField("empname");
          }
        }
      });
    },
    openRule() {
      this.memberValidateSwitch = true;
    },
    parentOrgChange(e) {
      let { label, value } = e;
      this.createMemberForm.orgname = label;
      this.createMemberForm.parentOrg = value;
    },
    removeAddMember(index) {
      this.createOrgForm.empList.splice(index, 1);
    },
    removeAddMember2(index) {
      this.createMemberForm.empList.splice(index, 1);
    },
    removeAddMember3(index, mapIndex) {
      this.editMemberForm.empList[mapIndex].isEdited = false;
      this.editMemberForm.addMemberList.splice(index, 1);
    },
    removeAddMember4(index, mapIndex) {
      this.editJTMemberForm.empList[mapIndex].isEdited = false;
      this.editJTMemberForm.addMemberList.splice(index, 1);
    },
    openOrgEditMode() {
      this.globalEditMode = true;
      let { orgid, orgDept, oid } = this.getLoginUserInfo;
      if (this.isJTManager || this.isSysManager) {
        this.orgData.editMode = true;
        for (const org of this.orgData.orgList) {
          org.editMode = true;
          for (const org2 of org.orgList) {
            org2.editMode = true;
          }
        }
      } else if (this.isDWManager) {
        for (const org of this.orgData.orgList) {
          if (org.id == oid) {
            for (const org2 of org.orgList) {
              org2.editMode = true;
            }
          }
        }
      } else {
        for (const org of this.orgData.orgList) {
          for (const org2 of org.orgList) {
            console.log(org2);
            if (org2.id == oid) {
              org2.editMode = true;
              break;
            }
          }
        }
      }
    },
    saveOrgData() {
      this.globalEditMode = false;
      this.orgData.editMode = false;
      for (const org of this.orgData.orgList) {
        org.editMode = false;
        for (const org2 of org.orgList) {
          org2.editMode = false;
        }
      }
    },
    refreshOrgData() {
      this.getOrgsData()
        .then(res => {
          console.log("success: ", res);
          if (res.success) {
            (res.data || []).forEach(item => {
              item.isShow = false;
              console.log(item.orgList);
              (item.orgList || []).forEach(item2 => {
                item2.isShow = false;
                (item2.orgList || []).forEach(item3 => {
                  item3.isShow = false;
                });
              });
            });
            this.orgData = res.data[0];
          }
        })
        .catch(error => {
          console.log("error: ", error);
        });
    },
    reEditToForm(member) {
      for (const item of this.editMemberForm.empList) {
        item.isChecked = false;
      }
      let { id, orgid, orgname, name, account } = member;
      this.editMemberForm.memberId = id;
      this.editMemberForm.memberOrgid = orgid;
      this.editMemberForm.memberOrgname = orgname;
      this.editMemberForm.newName = name;
      this.editMemberForm.newAccount = account;
    },
    reEditToForm2(member) {
      for (const item of this.editJTMemberForm.empList) {
        item.isChecked = false;
      }
      let { id, orgid, orgname, name, account } = member;
      this.editJTMemberForm.memberId = id;
      this.editJTMemberForm.memberOrgid = orgid;
      this.editJTMemberForm.memberOrgname = orgname;
      this.editJTMemberForm.newName = name;
      this.editJTMemberForm.newAccount = account;
    },
    reEditToOrgForm(member, index = 0) {
      let { name, account } = member;
      this.createOrgForm.empname = name;
      this.createOrgForm.empAccount = account;

      this.createOrgForm.editIndex = index;
    },
    reEditToMemberForm(member, index = 0) {
      let { name, account } = member;
      this.createMemberForm.empname = name;
      this.createMemberForm.empAccount = account;

      this.createMemberForm.editIndex = index;
    },
    saveMemberEditor(triggerTarget) {
      let {
        memberId,
        memberOrgid,
        memberOrgname,
        newName,
        newAccount,
        mapIndex
      } = this.editMemberForm;
      if (newName == "" && newAccount == "") {
        return;
      }
      this.$refs.editMemberForm.validateField("newPhone", valid => {
        if (valid == "") {
          if (newName && newAccount) {
            let filterList = this.editMemberForm.addMemberList.filter(
              item => item.id == memberId
            );
            if (filterList.length == 0) {
              this.editMemberForm.addMemberList.push({
                id: memberId,
                orgid: memberOrgid,
                name: newName,
                account: newAccount,
                orgname: memberOrgname,
                mapIndex
              });
            } else {
              this.editMemberForm.addMemberList.map(item => {
                if (item.id == memberId) {
                  item.name = newName;
                  item.account = newAccount;
                }
                return item;
              });
            }
            if (triggerTarget == "name") {
              this.$Message.success("修改姓名成功！");
            } else {
              this.$Message.success("修改电话成功！");
            }
            this.editMemberForm.empList[mapIndex].isEdited = true;

            this.editMemberForm.memberOrgname = "";
            this.editMemberForm.newName = "";
            this.editMemberForm.newAccount = "";
          }
        }
      });
    },
    saveMemberEditor2(triggerTarget) {
      this.$refs.editJTMemberForm.validateField("newPhone", valid => {
        if (valid == "") {
          let {
            memberId,
            memberOrgid,
            memberOrgname,
            newName,
            newAccount,
            mapIndex
          } = this.editJTMemberForm;
          if (newName && newAccount) {
            let filterList = this.editJTMemberForm.addMemberList.filter(
              item => item.id == memberId
            );
            if (filterList.length == 0) {
              this.editJTMemberForm.addMemberList.push({
                id: memberId,
                orgid: memberOrgid,
                name: newName,
                account: newAccount,
                orgname: memberOrgname,
                mapIndex
              });
            } else {
              this.editJTMemberForm.addMemberList.map(item => {
                if (item.id == memberId) {
                  item.name = newName;
                  item.account = newAccount;
                }
                return item;
              });
            }
            if (triggerTarget == "name") {
              this.$Message.success("修改姓名成功！");
            } else {
              this.$Message.success("修改电话成功！");
            }
            this.editJTMemberForm.empList[mapIndex].isEdited = true;

            this.editJTMemberForm.memberOrgname = "";
            this.editJTMemberForm.newName = "";
            this.editJTMemberForm.newAccount = "";
          }
        }
      });
    },
    deleteJTMember() {
      let _this = this;
      this.$Modal.confirm({
        title: "提示信息",
        content: "是否确认删除已选人员？",
        okText: "是",
        cancelText: "否",
        loading: true,
        onOk() {
          let employees = util
            .deepClone(_this.orgData.deleteMemberList)
            .map(item => {
              return { id: item };
            });
          let params = {
            orgStatus: 0,
            orgDepts: [],
            empStatus: 2,
            employees
          };
          _this.organizationOptions(params).then(res => {
            if (res.success) {
              _this.$Modal.remove();
              _this.$Message.success("删除成功！");
              _this.refreshOrgData();
            }
          });
        }
      });
    },
    watchWorkPlan(node) {
      this.changeNaviPath("manageCenter");
      this.changeSubNaviPath("workPlanList");
      this.$router.push({
        name: "workPlanList",
        params: { type: "deptWorkPlan", orgId: node.id }
      });
    },
    myWorkPlan() {
      this.changeNaviPath("manageCenter");
      this.changeSubNaviPath("workPlanList");
      this.$router.push({
        name: "workPlanList",
        params: { type: "myworkplan" }
      });
    },
    orgRename(node) {
      // if(node.orgname == '党委'){
      //     return;
      // }
      if (node.editMode) {
        this.orgRenameForm = util.deepClone(node);
        this.orgRenameModal = true;
      } else {
        return false;
      }
    },
    orgRenameSubmit() {
      this.$Spin.show();
      let params = {
        orgStatus: 1,
        orgDepts: [],
        empStatus: 0,
        employees: []
      };
      params.orgDepts.push(this.orgRenameForm);
      this.organizationOptions(params).then(res => {
        if (res.success) {
          this.$Spin.hide();
          this.orgRenameModal = false;
          this.$Message.success(res.message);
          this.refreshOrgData();
          this.setLoginUserInfoForLocal({});
          $eventBus.$emit("refreshHomeData");
        } else {
          this.$Spin.hide();
          this.$Modal.error({
            title: "提示信息",
            content: res.message
          });
        }
      });
    },
    openEditJTMemberModal() {
      this.viewJTmemberFlag = false;
      if (this.orgData.empList.length) {
        for (const member of this.orgData.empList) {
          this.$set(member, "orgname", this.orgData.orgname);
          this.$set(member, "newName", member.name);
          this.$set(member, "newAccount", member.account);
          this.$set(member, "isChecked", false);
          this.$set(member, "isEdited", false);
        }
        this.$set(this.orgData, "addMemberList", []);
      }
      this.editJTMemberForm = this.orgData;
      this.editJTMemberFlag = true;
    },
    ...mapActions([
      "getOrgsData",
      "getEmpInfo",
      "organizationOptions",
      "changeNaviPath",
      "changeSubNaviPath",
      "setLoginUserInfoForLocal",
      "getOrganizationList"
    ])
  }
};
</script>

<style lang="less" scoped>
.organization-view-wrapper {
  width: 1100px;
  margin: 0 auto;
  .header-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 25px 20px 25px 0;
    margin-bottom: 12px;
    background-color: #fff;
    .title {
      position: relative;
      padding-left: 24px;
      font-size: 30px;
      color: #333333;
      &::before {
        content: "";
        position: absolute;
        left: 0;
        top: 50%;
        margin-top: -15px;
        width: 4px;
        height: 30px;
        background-color: #d11528;
      }
    }
    .org-opts-wrap {
      flex: 0 0 300px;
      display: inline-flex;
      justify-content: flex-end;
      .btn-item {
        padding: 7px 10px;
        margin-right: 20px;
        &:last-child {
          margin-right: 0;
        }
      }
    }
  }
  .org-view-container {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    padding: 29px 10px 50px 10px;
    background-color: #fff;
    .root-node-wrap {
      .node-info {
        position: relative;
        width: 130px;
        margin-right: 26px;
        .title {
          width: 125px;
          padding: 15px 10px;
          margin: 0 auto;
          margin-bottom: 12px;
          font-size: 18px;
          color: #ffffff;
          background-color: #d11528;
          border-radius: 6px;
          font-weight: bold;
          white-space: nowrap;
          // text-align: center;
          text-overflow: ellipsis;
          overflow: hidden;
          &.jt-title {
            white-space: initial;
            overflow: initial;
            text-overflow: initial;
            text-align: center;
          }
        }
        .node-members {
          display: flex;
          flex-direction: column;
          font-size: 16px;
          color: #167fdb;
          .common-link {
            flex: 1;
            text-align: center;
            margin-bottom: 15px;
            cursor: pointer;
          }
        }
        .node-icon {
          position: absolute;
          right: -39px;
          top: 10px;
          z-index: 99;
        }
      }
    }
    .children-node-wrap {
      .border-container {
        border-left: 3px solid #d11528;
        padding-left: 26px;
        .node-item-wrap {
          position: relative;
          display: flex;
          align-items: flex-start;
          justify-content: flex-start;
          flex-flow: wrap;
          padding-bottom: 30px;
          &:last-child {
            padding-bottom: 0;
            &::before {
              content: "";
              position: absolute;
              top: 23px;
              bottom: 0;
              left: -29px;
              width: 3px;
              height: 100%;
              background-color: #fff;
            }
          }
          .node-info {
            position: relative;
            &.level-first-node {
              &::before {
                content: "";
                position: absolute;
                left: -39px;
                top: 0;
                width: 22px;
                height: 50px;
                background-color: #fff;
                // border-bottom: 3px solid #d11528;
              }
            }
            &.level-middle-node {
              &::before {
                content: "";
                position: absolute;
                left: -29px;
                top: 20px;
                width: 16px;
                height: 0;
                background-color: #fff;
                border-bottom: 3px solid #d11528;
              }
            }
            .title {
              width: 91px;
              padding: 8px 0;
              margin-bottom: 12px;
              background-color: #d11528;
              border-radius: 6px;
              font-size: 18px;
              color: #ffffff;
              text-align: center;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
            }
            .node-members {
              display: flex;
              justify-content: space-around;
              font-size: 16px;
              color: #167fdb;
              .common-link {
                flex: 1;
                text-align: center;
                margin-bottom: 15px;
                cursor: pointer;
              }
            }
            .delete-node {
              position: absolute;
              top: -10px;
              right: -10px;
              width: 27px;
              height: 27px;
              border-radius: 50%;
              border: solid 4px #ffffff;
              background: url("~@/images/gl_icon_down_gb.png") no-repeat;
              background-color: #fff;
              background-size: 100% 100%;
              cursor: pointer;
            }
            .node-icon {
              position: absolute;
              right: -39px;
              top: 10px;
              z-index: 99;
            }
          }
          .all-member-content {
            width: 570px;
            padding: 24px;
            margin-left: 52px;
            margin-bottom: 16px;
            border: 1px solid #cccccc;
            border-radius: 6px;
            .member-inner {
              max-height: 192px;
              overflow-y: scroll;
              text-align: left;
              &::-webkit-scrollbar {
                width: 8px;
                background-color: #a8a8a8;
              }

              &::-webkit-scrollbar-track {
                background-color: #fff;
              }

              &::-webkit-scrollbar-thumb {
                width: 8px;
                border-radius: 10px;
                box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
                background-color: #a8a8a8;
              }
              .member-wrap {
                display: inline-block;
                min-width: 64px;
                margin: 0 38px 22px 0;
                &.edit-mode {
                  margin: 0 24px 22px 0 !important;
                }
                .member {
                  font-size: 16px;
                  color: #333333;
                }
              }
            }
            .no-data-tips {
              font-size: 16px;
              text-align: center;
              color: #999999;
            }
          }
          .member-edit-wrap {
            flex: 0 0 100%;
            display: inline-flex;
            align-items: center;
            justify-content: flex-end;
            .member-edit-btn {
              padding: 5px 12px;
              background-color: #ffffff;
              border-radius: 6px;
              border: 1px solid #d11528;
              color: #d11528;
              margin-right: 16px;
              cursor: pointer;
              &:last-child {
                margin-right: 0;
              }
              &.disabled {
                color: #c5c8ce;
                background-color: #f7f7f7;
                border-color: #dcdee2;
                cursor: not-allowed;
                .delete-icon {
                  background: url("~@/images/my_icon_delete_nor.png") no-repeat !important;
                  background-size: 100% 100% !important;
                }
                .edit-icon {
                  background: url("~@/images/zz_icon_xg_nor.png") no-repeat !important;
                  background-size: 100% 100% !important;
                }
              }
              .icon {
                display: inline-block;
                vertical-align: middle;
                width: 16px;
                height: 16px;
                margin-right: 10px;
                margin-bottom: 2px;
                &.delete-icon {
                  background: url("~@/images/my_icon_delete_set.png") no-repeat;
                  background-size: 100% 100%;
                }
                &.edit-icon {
                  background: url("~@/images/zz_icon_xg_set.png") no-repeat;
                  background-size: 100% 100%;
                }
                &.complete-icon {
                  width: 19px;
                  height: 12px;
                  background: url("~@/images/zz_icon_wc_set.png") no-repeat;
                  background-size: 100% 100%;
                }
              }
              .label {
                display: inline-block;
              }
            }
          }
        }
      }
    }
  }
  .margin-r-26 {
    margin-right: 26px;
  }
  .margin-b-50 {
    margin-bottom: 50px;
  }
  .width-686 {
    width: 720px;
  }
  .hidden {
    visibility: hidden;
  }
  .whiteBg {
    color: #d11528 !important;
    border: 2px solid #d11528 !important;
    background-color: #fff !important;
  }
  button {
    &:disabled {
      .edit-icon {
        background: url("~@/images/zz_icon_xg_nor.png") no-repeat;
        background-size: 100% 100%;
      }
      .complete-icon {
        background: url("~@/images/zz_icon_wc_nor.png") no-repeat;
        background-size: 100% 100%;
      }
      .plus-icon {
        background: url("~@/images/zz_icon_jia_nor.png") no-repeat;
        background-size: 100% 100%;
      }
      .sort-icon {
        background: url("~@/images/zz_icon_zuz_nor.png") no-repeat;
        background-size: 100% 100%;
      }
      .move-icon {
        background: url("~@/images/zz_icon_ry_nor.png") no-repeat;
        background-size: 100% 100%;
      }
    }
    &:not(:disabled) {
      border-color: #d11528;
      color: #d11528;
    }
    .edit-icon {
      display: inline-block;
      vertical-align: text-top;
      width: 18px;
      height: 19px;
      margin-right: 3px;
      background: url("~@/images/zz_icon_xg_set.png") no-repeat;
      background-size: 100% 100%;
    }
    .complete-icon {
      display: inline-block;
      vertical-align: text-top;
      width: 19px;
      height: 12px;
      margin-right: 3px;
      background: url("~@/images/zz_icon_wc_set.png") no-repeat;
      background-size: 100% 100%;
    }
    .plus-icon {
      display: inline-block;
      vertical-align: text-top;
      width: 18px;
      height: 18px;
      margin-right: 3px;
      background: url("~@/images/zz_icon_red_jia.png") no-repeat;
      background-size: 100% 100%;
    }
    .sort-icon {
      display: inline-block;
      vertical-align: text-top;
      width: 18px;
      height: 18px;
      margin-right: 3px;
      background: url("~@/images/zz_icon_zuz.png") no-repeat;
      background-size: 100% 100%;
    }
    .move-icon {
      display: inline-block;
      vertical-align: text-top;
      width: 18px;
      height: 18px;
      margin-right: 3px;
      background: url("~@/images/zz_icon_ry_set.png") no-repeat;
      background-size: 100% 100%;
    }
  }
}
.member-edit-modal {
  .modal-content-back {
    padding: 0 14px;
    .member-list-wrap {
      padding: 10px;
      border-radius: 2px;
      border: 1px solid #cccccc;
      overflow-y: auto;
      max-height: 140px;
      .member-item {
        display: inline-block;
        width: 86px;
        padding: 0px 0;
        margin: 0 10px 10px 0;
        border-radius: 6px;
        border: 1px solid #cccccc;
        text-align: center;
        font-size: 16px;
        &.active {
          color: #fff;
          background-color: #d11528;
        }
      }
    }
    .edit-input-wrap {
      width: 266px;
    }
  }
  .member-edit-footer {
    display: flex;
    justify-content: flex-end;
    .btn {
      width: 86px;
      padding: 5px;
      margin-left: 18px;
      border-radius: 6px;
      border: solid 1px #d11528;
      font-size: 16px;
      color: #d11528;
      text-align: center;
      cursor: pointer;
      &.bgc-red {
        background-color: #d11528;
        color: #fff;
      }
    }
  }
}
.create-org-modal,
.create-member-modal,
.member-edit-modal {
  .modal-content-back {
    padding: 0 14px;
    .input-wrap {
      width: 256px;
    }
    .add-member-wrap,
    .edited-member-list-wrap {
      display: flex;
      justify-content: flex-start;
      flex-flow: wrap;
      .add-member-item,
      .edited-member {
        position: relative;
        min-width: 116px;
        padding: 4px 0;
        margin-right: 18px;
        margin-bottom: 10px;
        background-color: #fafafa;
        border-radius: 2px;
        border: 1px solid #cccccc;
        font-size: 16px;
        text-align: center;
        &:nth-child(5n) {
          margin-right: 0;
        }
        .del-icon {
          position: absolute;
          right: 4px;
          top: 50%;
          margin-top: -16px;
          cursor: pointer;
          font-size: 16px;
        }
      }
    }
  }
  .create-org-footer {
    display: flex;
    justify-content: flex-end;
    .btn {
      width: 86px;
      padding: 5px;
      margin-left: 18px;
      border-radius: 6px;
      border: solid 1px #d11528;
      font-size: 16px;
      color: #d11528;
      text-align: center;
      cursor: pointer;
      &.bgc-red {
        background-color: #d11528;
        color: #fff;
      }
    }
  }
}
.view-member-modal {
  .modal-heander {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 90%;
    .title {
      font-size: 18px;
    }
    .opt-wrap {
      display: inline-flex;
      align-items: center;
      justify-content: flex-end;
      font-size: 14px;
      .opt-item {
        padding: 5px 12px;
        background-color: #ffffff;
        border-radius: 6px;
        border: 1px solid #d11528;
        color: #d11528;
        margin-right: 16px;
        cursor: pointer;
        &:last-child {
          margin-right: 0;
        }
        .icon {
          display: inline-block;
          vertical-align: middle;
          width: 16px;
          height: 16px;
          margin-right: 10px;
          margin-bottom: 2px;
          &.delete-icon {
            background: url("~@/images/my_icon_delete_set.png") no-repeat;
            background-size: 100% 100%;
          }
          &.edit-icon {
            background: url("~@/images/zz_icon_xg_set.png") no-repeat;
            background-size: 100% 100%;
          }
          &.complete-icon {
            width: 19px;
            height: 12px;
            background: url("~@/images/zz_icon_wc_set.png") no-repeat;
            background-size: 100% 100%;
          }
        }
        .label {
          display: inline-block;
        }
      }
    }
  }
}
</style>
<style lang="less">
.ivu-select-dropdown-list {
  max-height: 300px;
}
.organization-view-wrapper {
  .all-member-content {
    .member-inner {
      .ivu-checkbox + span {
        display: none;
      }
    }
  }
}
.view-member-modal {
  .jt-member-list-wrap {
    .ivu-checkbox + span {
      display: none;
    }
    .member-wrap {
      display: inline-block;
      margin: 0 10px 10px 0;
    }
  }
}
.create-org-modal,
.member-edit-modal,
.create-member-modal {
  .ivu-form-item-error-tip {
    font-size: 16px;
    left: initial;
    // right: 20%;
    top: 50%;
    margin-top: 23px;
    padding-top: 0;
  }
}
</style>
