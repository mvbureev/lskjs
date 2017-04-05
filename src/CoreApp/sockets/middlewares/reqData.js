export default () => {
  return function (socket, next) {
    // console.log('socket.middleware reqData');
    const { query } = socket.handshake;
    const req = socket.request;
    if (!req.query) {
      req.query = {};
    }
    socket.data = {};
    Object.assign(socket.data, query, req.query);
    return next();
  };
};
