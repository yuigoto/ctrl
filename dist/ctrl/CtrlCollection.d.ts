import { Ctrl } from "./Ctrl";
import { CtrlProps } from "../core/Types";
export declare class CtrlCollection extends Array {
    name: string;
    constructor(name?: string);
    add(controlArgs: Ctrl | CtrlCollection | CtrlProps | CtrlProps[]): CtrlCollection | null;
    get(name: string, subCollection?: string): Ctrl | boolean;
    getValue(name: string, subCollection?: string): any | undefined;
    set(control: Ctrl, subCollection?: string): CtrlCollection;
    setValue(name: string, value: any, subCollection?: string): CtrlCollection;
    remove(name: string, subCollection?: string): CtrlCollection;
    validate(): boolean;
    invalidate(name: string, message: string, subCollection?: string): CtrlCollection;
    invalidateAll(): CtrlCollection;
    toObject(useAlias?: boolean): object;
    toJSON(useAlias?: boolean): object;
    toString(): string;
}
