import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';
import {ClientModel} from "../client/domain/client.model";
import {Injectable} from "@nestjs/common";

@Injectable()
@ValidatorConstraint({ async: true })
export class IsSecretExistsConstraint implements ValidatorConstraintInterface {
    constructor(
        private clientModel: ClientModel,
    ) {}

    validate(secretKey: any, args: ValidationArguments) {
        console.log('Auth validating');
        return this.clientModel.findBySecret(secretKey)
            .then((client) => {
                if(!client) { return false };
                return true;
            })
    }
}

export function IsSecretExists(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        console.log('Auth validating 1');
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsSecretExistsConstraint,
        });
    };
}