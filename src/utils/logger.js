const isProduction = process.env.NODE_ENV === "production";

// Logger with different levels (info, warn, error)
class Logger {
  static log(message) {
    console.log(message);
  }

  static info(message) {
    console.info(`INFO: ${message}`);
  }

  static warn(message) {
    console.warn(`WARNING: ${message}`);
  }

  static error(message) {
    console.error(`ERROR: ${message}`);
  }
}

export default Logger;
