import { BaseCommand } from './BaseCommand';
import { Option } from './Option';
import { EALISNM, EARBLNK, ENOARGS } from './utils/errorCodes';

export class Command extends BaseCommand {
  public constructor(name: string | {}) {
    super();
    if (typeof name === 'string') this._name = name;
  }

  /**
   * Register a callback for the command.
   * @param fn
   */
  public action(fn: () => void): this {
    throw new Error('Method not implemented.');
  }

  /**
   * Set an alias for the command.
   * @param alias
   */
  public alias(alias?: string): this {
    let command = this;

    if (this._commands.length !== 0) {
      command = this._commands[this._commands.length - 1];
    }

    if (arguments.length === 0) throw ENOARGS;
    if (alias === '') throw EARBLNK;
    if (alias === this._name) throw EALISNM;

    if (alias && this._verbose) {
      console.log(`Alias ${alias}, set.`);
    }

    command._alias = alias;

    return this;
  }

  /**
   * Describe the command.
   * @param description
   */
  public description(description: string, argsDescription: string): this {
    if (arguments.length === 0) throw ENOARGS;
    if (description === '') throw EARBLNK;

    this._description = description;
    this._argsDescription = argsDescription;

    return this;
  }

  public help(callback?: (callback: any) => any): void {
    if (!callback) {
      callback = (passthrough) => passthrough;
    }
    process.stdout.write(callback(this._helpInformation()));
    this.emit('--help');
    process.exit();
  }

  public name(name: string): this {
    this._name = name;

    return this;
  }

  public option(flags: string, description?: string, fn?: () => void): this {
    throw new Error('Method not implemented.');
  }

  public options(options: {}) {
    throw new Error('Method not implemented.');
  }

  public subCommand(): this {
    throw new Error('Method not implemented.');
  }

  public usage(str?: string): string | this {
    const args = this._args.map((arg) => this._humanReadableArgumentName(arg));
    const usage = `[options] ${this._commands.length ? '[command]' : ''} ${
      this._args.length ? args.join(' ') : ''
    }`;
    if (arguments.length === 0) return this._usage || usage;

    return this;
  }
  /**
   * Make the command talkative.
   */
  public verbose(): this {
    this._verbose = true;

    return this;
  }
  /**
   * Set the command version.
   */
  public version(version: string): Command {
    if (arguments.length === 0) throw ENOARGS;
    this._version = version;
    const versionOption = new Option(
      '-v, --version',
      'return the command\'s version.',
      this._verbose,
    );
    this._versionOption = versionOption.long.substr(2) || 'version';
    this._options.push(versionOption);
    this.on('option:' + this._versionOption, () => {
      process.stdout.write(`${this._name} v${this._version}` + '\n');
      process.exitCode = 0;
    });

    return this;
  }

  /**
   * ! Strictly for testing private internals
   */
  public get getAlias(): string {
    return this._alias;
  }
  /**
   * ! Strictly for testing private internals
   */
  public get getName(): string {
    return this._name;
  }
  /**
   * ! Strictly for testing private internals
   */
  public get getVersion(): string {
    return this._version;
  }
}

export function xcommand(name: string): Command {
  return new Command(name);
}
