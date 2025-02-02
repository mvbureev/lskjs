export const toHumanDate = (date) =>
  `${new Date(date).toISOString().substr(0, 10)} ${new Date().toISOString().substr(11, 8)}`;

export const getComment = ({ date = new Date(), name, url } = {}) =>
  `
Source        : ${url}
Date          : ${toHumanDate(date)}
Filename      : ${name}

Auto generated by http://npmjs.com/package/@lskjs/getspreadsheet
`.trim();

export default getComment;
