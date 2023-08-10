import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['user', 'bot'],
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

// If the model Chat exists, use it. Otherwise, compile it.
const Chat = mongoose.models.Chat || mongoose.model('Chat', chatSchema);

export default Chat;
