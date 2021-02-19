import {MoreThan, MoreThanOrEqual, LessThan, LessThanOrEqual, Between} from "typeorm";
import { format } from "date-fns";
import {Functions} from "../../../utils/functions";
import {BadRequestException} from "@nestjs/common";


export class DateFilters {

    makeNextMonthFirstDayDate = (month: number, year: number) => {
        year = month === 12 ? year + 1 : year;
        month = (month % 12) + 1;
        const monthStr = month.toString().length == 1 ? `0${month}` : month;
        return `${year}-${monthStr}-01`;
    }

    makeCurrentMonthFirstDayDate = (month: number, year: number) => {
        return `${year}-${month}-01`;
    }

    validateFilters = (month: number, year: number) => {
        if(Functions.isEmptyValue(month) && Functions.isEmptyValue(year))
            return {};
        else if(!Functions.isEmptyValue(month) && !Functions.isEmptyValue(year))
            return {month, year};
        else
            throw new BadRequestException(DateFilterErrorMessages.MONTH_YEAR_REQUIRED);
    }

    makeLEDateCondition = (month: number, year: number, alias?: string) => {
        const fullDate = new Date(this.makeNextMonthFirstDayDate(month, year));
        return { createdDate: LessThanDate(fullDate, EDateType.Datetime) }
    }

    // makeWithinCondition = (month: number, year: number, alias?: string) => {
    //     const currentMonthFirstDay = this.makeCurrentMonthFirstDayDate(month, year);
    //     const nextMonthFirstDay = this.makeNextMonthFirstDayDate(month, year);
    //     const fullDate = new Date(this.makeNextMonthFirstDayDate(month, year));
    //     return { createdDate: LessThanDate(fullDate, EDateType.Datetime) }
    // }


    applyLEDateFilter = (month: number, year: number, alias?: string) => {
        let condition = {};
        let fullDate = '';
        let hasFilter = false;
        const filter = this.validateFilters(month, year);

        if(filter.hasOwnProperty('month') ) {
            condition = this.makeLEDateCondition(filter.month, filter.year);
            fullDate = this.makeNextMonthFirstDayDate(filter.month, filter.year);
            hasFilter = true;
        }

        return {condition, fullDate, hasFilter};
    }


    applyWithinMonthDateFilter = (month: number, year: number, alias?: string) => {
        let startDate: Date = new Date();
        let endDate: Date = new Date();
        let hasFilter = false;
        const filter = this.validateFilters(month, year);

        if(filter.hasOwnProperty('month') ) {
            startDate = new Date(this.makeCurrentMonthFirstDayDate(filter.month, filter.year));
            endDate = new Date(this.makeNextMonthFirstDayDate(filter.month, filter.year));
            hasFilter = true;
        }

        return {startDate, endDate, hasFilter};
    }
}


enum DateFilterErrorMessages {
    MONTH_YEAR_REQUIRED = 'Enter values for month and year of leave both empty'
}

enum EDateType {
    Date = "yyyy-MM-DD",
    Datetime = "yyyy-MM-dd kk:mm:ss.SSS"
};

const MoreThanDate = (date: Date, type: EDateType) => MoreThan(format(date, type));
const MoreThanOrEqualDate = (date: Date, type: EDateType) => MoreThanOrEqual(format(date, type));
const LessThanDate = (date: Date, type: EDateType) => LessThan(format(date, type));
const LessThanOrEqualDate = (date: Date, type: EDateType) => LessThanOrEqual(format(date, type));
const BetweenDate = (dateStart: Date, dateEnd: Date, type: EDateType) => {
    Between(format(dateStart, type), format(dateEnd, type));
};

export {
    MoreThanDate,
    MoreThanOrEqualDate,
    LessThanDate,
    LessThanOrEqualDate,
    EDateType,
    DateFilterErrorMessages
};