export class EntityFilters {

    applyProductFilter = (productId: number) => {
        return { productId };
    }

    applyHospitalFilter = (hospitalId: number) => {
        return { hospitalId };
    }
}