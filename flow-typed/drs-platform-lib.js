// @flow

declare module 'drs-platform-lib' {
  declare module.exports: any;

  // api返回结果结构体
  declare type ResponseResult = {
    success: boolean,
    error?: string,
    data?: any
  };

  // 无效的类型
  declare type InvalidType = 'required' | 'invalidNumber' | 'minLength' | 'maxLength' | 'min' | 'max' |
    'unique' | 'invalidDate' | 'dateRang' | 'numberRang' | 'gt' | 'lt' | 'gteq' | 'lteq' | 'invalid' | 'other';

  // 校验的错误信息
  declare type ValidateError = {
    name: string,
    type: InvalidType,
    value?: Object,
    message?: string
  }

  // 检验结果
  declare type ValidateResult = {
    success: boolean,
    message?: string,
    errors?: Array<ValidateError>
  }


  // 数据编辑状态，新增\修改\只读(非编辑状态)
  declare type DataStatus = 'New' | 'Edit' | 'ReadOnly' | 'new' | 'edit' | 'readonly';

  // 字段类型
  declare type FieldType = 'string' | 'number' | 'integer' | 'date' | 'time' | 'datetime' | 'boolean' | 'array' | 'binary' | 'text';


  // 编码数据1,value表示值,name表示显示文本
  declare type nameValue = {
    name: string,
    value: any
  }

  // 编码数据2,value表示值,text表示显示文本
  declare type textValue = {
    text: string,
    value: any
  }

  declare type StringArray = Array<string>;

  // 扩展信息
  declare type FieldExtention = {
    json: boolean;
    file: boolean;
  };


  // 字段Schema
  declare type FieldSchema = {
    name: string;
    type: FieldType;
    title: string;
    format: string;
    default: string;
    constraints: SchemaConstraints;
    extention: FieldExtention;
  };

  declare type IndexSchema = {
    // 索引名称
    name: string;
    // 索引字段
    columns:Array<string>;
    // 唯一索引
    unique:boolean;
  };

  // 字段约束
  declare type SchemaConstraints = {
    required: boolean,
    minimum?: number,
    maximum?: number,
    maxLength?: number,
    minLength?: number,
    scale?: number,
    enum?: Array<any>
  };

  // 外键字段
  declare type ForeignKeyField = {
    // 关联主表的字段名
    name: string,
    // 主表表名
    refTable: string,
    // 主表的字段名
    refName: string
  };

  // 关联值集的配置。
  declare type OptionValueRelTable = {
    // 表名
    name: string;
    // 文本字段名或属性名
    textName: string;
    // 值字段名或属性名
    valueName: string;
    // 筛选条件,比如：name='sex',以name字段
    filter: string;
    // 值集数据是否是JSON格式的数据
    jsonData: boolean;
    // JSON格式的数据的字段名
    jsonField: string;
    // 延迟加载
    lazy: boolean;
    // 树形的层级关系字段名
    treeRelName:string;
  }

  // 默认值的值集数据
  declare type TextValue = {
    text: string;
    value: string | number;
  }

  // 字段值集的配置
  declare type OptionValue = {
    // 字段名
    name: string;
    // 类型
    relTable: OptionValueRelTable;
    // 默认值
    default: Array<TextValue>;
    // 禁止自动新增
    disableAutoCreate:boolean;
  }

  // 1：增加,2:删，3：改
  declare type DataPushMode = 1 | 2 | 3;

  // 内部数据数据推送
  declare type DataPush = {
    // 目标表名
    target: string;
    // 源的操作
    sourceMode: DataPushMode;
    // 目标的操作
    targetMode: DataPushMode;
    // 推送条件，字段值
    condition: Array<QueryCondition>;
    // 数据关系
    mapping: Array<DataMapping>;
  }

  // 表Schema
  declare type TableSchema = {
    name: string;
    title: string;
    fields: Array<FieldSchema>;
    primaryKey: string | StringArray;
    foreignKeys?: Array<ForeignKeyField>;
    // 唯一性字段，如果是组合唯一性行，则用逗号分隔字段名
    uniques?: Array<string>;
    // JSON类型字段名列表
    jsons: Array<string>;
    // 值集配置
    optionValues: Array<OptionValue>;
  };

  // 查询条件的操作符
  declare type QueryOperation = 'in' | 'between' | 'like' | 'null' | 'notNull' | '=' | '>' | '<' | '<=' | '>=';

  // 查询条件
  declare type QueryCondition = {
    name: string;
    op: QueryOperation;
    value: any; // 可以是数组，字符串、数字等
  }
  // 数据的排序方式
  declare type SortDirection = 'asc' | 'desc';

  // 排序字段
  declare type SortField = {
    name: string,
    type: SortDirection
  }

  // 数据映射，关联关系
  declare type DataMapping = {
    // 源
    source: string,
    // 目标
    target: string
  }

  // 参数映射的类型
  // data流程或业务数据，author发起人数据，processor流程节点办理人数据，preset预设值
  declare type ParameterMappingType = 'data' | 'author' | 'processor' | 'preset';

  // 参数映射
  declare type ParameterMapping = {
    // 参数名称
    name: string,
    // 类型
    type: ParameterMappingType,
    // 值, 源数据的自定义名、author发起人数据，processor流程节点办理人数据，preset预设值
    value: string,
  };


  // API调用配置
  declare type ApiCall = {
    name: string,
    path: string,
    // 推送数据配置,target是API接收的数据参数。
    mapping: Array<ParameterMappingType>
  }
  // #region 流程配置相关

  // 流程环节类型,开始和结束是特殊的类型
  // 审批、办理、任务、触发器
  declare type WorkflowActivityType = 'start' | 'approve' | 'process' | 'task' | 'trigger' | 'end';

  // 审批节点配置
  declare type ApproveActivityConfig = {
    // 不同意跳转的环节，简化版的分支条件
    disagreeGo: string,
    // 不同意跳转的环节名称
    disagreeGoName: string,
  }

  // 办理节点配置
  declare type ProcessActivityConfig = {
    // 数据源，为空时用流程关联的表
    schema: string,
    // 数据源名称
    schemaName: string,
    // 办理的数据项列表
    names: Array<string>
  }

  // 任务节点配置
  declare type TaskActivityConfig = {
    // 任务ID
    id: number,
    // 任务名称
    name: string,
    // 推送数据关系配置
    mapping: Array<ParameterMapping>
  }

  // 触发器节点配置
  declare type TriggerActivityConfig = {
    apis: Array<ApiCall>
  }


  // 流程角色源类型,data流程或业务数据，author发起人部门，processor前一流程节点办理人部门
  declare type LimitDeptSourceType = 'data' | 'author' | 'processor';

  // 流程角色的配置
  declare type WorkflowPPConfig = {
    // 是否限定部门
    limitDept: boolean;
    // 限定部门的数据项名称
    source?: string,
    // 部门授权的模块
    module: string,
    // 限定的类型
    sourceType: LimitDeptSourceType,
  };

  // 流程的参与者类型:1=人员，2=角色
  declare type WorkflowPPType = 1 | 2;
  // 流程的参与者
  declare type WorkflowPP = {
    // id
    id: number,
    // 名称
    name: string,
    // 类型
    type: WorkflowPPType,
    // 角色的配置
    config: WorkflowPPConfig,
  };

  // 流程类型：1=基础流程，2=标准流程，3=业务流程
  declare type WorkflowType = 1 | 2 | 3;


  // 条件之间的关系类型
  declare type ActivityConditionType = 'and' | 'or';
  // 流程节点条件
  declare type ActivityCondition = {
    // 表单数据名称
    dataName: string,
    // 表达式，> < >= <= ==
    expression: string,
    // 条件的比较值
    value: Object,
    // 关系类型，默认值：and
    type: ActivityConditionType,
  };

  // 流程分支
  declare type ActivityBranch = {
    // 名称
    name: string,
    // 条件集合
    conditions: Array<ActivityCondition>
  }


  // 流程的环节
  declare type WorkflowActivity = {
    // no
    no: string,
    // 名称
    name: string,
    // 前一环节
    previous: string,
    // 下一环节
    next: string,
    // 是否是多人任务，是则必须全部参与者完成才流转
    multiTask: boolean,
    // 节点类型
    type: WorkflowActivityType,
    // 流程参与者
    pps?: Array<WorkflowPP>,
    // 分支条件
    branches?: Array<ActivityBranch>,
    // 配置
    config: ApproveActivityConfig | ProcessActivityConfig | TaskActivityConfig | TriggerActivityConfig,
  };

  // 流程配置信息
  declare type Workflow = {
    // id
    id: number,
    // 名称
    name: string,
    // 类型
    type: WorkflowType,
    // 允许人工发起，仅2=标准流程配置
    manualLaunchable: boolean,
    // 环节
    activities: Array<WorkflowActivity>,
    // 关联表
    relTable: string,
  };

  // #endregion

  // #region流程实例相关

  // 流程实例
  declare type WorkflowInstance = {
    // 关联业务数据Id
    ownId: number,
    // 数据
    data: Object,
    // 任务数据
    task: Object,
    // 事务
    transacting?: Object,
  };

  // 流程的任务
  declare type WorkflowTask = {
    // id
    id: number,
    // 名称
    name: string,
    // 流程配置Id
    flowId: number,
    // 流程实例Id
    flowInstanceId: number,
    // 流程节点no
    activityNo: string,
    // 流程节点实例Id
    activityInstanceId: number,
    // 任务分配时间
    createdAt: any,
    // 完成状态
    completed: boolean,
  };

  // 流程提交结果
  declare type WorkfloWorkflowTaskwCommitResult = {
    success: boolean,
    message?: string,
    errors?: Array<ValidateError>,
    next?: string,
    // 流程实例Id
    instanceId: number,
    // 整个流程是否已经全部结果
    completed: boolean,
  };

  // #endregion

  // 引用数据参数
  declare type RefDataParams = {
    // 引用数据的表名
    name: string,
    // 主数据的字段名
    source: string,
    // 引用数据的字段名
    target: string,
  }

  // 获取数据参数
  declare type GetDataParams = {
    // 表名
    schema: string,
    // 附加数据配置
    rels: Array<RefDataParams>,
  }

  // 邮件发送配置
  declare type MailSendConfig = {
    // 主题模板
    subject: string,
    // 内容模板
    content: string,
    // 收件人地址字段，未空时发送必须指定收件人
    addressName: string,
    // 获取数据配置
    dataSource: GetDataParams,
  }


  // 字段名和值，目前用于禁止删除和修改
  declare type FieldValue = {
    field: string;
    value: any;
  }

  // 多个字段值的AND，目前用于禁止删除和修改
  declare type FieldValues = Array<FieldValue>;

  // 导入时自动增加的值集数据
  declare type AutoCreateOption = {
    // 字段名
    name: string,
    // 值集的名称
    values: Array<string>,
  }

  // excel数据对应关系
  declare type ExcelSourceMap = {
    // excel 列序，从0开始
    source: number,
    // 表字段名
    map: string,
  }

  // excel数据参数
  declare type ExcelDataParams = {
    // shema 名称
    name: string,
    // 数据对应关系
    sourceMap: Array<ExcelSourceMap>,
    // 匹配字段名，数组
    matchNames: Array<string>,
    // 数据行
    rows: Array<Object>,
    // 自动创建值集的字段名列表
    autoCreateOptions: Array<string>,
    // excel数据开始行号
    startRowNum: number,
    // 修改的行号
    update: Array<number>,
    // 新增的行号
    insert: Array<number>,
    // 自动增加的值集数据列表
    autoCreateOptionValues: Array<AutoCreateOption>
  }
}
