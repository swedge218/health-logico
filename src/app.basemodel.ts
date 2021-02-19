import {PaginationHelper} from "./utils/pagination.helper";
import {DEFAULT_PAGE_LIMIT, DEFAULT_PAGE_NUMBER} from "./utils/constants/pagination.constants";

export class BaseModel {

    static makePainationData(items: any, options: any, count: number) {
        return PaginationHelper.makePaginationData(items, options, count);
    }

    makeFindAllOptions(options): any {
        const page: number = options.page !== undefined ? Number(options.page) : DEFAULT_PAGE_NUMBER;
        const limit: number = options.limit !== undefined ? Number(options.limit) : DEFAULT_PAGE_LIMIT;
        return {page, limit};
    }
}