export class AppError extends Error {
  constructor(code, message) {
    super(message);
    this.statusCode = code;
  }
}
export const idProp = { id: { type: "string" } };
export const idParam = {
  type: "object",
  properties: { ...idProp },
};
