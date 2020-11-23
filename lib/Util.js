module.exports = {
  EscapeRegex(str) {
    return str ? str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') : '';
  },
}
