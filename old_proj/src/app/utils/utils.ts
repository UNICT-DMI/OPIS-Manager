export function getConf() {
  let conf;
  try {
    conf = require('../../assets/config.json');
  } catch {
    conf = require('../../assets/default.json');
  }
  return conf;
}
