// import {
//     registerDecorator,
//     ValidationOptions,
//     ValidatorConstraint,
//     ValidatorConstraintInterface,
//     ValidationArguments,
// } from 'class-validator';
// import {StockModel} from "../stock/domain/stock.model";
// import {Injectable} from "@nestjs/common";
//
// @Injectable()
// @ValidatorConstraint({ async: true })
// export class IsStockedAndEnoughConstraint implements ValidatorConstraintInterface {
//
//     constructor(
//         private stockModel: StockModel,
//     ) {}
//
//     validate(item: any, args: ValidationArguments) {
//         const productId = item['product'];
//         const batchNumber = item['batch_number'];
//         const hospital = item['hospital'];
//         const quantity = item['quantity'];
//
//         this.stockModel.findStock(productId, batchNumber, hospital)
//             .then(stock => {
//                 if(stock !== undefined) {
//
//                 }
//             })
//
//         return UserRepository.findOneByName(userName).then(user => {
//             if (user) return false;
//             return true;
//         });
//     }
// }
//
// export function IsStockedAndEnough(validationOptions?: ValidationOptions) {
//     return function (object: Object, propertyName: string) {
//         registerDecorator({
//             target: object.constructor,
//             propertyName: propertyName,
//             options: validationOptions,
//             constraints: [],
//             validator: IsUserAlreadyExistConstraint,
//         });
//     };
// }