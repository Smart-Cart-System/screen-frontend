// WebSocket service for real-time cart updates
type MessageHandler = (message: CartWebSocketMessage) => void;

export interface CartWebSocketMessage {
  type: 'cart-updated' | 'item-read' | 'connection-established' | 'weight increased' | 'weight decreased';
  data?: number | string | { barcode: number } | any;
  Message?: string;
}

export class CartWebSocket {
  private socket: WebSocket | null = null;
  private messageHandlers: MessageHandler[] = [];
  private reconnectInterval: number = 3000; // Reconnect every 3 seconds
  private reconnectTimeout: number | null = null;
  
  constructor(private sessionId: number) {}

  // Add getter for messageHandlers
  get handlers(): MessageHandler[] {
    return this.messageHandlers;
  }

  connect(): void {
    if (this.socket?.readyState === WebSocket.OPEN) return;
    
    try {
      const wsUrl = `wss://api.duckycart.me/ws/${this.sessionId}`;
      console.log(`Connecting to WebSocket at: ${wsUrl}`);
      this.socket = new WebSocket(wsUrl);
      
      this.socket.onopen = () => {
        console.log(`WebSocket connected for session ${this.sessionId}`);
        if (this.reconnectTimeout) {
          clearTimeout(this.reconnectTimeout);
          this.reconnectTimeout = null;
        }
      };
      
      this.socket.onmessage = (event) => {
        try {
          console.log('Raw WebSocket message:', event.data);
          const parsedMessage = JSON.parse(event.data) as CartWebSocketMessage;
          console.log('Parsed WebSocket message:', parsedMessage);
          
          // Handle connection established message
          if (parsedMessage.Message === "Web socket connection established") {
            console.log('WebSocket connection established successfully');
            parsedMessage.type = 'connection-established';
          }
          
          // Log handlers count before calling
          console.log(`Notifying ${this.messageHandlers.length} message handlers`);
          
          // Notify all handlers about the new message - use setTimeout to ensure async execution
          this.messageHandlers.forEach(handler => {
            try {
              // Wrap handler call in setTimeout to ensure it runs in next event loop tick
              // This prevents any blocking behavior
              setTimeout(() => {
                console.log('Calling handler with message:', parsedMessage);
                handler(parsedMessage);
              }, 0);
            } catch (error) {
              console.error('Error in message handler:', error);
            }
          });
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
      
      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
      
      this.socket.onclose = (event) => {
        console.log(`WebSocket connection closed with code: ${event.code}, reason: ${event.reason}`);
        this.scheduleReconnect();
      };
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
      this.scheduleReconnect();
    }
  }

  private scheduleReconnect(): void {
    if (!this.reconnectTimeout) {
      this.reconnectTimeout = setTimeout(() => {
        console.log(`Attempting to reconnect WebSocket for session ${this.sessionId}...`);
        this.connect();
      }, this.reconnectInterval);
    }
  }

  addMessageHandler(handler: MessageHandler): void {
    this.messageHandlers.push(handler);
    console.log(`Added message handler, total handlers: ${this.messageHandlers.length}`);
  }

  removeMessageHandler(handler: MessageHandler): void {
    const previousLength = this.messageHandlers.length;
    this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
    console.log(`Removed message handler, before: ${previousLength}, after: ${this.messageHandlers.length}`);
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    
    this.messageHandlers = [];
  }
}