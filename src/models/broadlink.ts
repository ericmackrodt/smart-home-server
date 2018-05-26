export interface ILearnedCommand {
  command?: string;
  secret: string;
  mac: string | boolean;
  ip: string | boolean;
  data: string;
  sequence?: string[];
}
