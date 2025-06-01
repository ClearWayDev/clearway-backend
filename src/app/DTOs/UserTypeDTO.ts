// Adjust the path as needed

import UserData from "../../core/entities/UserData";
import UserType from "../../core/entities/UserType";

export default class UserDataDTO extends UserData {
  constructor(uid: string, userType: UserType, fcmToken: string) {
    super(uid, userType);
    fcmToken = fcmToken;
  }
}
