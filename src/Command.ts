interface ICommand {
  getName: string
  alias?: string
  description?: string
}

export abstract class Command implements ICommand {
  private _command: ICommand

  constructor(command: ICommand) {
    this._command = command
  }

  abstract execute(args: string[]): void

  public get getName(): string {
    return this._command.getName
  }

  private _parseArgs(args: string[]) {
    console.log(args)
  }
}
