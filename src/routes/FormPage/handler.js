import  { withHandlers, withState, lifecycle, pipe, withPropsOnChange } from '../../rehook';
import uniqueId from 'lodash/uniqueId';
import cloneDeep from 'lodash/cloneDeep';
import produce from 'immer';
import moment from 'moment';

const newItems = {
  SectionTitle: {
    type: 'SectionTitle',
    title: '',
    description: '',
    comment: null,
  }, Paragraph: {
    type: 'Paragraph',
    isRequired: false,
    title: '',
    description: null,
    comment: null,
    score: 0,
    calcScore: false,
    scoreRange: [0, 10],
  }, Radio: {
    type: 'Radio',
    title: '',
    isRequired: false,
    description: null,
    comment: null,
    inputValue: [],
    options: [{ id: uniqueId(), title: '', score: 0 }],
    cols: 1,
    score: 0,
    calcScore: false,
    scoreRange: [0, 10],
  }, Checkbox: {
    type: 'Checkbox',
    title: '',
    isRequired: false,
    description: null,
    comment: null,
    inputValue: [],
    options: [{ id: uniqueId(), title: '', score: 0 }],
    cols: 2,
    score: 0,
    calcScore: false,
    scoreRange: [0, 10],
  }, Answer: {
    type: 'Answer',
    isRequired: false,
    title: '',
    description: null,
    comment: null,
    inputValue: null,
    score: 0,
    calcScore: false,
    scoreRange: [0, 10],
  }, Time: {
    type: 'Time',
    isRequired: false,
    title: '',
    description: null,
    comment: null,
    timeType: 'startEndDate', //,date,time,dateTime 
    inputValue: [moment(new Date()).add(0, 'year').format("YYYY-MM-DD") ,moment(new Date()).add(0, 'year').format("YYYY-MM-DD")],
    score: 0,
    calcScore: false,
    scoreRange: [0, 10],
  },
}

const createNewItem = (itemType) => {
  const newItem = cloneDeep(newItems[itemType]);
  newItem.id = uniqueId();
  return newItem;
}

const createNewSection = () => {
  return {
    id: uniqueId(),
    showItemIndex: false,
    items: [
      createNewItem('SectionTitle'),
      createNewItem('Paragraph'),
      createNewItem('Radio'),
      createNewItem('Checkbox'),
      createNewItem('Answer'),
      createNewItem('Time'),
    ],
  };
}

const initialData = {
  title: '',
  sections: [
    {
      id: uniqueId(),
      showItemIndex: false,
      items: [
        createNewItem('SectionTitle'),
        createNewItem('Paragraph'),
        createNewItem('Radio'),
        createNewItem('Checkbox'),
        createNewItem('Answer'),
        createNewItem('Time'),
      ],
    },
  ],
};


const initPage = pipe(
  withState('data', 'updateData', ownProps => ownProps.data || initialData),
  withState('mode', 'setMode', ownProps => ownProps.mode || 'edit'),
  withState('showModal', 'setModal', false),
  withState('selectedItem', 'setSelectedItem', ownProps => ownProps.data.sections[0].items[0]),
  withHandlers({
    setData: ({ updateData }) => (prop, newPropData) => {
      updateData(produce(draftData => {
        draftData[prop] = newPropData
      }));
    },
    setSectionData: ({updateData, data }) => (sectionIndex, prop, newPropData) => {
      updateData(produce(draftData => {
        draftData.sections[sectionIndex][prop] = newPropData;
      }));
    },
    setItemData: ({ updateData, data }) => (sectionIndex, itemIndex, prop, newPropData) => {
      updateData(produce(draftData => {
        draftData.sections[sectionIndex].items[itemIndex][prop] = newPropData;
      }));
    },
    setItemType: ({ data, updateData }) => (sectionIndex, itemIndex, newType) => {
      const newItem = createNewItem(newType);
      newItem.id = data.sections[sectionIndex].items[itemIndex].id;
      updateData(produce(draftData => {
        draftData.sections[sectionIndex].items[itemIndex] = newItem;
      }));
    },
    findSelectedItem: ({ data, selectedItem }) => () => {
      for (let i = 0, len = data.sections.length; i < len; i += 1) {
        for (let j = 0, length = data.sections[i].items.length; j < length; j += 1) {
          if (data.sections[i].items[j].id === selectedItem.id) {
            return [i, j];
          }
        }
      }
      return [null, null]
    }
  }),
  withHandlers({
    addSection: ({ data, setSelectedItem, updateData }) => () => {
      const newSection = createNewSection();
      updateData(produce(draftData => {
        draftData.sections.push(newSection);
      }));
      setSelectedItem(newSection.items[0]);
    },
    deleteSection: ({ data, findSelectedItem, setSelectedItem, updateData }) => () => {
      const [targetSectionIndex] = findSelectedItem();
      updateData(produce(data, draftData => {
        draftData.sections.splice(targetSectionIndex, 1);
      }));
      setSelectedItem(data.sections[0].items[0]);
    },
    addItem: ({ data, findSelectedItem, setSelectedItem, updateData }) => () => {
      const [targetSectionIndex, selectedItemIndex] = findSelectedItem();
      const newItem = createNewItem('Radio');
      updateData(produce(data, draftData => {
        draftData.sections[targetSectionIndex].items.splice(selectedItemIndex + 1, 0, newItem);
      }));
      setSelectedItem(newItem);
    },
    deleteItem: ({ data, findSelectedItem, setSelectedItem, updateData }) => () => {
      const [targetSectionIndex, selectedItemIndex] = findSelectedItem();
      updateData(produce(data, draftData => {
        draftData.sections[targetSectionIndex].items.splice(selectedItemIndex, 1);
      }));
      setSelectedItem(data.sections[targetSectionIndex].items[0]);
    },
    cloneItem: ({ data, findSelectedItem, setSelectedItem, updateData }) => () => {
      const [targetSectionIndex, selectedItemIndex] = findSelectedItem();
      const newItem = cloneDeep(data.sections[targetSectionIndex].items[selectedItemIndex]);
      newItem.id = uniqueId();
      updateData(produce(data, draftData => {
        draftData.sections[targetSectionIndex].items.splice(selectedItemIndex + 1, 0, newItem);
      }));
      setSelectedItem(newItem);
    },
    reorderItems: ({ data, updateData }) => (sectionIndex, startItemIndex, endItemIndex) => {
      updateData(produce(data, draftData => {
        const [removed] = draftData.sections[sectionIndex].items.splice(startItemIndex, 1);
        draftData.sections[sectionIndex].items.splice(endItemIndex, 0, removed);
      }));
    },
  })
);

export default { initPage };
