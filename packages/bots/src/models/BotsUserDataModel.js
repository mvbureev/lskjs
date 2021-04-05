import Model from '@lskjs/db/Model';

export default class BotsUserDataModel extends Model {
  static schema = {
    userId: {
      type: Model.Types.ObjectId,
      required: true,
    },
    telegramChatId: String,
    plugin: String,
    type: {
      type: String,
      required: true,
    },
    count: Number,
    meta: { type: Object },
    info: { type: Object },
    private: { type: Object },
  };

  static options = {
    model: 'BotsUserData',
    collection: 'bots_user_data',
    timestamps: true,
  };
}