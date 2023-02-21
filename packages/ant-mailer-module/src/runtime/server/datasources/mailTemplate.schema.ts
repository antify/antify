export interface MailTemplate {
  id: string;
  templateId: string;
  title: string;
  content?: string;
  // TODO:: Rly a date? Its a timestamp right?
  createdAt: Date;
  // TODO:: Rly a date? Its a timestamp right?
  updatedAt: Date;
}
