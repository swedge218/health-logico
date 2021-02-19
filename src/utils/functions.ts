export class Functions {

    static isEmptyValue(val: any): boolean {
        return ['null', 0, "0", null, undefined].includes(val);
    }


}