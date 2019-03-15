/* data-driven 只支持水平或者竖直单向排列的支持任意数量列表的富有动效的的DND组件, 支持任意宽高的自定义item,
1.导入 import { DragDropWrapper, SortableList } from '../components/SortableList'

2.使用顺序: 
  〇DragDropWrapper只能在外层存在一个。// 这是一个纯粹处理数据的组件，布局无关.
  ①将所有SortableList嵌套在DragDropWrapper中.
  ②SortableList可以任意叠加嵌套并且可以在内渲染任意子组件，排序在末尾item之后.
  <DragDropWrapper className={xxx} style={xxx} > DragDropWrapper只接受而且必须接受data和onChange两个属性
    <SortableList listId='0'>
      <SortableList listId='1'>{children}</SortableList>
    </SortableList>
    <SortableList listId='2'/>
  </DragDropWrapper> 
3.数据绑定
  所有DragDropWrapper和SortableList都必须绑定同一个data对象都写上同样的onChange={newData => setData(newData)}事件
  如:
  const [data, setDada] = useState(initData)
  onChange = newData => setData(newData);
  <DragDropWrapper data={data} onChange={onChange} > DragDropWrapper接受className和style两个属性
    <SortableList listId='0' data={data} onChange={onChange} />
    <SortableList listId='1' data={data} onChange={onChange} />
  </DragDropWrapper> 
4.data数据格式 
// 组件内部在data对象中使用了下面四个字段做信息传递， 使用时不用设置他们的值， 这四个字段理应是只读的，使用过程中也不应改变其值。
  isDragging: 代表当前DragDropWrapper下是否由项目正在拖拽
  draggedItemIndex: 代表当前正在被拖拽项目位于其所在listValue的索引
  selectedList: 代表当前正在被拖拽项目所在list的ID
  selectedItems: 代表当前所有被选中的项目
  使用中可以获取这四个值组合得到一些额外信息，isDragging && listId === selectedList即代表其内正有项目被拖拽的列表

  data = { // 使用过程中只需要构造data中的value字段即可.
    value: { // value中的字段键名与SortableList中的listId属性对应， SortableList内部会根据其listId属性寻找data对象中的value里对应的值
      listId1: [{title: xxx}, {title: xxx}]
      listId2: [{type: xxx}, {type: xxx}]
    }
  }

4.SortableList 属性
  <SortableList
    className={xxx}
    style={xxx}
    listId={string} // 必须要有的区分每个SortableList的唯一字符串标识
    data={object} // 所有SortableList和DragDropWrapper统一的数据对象
    onChange={newValue => setValue(newValue)} // data变化时的回调函数
    ItemRender={anything can be render(OwnItem)} // 任何可以被渲染的元素 自定义被渲染的组件
    direction='vertical' || 'horizontal'; // 排列方向 默认为vertical
    multiDrag={bool} // 该列表是否可以多选, 影响性能 默认为false
    keyword={string} // 当前列表对应的data-value-object中的唯一关键字， 默认为key

    ...customProps // 其他自定义的需要传递给自定义渲染组件的属性
  />
5.SortableList class
  内部已用flex布局把水平竖直向排列都居中，可以选择覆盖，但是不推荐这么做，react-beautiful-dnd的布局要求很严格,容易出问题。
  推荐只改布局无关的宽高， 背景色之类属性。

6.自定义组件示例  
const OwnItem = props => {
    // 自定义组件可以拿到以下这些属性
    const { connectDragRef, connectDrag, connectDragHandle, connectDragStyle, connectSelect, 
      data, index, listId, isSelected, isDragging, isDraggedItem, draggedItemsCount, ...otherCustomProps } = props;
    const { type, title } = data;

    connectDragRef, connectDrag, connectDragHandle为必填属性.
    请如下把connectDragRef和connectDrag属性放入自定义组件的最外层html元素标签中, 把connectDragHandle属性放入任意你想指定为拖拽手柄的html自定义元素中。
    当你在关联了connectDragRef和connectDrag的容器中使用内联style, 请如下图把connectDragStyle属性加进去。没用内联style可以无视它。
    connectSelect是个关联了点击事件的函数， 组件不开启多选拖拽时请无视它， 如果开启多选拖拽，请把它绑定在任意你想绑的地方。
    
    多选模式有这四个prop:
    isSelected: 代表当前item是否被选中。
    isDragging: 代表当前item是否处于假拖拽状态（被选中， 且被选中的其中一个item开始真正的拖拽）
    isDraggedItem: 代表当前item是不是真正正在被拖拽的那一个
    draggedItemsCount: 代表被假拖拽的Items的数量 
    单选模式只剩下isDragging一个prop:

    return (
      <div
        className={`${styles.item} ${isDragging ? styles.dragging : ''} ${isSelected ? styles.selected : ''}`}
        ref={connectDragRef}
        {...connectDrag}
        {...connectDragHandle}
        onClick={connectSelect}
        // style={{ background: xx, ...connectDragStyle}}
      >
      {data.title}
      {isDragging && isDraggedItem &&
          <div className={styles.count}>{draggedItemsCount}</div>
      }
      </div>
    );
  }

  // 带拖拽手柄的自定义组件示例
    const { connectDragRef, connectDrag, connectDragHandle, 
    const { title, type } = data; // DropArea中的value数组中的所有object即为这里的data
    return (
      <div className={styles.itemWrapper}
        ref={connectDragRef}
        {...connectDrag}
      >
        {title}
        <div className={styles.dragHandle} {...connectDragHandle} />)
      </div>    
    );
  }

7.用例
  const getItems = (count, listId) =>
    Array.from({ length: count }, (v, k) => k).map(k => ({
      key: `${listId}-item-${k}`,
      title: `${listId}-item ${k}`,
    }));

  const initListData = { 
    value: {
      list1: getItems(25, 'multiDrag25'),
      list2: getItems(25, 'singDrag25'),
    },
  }

  const [listData, setListData] = useState(initListData);
  const direction = 'vertical'; // vertical horizontal
  const onListDataChange = newData => setListData(newData);
  const { isDragging, draggedItemIndex, selectedList, selectedItems } = listData;

  单列表:
    <DragDropWrapper data={listData} onChange={onListDataChange} >
      <SortableList
        className={`${styles.list} ${direction === 'vertical' ? styles.vertical : styles.horizontal} ${isDragging && selectedList === 'list1' ? styles.dragging : ''}`}
        listId='list1'
        data={listData}
        onChange={onListDataChange}
        ItemRender={Item}
        direction={direction}
        multiDrag={true || false}
      />
    </DragDropWrapper>

  嵌套列表:
    <DragDropWrapper data={listData} onChange={onListDataChange} >
      <SortableList
        className={`${styles.list} ${direction === 'vertical' ? styles.vertical : styles.horizontal} ${isDragging && selectedList === 'list1' ? styles.dragging : ''}`}
        listId='list1'
        data={listData}
        onChange={onListDataChange}
        ItemRender={Item}
        direction={direction}
        multiDrag={true || false}
      >
        <SortableList
          className={`${styles.list} ${direction === 'vertical' ? styles.vertical : styles.horizontal} ${isDragging && selectedList === 'list1' ? styles.dragging : ''}`}
          listId='list2'
          data={listData}
          onChange={onListDataChange}
          ItemRender={Item}
          direction={direction}
          multiDrag={true || false}
        />
      </SortableList>
    </DragDropWrapper>    

  多列表:
    <DragDropWrapper data={listData} onChange={onListDataChange} >
      <SortableList
        className={`${styles.list} ${direction === 'vertical' ? styles.vertical : styles.horizontal} ${isDragging && selectedList === 'list1' ? styles.dragging : ''}`}
        listId='list1'
        data={listData}
        onChange={onListDataChange}
        ItemRender={Item}
        direction={direction}
        multiDrag={true || false}
      />
      <SortableList
        className={`${styles.list} ${direction === 'vertical' ? styles.vertical : styles.horizontal} ${isDragging && selectedList === 'list1' ? styles.dragging : ''}`}
        listId='list2'
        data={listData}
        onChange={onListDataChange}
        ItemRender={Item}
        direction={direction}
        multiDrag={true || false}
      />
      <SortableList
        className={`${styles.list} ${direction === 'vertical' ? styles.vertical : styles.horizontal} ${isDragging && selectedList === 'list1' ? styles.dragging : ''}`}
        listId='list3'
        data={listData}
        onChange={onListDataChange}
        ItemRender={Item}
        direction={direction}
        multiDrag={true || false}
      />        
    </DragDropWrapper>    
*/