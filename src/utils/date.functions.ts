export class DateFunctions {

    static formatToDBDate = (d: Date) => {
        return [
            d.getFullYear(),
            (d.getMonth() + 1).toString().padStart(2, '0'),
            d.getDate().toString().padStart(2, '0')
        ].join('-');
    }

    static monthNumberToString = (monthNumber: number) => {
        switch (monthNumber) {
            case 1: return 'January';
            case 1: return 'February';
            case 1: return 'March';
            case 1: return 'April';
            case 1: return 'May';
            case 1: return 'June';
            case 1: return 'July';
            case 1: return 'August';
            case 1: return 'September';
            case 1: return 'October';
            case 1: return 'November';
            case 1: return 'December';
            default: return '';
        }
    }
}