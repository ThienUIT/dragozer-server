class ErrorResponse extends Error {
  statusCode: number;
  messageWithField: string | null;

  constructor(message: string, statusCode: number, messageWithField?: string) {
    super(message);
    this.statusCode = statusCode;
    this.messageWithField = messageWithField || null;
  }
}
module.exports = ErrorResponse;
