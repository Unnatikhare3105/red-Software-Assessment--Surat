export {};

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        uuid: string;
        email: string;
        role: string;
      };
      file?: string;
      token?: string;
      tokenExp?: number;
    }
    
  }
}