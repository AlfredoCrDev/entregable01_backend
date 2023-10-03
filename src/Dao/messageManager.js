const { messageModel } = require("../models/messages.model")

class MessageManager {
  constructor() {
    this.messages = [];
  }

  async getMessage(){
    try {
      const messages = await messageModel.find()
      return messages;      
    } catch (error) {
      console.log("Error al tratar de obtener los mensajes", error);
    }
  }

  async addMessage(mensajeParaAgregar){
    try {
      const newMessage = await messageModel.create(mensajeParaAgregar)
      console.log(newMessage);
    } catch (error) {
      console.log("Hubo un error al tratar de enviar el mensaje");
    }
  }
}

module.exports = MessageManager;