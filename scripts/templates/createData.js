const lskjs = [
  'apiquery',
  'apm',
  'auth',
  'autobind',
  'billing',
  'bots',
  'bots-base',
  'bots-plugin',
  'bots-plugin-debug',
  'bots-plugin-menu',
  'bots-plugin-notify',
  'bots-plugin-polundra',
  'bots-plugin-portal',
  'bots-provider',
  'bots-provider-clubhouse',
  'bots-provider-discord',
  'bots-provider-instagram',
  'bots-provider-slack',
  'bots-provider-telegram',
  'bots-provider-twitter',
  'bots-provider-vk',
  'bots-provider-whatsapp',
  'bots-router',
  'build-locales',
  'bunyan',
  'config',
  'db',
  'elastic',
  'event',
  'getspreadsheet',
  'grant',
  'i18',
  'kafka',
  'launcher',
  'linkall',
  'log',
  'log2',
  'mailer',
  'mobx',
  'module',
  'permit',
  'proxy',
  'rabbit',
  'reactapp',
  'rlog',
  'scylla',
  'sequelize',
  'server',
  'server-api',
  'sh',
  'sms',
  'tbot',
  'uapp',
  'upload',
  'utils',
  'worker',
];

const ux = [
  'add-to-calendar',
  'article',
  'avatar',
  'button',
  'button2',
  'chat',
  'cookie-consent',
  'css',
  'dash',
  'dashboard',
  'dev',
  'docs',
  'downloads',
  'extra',
  'flag',
  'form',
  'grid',
  'gridtable',
  'image',
  'landing',
  'link',
  'list',
  'modal',
  'navbar',
  'notification',
  'page',
  'progress',
  'scroll',
  'slide',
  't',
  'tag',
  'theme',
  'typo',
  'ui',
  'ui2',
];

const data = {
  packages: [
    ...lskjs.map((title) => ({
      name: `@lskjs/${title}`,
      title,
      url: `packages/${title}`,
      description: require(`${process.cwd()}/packages/${title}/package.json`).description,
    })),
    ...ux.map((title) => ({
      name: `@lskjs/${title}`,
      title,
      url: `packages/${title}`,
      description: require(`${process.cwd()}/../lskjs-ux/packages/${title}/package.json`).description,
    })),
  ],
};
const json = JSON.stringify(data, null, 2);

require('fs').writeFileSync('scripts/templates/data.js', `module.exports = ${json};`);