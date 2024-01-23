type LocalUser = {
  username: string;
  id: string;
};

declare namespace Express {
  export interface Request {
    user: LocalUser;
  }
}
