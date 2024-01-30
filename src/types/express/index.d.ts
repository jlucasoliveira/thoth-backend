type CustomUser = {
  username: string;
  id: string;
};

export type LocalUser = CustomUser;

declare global {
  namespace Express {
    interface User extends CustomUser {}
  }
}
