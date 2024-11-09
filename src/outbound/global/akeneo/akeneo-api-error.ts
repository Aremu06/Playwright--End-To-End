/**
 * Extends standard error by content of body to add received API error message, if existing
 */
export class AkeneoApiError extends Error {
  /**
   * @param msg error message
   * @param url the API curl called by the client
   * @param data body content as text (can be obtained by "await response.text()")
   */
  constructor(
    msg: string,
    private url: string,
    private data: string,
  ) {
    msg += ` (URL: ${url}`;

    // Try to get error message from json body
    try {
      const json = JSON.parse(data);
      if (typeof json === "object" && json !== null && json.message) {
        msg += `, Message: ${json.message}`;
      }
    } catch (e) {
      // Ignore
    }

    msg += ")";

    super(msg);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, AkeneoApiError.prototype);
  }

  getData() {
    return this.data;
  }
}
