module.exports = function () {
  // ...
  return {
   // ...
    resolve: {
      // ...
      fallback: {
        // 👇️👇️👇️ add this 👇️👇️👇️
        "fs": false,
        "os": false,
        "path": false,
      }
    }
  }
}