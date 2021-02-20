// ts-ignore
import forEach from 'lodash/forEach';
import set from 'lodash/set';
import { Schema } from 'mongoose';

import { IModel } from './types';

export class Model implements IModel {
  __model = true;
  static Schema = Schema;
  static Types = Schema.Types;
  static defaultOptions: { [key: string]: any } = {
    timestamps: true,
  };
  // overridable
  static options: { [key: string]: any } = {};

  setState(state = {}) {
    forEach(state, (value: any, key: any) => {
      set(this, key, value);
      // ts-ignore
      this.markModified(key);
    });
  }
}

export default Model;