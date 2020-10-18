export default class ErrorResponse extends Error {
  message: string;
  statusCode: number;
  messageWithField: string | null;

  constructor(message: string, statusCode: number, messageWithField?: string) {
    super(message);
    this.statusCode = statusCode;
    this.messageWithField = messageWithField || null;
    this.message = message;
  }
}
