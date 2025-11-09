class Notification {
  constructor(id, data) {
    this.id = id;
    this.type = data.type; // 'new_news', 'news_published', 'status_changed'
    this.title = data.title;
    this.message = data.message;
    this.userId = data.userId; // Usuario destinatario
    this.relatedId = data.relatedId; // ID de la noticia relacionada
    this.read = data.read || false;
    this.createdAt = data.createdAt || new Date();
  }

  static fromFirebase(doc) {
    return new Notification(doc.id, doc.data());
  }

  markAsRead() {
    this.read = true;
  }
}

export default Notification;