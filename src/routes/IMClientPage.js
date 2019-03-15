import React from 'react';
import { Input, Button } from 'antd';
import faker from 'faker';
import { withHandlers, withState, withProps, pipe, lifecycle, mapProps } from '../rehook';
import Socket from '../lib/Socket';


const socket = new Socket('', { id: 1, appId: 'default' });


const IMClient = pipe(
  withState('rooms', 'setRooms', []),// room列表
  withState('room', 'setRoom'),// 设置当前room
  withState('text', 'setText'),  // 发送文本
  withHandlers({
    onError: () => (errors) => {
      console.log(errors);
    },
    onNewMessage: () => (message) => {
      console.log('onMessageReceived', message);
    }
  }),
  lifecycle({
    componentDidMount() {
      const { setRooms, onNewMessage, onError } = this.props;
      socket.listen({ setRooms, onNewMessage, onError })
    }
  }),
  withHandlers({
    onTextChange: ({ setText }) => (e) => {
      setText(e.target.value)
    },
    send: ({ room, text, setText }) => () => {
      if (room) {
        socket.sendMessage({ roomId: room.id, text });
        setText('');
      }
    },
    createRoom: ({ rooms, setRooms }) => () => {
      socket.createRoom({ name: faker.name.findName(), private: true }, (room) => {
        rooms.push(room);
        setRooms(rooms);
      });
    },
    switchRoom: ({ setRoom }) => (room) => {
      socket.getMessages({ roomId: room.id }, (data) => {
        room.messages = data.rows;
        room.total = data.pagination.rowCount;
        setRoom(room);
      });
    }
  })
);

function IMClientPage({ text, onTextChange, send, rooms, room, createRoom, switchRoom }) {
  const { messages } = room || [];
  return (
    <div>
      {      
        rooms && rooms.map((room) => {
          return <div key={room.id} onClick={() => {
            switchRoom(room);
          }} >{room.name}</div>
        })
      }
      {
        messages && messages.map((message) => {
          return <div key={message.id}>{message.text}</div>
        })
      }
      <Input value={text} onChange={onTextChange}>
      </Input>
      <Button onClick={send}>发送</Button>
      <Button onClick={createRoom}>创建Room</Button>
    </div>
  );
}

export default pipe(IMClient, IMClientPage);
