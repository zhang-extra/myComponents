// 模版表单从大到小包含关系为Page(date) <-- section <-- item。
declare module 'template-form' {
  declare module.exports: any;

  declare type Mode = 'edit' | 'write' | 'evaluate' | 'result';
  declare type ItemType = 'SectionTitle' /*小节标题*/ | 'Radio' /*单选*/ | 'Checkbox' | /*多选*/  | "Paragraph" /*段落*/ | 'Time' /* 日期 */;

  // 块项目
  declare type Item = { // 传给FormsPage的data属性。
    id: string, // 随机生成的Item唯一标识，渲染无关。
    type: ItemType
    title: string, // 小项的标题, 显示在第一行。
    description?: string, // 小项的说明，如果为null则隐藏，为String则显示在第二行。
    required?: false // 选择是否是必填项，默认否, 如果是则在title后显示星号。只有edit模式可以编辑。 当type='sectionTitle'时恒为false。
    inputValue?: string | Array<string>, // type不为'sectionTitle'和'declaraction'时存在这个字段。只有write模式可以编辑。对于段落来讲-是输入的字，对于选择来讲-是选择的value或者values数组, 对日期来讲-是输入的一个日期或者日期区间。
    options?: Array<string>,  //["选项1", "选项2", "选项3"], // type为'radio'和'checkbox'时才有这个字段, 表示每个选项的名字。只有edit模式可以编辑。
    cols?: number, // // type为'radio'和'checkbox'时才有这个字段。表示一行能占几个option。只有edit模式可以编辑。
    score?: 0, // type不为sectionTitle时存在这个字段，mode=evaluate时可对write模式下返回的data的每一项item进行评分。
  }

  // 内容块
  declare type Section = { // 传给FormsPage的data属性。
    id: string, // 随机生成的section唯一标识，渲染无关。
    totalScore: number, // 自动计算所有的item的score之和，只读。
    items: Array<Item> // 必然存在item[0] type='sectionTitle'。
  };

  // 表单页
  declare type Page = {
    // 表单的标题
    title: string,
    // 块数组
    sections: Array<Section>
  };
}
