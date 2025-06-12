export interface IEmail {
  to: string;
  subject: string;
  template: string;
  info: Record<string, any>;
}
