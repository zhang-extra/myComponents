// 人员
declare type User = {
  id: number,
  name: string,
  appId: number,
}

// 消息
declare type Message = {
  id: number,
  text: string,
}

// 文件
declare type File = {
  id: number,
  name: string,
  size: string,
}

// 聊天室
declare type Room = {
  id: number,
  name: string,
  desciption: string,
  users:Array<User>
  messages:Array<Message>
  files:Array<File>
};


declare type Rooms = Array<Room>

