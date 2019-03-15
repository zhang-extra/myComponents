/* data-driven flex-wrap Lyout的DND组件, 支持任意宽高的自定义item,
1.导入 import { DragDropWrapper, DropArea } from '../components/FlexWrapDnDArea';

2.使用顺序: 
  〇DragDropWrapper只能在外层存在一个。// 这是一个布局有关的块级容器组件
  ①将所有DropArea嵌套在DragDropWrapper中.
  ②DropArea可以任意叠加嵌套并且可以在内渲染任意子组件，排序在末尾item之后.
  <DragDropWrapper className={xxx} style={xxx} > DragDropWrapper接受className和style两个属性
    <DropArea areaId='0'>
      <DropArea areaId='1'>{children}</DropArea>
    </DropArea>
    <DropArea areaId='2'/>
  </DragDropWrapper> 

3.DropArea 属性
  <DropArea
    className={xxx}
    style={xxx}
    areaId={string} // 必须要有的区分每个DropArea的唯一字符串标识
    value={array of object} // 支持受控的value和非受控的defaultValue, 任选其一填写，不填则默认为初始为空的defaultValue
    defaultValue={array of object}
    onChange={newValue => setValue(newValue)} // value变化时的回调函数
    ItemRender={anything can be render(OwnItem)} // 任何可以被渲染的元素 自定义被渲染的组件
    itemFasten={bool} // 控制DropArea上的Item被拖拽后会不会移除，以及外部拖拽进来的Item会不会被添加到当前DropArea上。即DropArea是否恒定不变。
    flexDirection='row' || 'column'; // flex布局的排列方向 默认为row
    couldAreaDrag={bool} // 预留属性，控制DropArea本身是否可以被拖拽

    ...customProps // 其他自定义的需要传递给自定义渲染组件的属性
  />

  const OwnItem = props => { // 自定义渲染组件
    // 自定义组件可以拿到以下这些属性
    const { connectDrag, connectDragPreview, 
      data, index, areaId, 
      isDragging, isPreview, isPlaced, isFasten, ...otherCustomProps } = props;
    // index是item位于value中的下标, 占位预览的item下标为-1.
    // connectDrag用于连接拖拽功能至某个原生html元素， connectDragPreview用于连接拖拽时要出现的原生html及其子元素.
    // isDragging 标识当前item是否正在被拖拽， isPreview标识当前item是否处于预览状态，
    // isPlace的标识当前item是不是被另外个正在被拖拽的item hover于上，isFasten标识当前item是否处于恒定的DropArea内。
    const { title, type } = data; // DropArea中的value数组中的所有object即为这里的data
    return connectDrag(
      <div
        className={className(styles.item, {
          [styles.dragging]: isDragging,
          [styles.preview]: isPreview,
          [styles.placed]: isPlaced,
        })}
      >
        {title}
      </div>    
    );
  }

  // 带拖拽手柄的自定义组件示例
    const { connectDrag, connectDragPreview, data } = props;
    const { title, type } = data; // DropArea中的value数组中的所有object即为这里的data
    return connectDragPreview(
      <div className={styles.itemWrapper}>
        {title}
        {connectDrag(<div className={styles.dragHandle} />)}
      </div>    
    );
  }

  // 自定义dragPreview示例
    const { connectDrag, connectDragPreview, data, isDragging } = props;
    const { title, type } = data; // DropArea中的value数组中的所有object即为这里的data
    return connectDrag(
      <div className={styles.itemWrapper}>
        {title}
        {connectDragPreview(<div style={{ display: isDragging ? '' : 'none'  }} className={styles.dragPreview} />)}
      </div>    
    );
  }

4.用例
①单区域排序
  <DragDropWrapper > 
    <DropArea 
      areaId='xx'
      itemFasten={false} 或者不填
      value + onChange || defaultValue ={}
      flexDirection='xx'
      ItemRender={(props) => <div>{props.title}</div>}
    />
  </DragDropWrapper>
②跨区域排序，表单设计
  const initValue=[{
    type: 'a',
    title: 'aaa',
  }, {
    type: 'b',
    title: 'bbb',
  }]
  <DragDropWrapper > 
    <DropArea 
      areaId='0'
      itemFasten={true}
      value + onChange || defaultValue ={initValue}
      flexDirection='xx'
      ItemRender={(props) => <div>{props.title}</div>}
    />
    <DropArea
      areaId='1'
      itemFasten={false}
      value + onChange || defaultValue ={[]}
      flexDirection='xx'
      ItemRender={(props) => <div>{props.type === 'a' ? <A /> : <B/>}</div>}
    >
  </DragDropWrapper> 
③具有删除项目功能的的垃圾箱DropArea  
  <DragDropWrapper >
    <DropArea areaId='dustbin' itemFasten> // itemFasten===true && 不填defaultValue和value(即默认defaultValue=[])
      <DropArea 
        areaId='0'
        itemFasten={true}
        value + onChange || defaultValue ={initValue}
      />
      <DropArea
        areaId='1'
        itemFasten={false}
        value + onChange || defaultValue ={[]}
      >
    </DropArea>
  </DragDropWrapper> 
*/