export interface UserPresence {
  userId: string;
  userName: string;
  lastSeen: number;
  color: string;
}

export interface Message {
  id: string;
  user: {
    id: string;
    username: string;
  };
  text: string;
  timestamp: string;
  isSystem?: boolean;
  isOwn?: boolean;
  reactions?: Reaction[];
  replyTo?: ReplyMessage;
}

export interface Reaction {
  emoji: string;
  userId: string;
  userName: string;
}

export interface ReplyMessage {
  id: string;
  user: {
    id: string;
    username: string;
  };
  text: string;
}

export interface MessageInputProps {
  onSend: (text: string, replyTo?: ReplyMessage) => void;
  onTyping: (isTyping: boolean) => void;
  replyMessage?: ReplyMessage;
  onCancelReply?: () => void;
  users: UserPresence[];
}
