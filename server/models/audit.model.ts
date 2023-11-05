import IUser from './user.model.js';

export default interface IAudit {
  createdBy: IUser;
  createdAt: Date;
}
