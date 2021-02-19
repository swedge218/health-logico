import {PermissionsEnum} from "../../domain/enums/permissions.enum";
import {PermissionCategoriesEnum} from "./permission-categories.enum";


export const permissionSeeds = [

    // AUTH
    {
        name: PermissionsEnum.VIEW_AUTH,
        description: 'View Authentication',
        category: PermissionCategoriesEnum.AUTH,
        sortOrder: 0
    },

    // ADJUSTMENT
    {
        name: PermissionsEnum.CREATE_ADJUSTMENT,
        description: 'Create Adjustment',
        category: PermissionCategoriesEnum.ADJUSTMENT,
        sortOrder: 0
    },
    {
        name: PermissionsEnum.VIEW_ADJUSTMENT,
        description: 'View Adjustment',
        category: PermissionCategoriesEnum.ADJUSTMENT,
        sortOrder: 1
    },

    // PERMISSIONS
    {
        name: PermissionsEnum.ADD_PERMISSIONS,
        description: 'Add Permissions',
        category: PermissionCategoriesEnum.PERMISSION,
        sortOrder: 0
    },
    {
        name: PermissionsEnum.EDIT_PERMISSIONS,
        description: 'Edit Permissions',
        category: PermissionCategoriesEnum.PERMISSION,
        sortOrder: 1
    },
    {
        name: PermissionsEnum.DELETE_PERMISSIONS,
        description: 'Delete Permissions',
        category: PermissionCategoriesEnum.PERMISSION,
        sortOrder: 2
    },
    {
        name: PermissionsEnum.VIEW_PERMISSIONS,
        description: 'View Permissions',
        category: PermissionCategoriesEnum.PERMISSION,
        sortOrder: 3
    },

    // CANCER STAGE
    {
        name: PermissionsEnum.CREATE_CANCER_STAGE,
        description: 'Create Cancer Stage',
        category: PermissionCategoriesEnum.CANCER_STAGE,
        sortOrder: 0
    },
    {
        name: PermissionsEnum.UPDATE_CANCER_STAGE,
        description: 'Update Cancer Stage',
        category: PermissionCategoriesEnum.CANCER_STAGE,
        sortOrder: 1
    },
    {
        name: PermissionsEnum.VIEW_CANCER_STAGE,
        description: 'View Cancer Stage',
        category: PermissionCategoriesEnum.CANCER_STAGE,
        sortOrder: 2
    },
    {
        name: PermissionsEnum.DELETE_CANCER_STAGE,
        description: 'Delete Cancer Stage',
        category: PermissionCategoriesEnum.CANCER_STAGE,
        sortOrder: 3
    },


    // CANCER TYPE
    {
        name: PermissionsEnum.CREATE_CANCER_TYPE,
        description: 'Create Cancer Type',
        category: PermissionCategoriesEnum.CANCER_TYPE,
        sortOrder: 0
    },
    {
        name: PermissionsEnum.UPDATE_CANCER_TYPE,
        description: 'Update Cancer Type',
        category: PermissionCategoriesEnum.CANCER_TYPE,
        sortOrder: 1
    },
    {
        name: PermissionsEnum.VIEW_CANCER_TYPE,
        description: 'View Cancer Type',
        category: PermissionCategoriesEnum.CANCER_TYPE,
        sortOrder: 2
    },
    {
        name: PermissionsEnum.DELETE_CANCER_TYPE,
        description: 'Delete Cancer Type',
        category: PermissionCategoriesEnum.CANCER_TYPE,
        sortOrder: 3
    },

    // DELIVERY STATUS
    {
        name: PermissionsEnum.CREATE_DELIVERY_STATUS,
        description: 'Create Delivery Status',
        category: PermissionCategoriesEnum.DELIVERY_STATUS,
        sortOrder: 0
    },
    {
        name: PermissionsEnum.UPDATE_DELIVERY_STATUS,
        description: 'Update Delivery Status',
        category: PermissionCategoriesEnum.DELIVERY_STATUS,
        sortOrder: 1
    },
    {
        name: PermissionsEnum.VIEW_DELIVERY_STATUS,
        description: 'View Delivery Status',
        category: PermissionCategoriesEnum.DELIVERY_STATUS,
        sortOrder: 2
    },
    {
        name: PermissionsEnum.DELETE_DELIVERY_STATUS,
        description: 'Delete Delivery Status',
        category: PermissionCategoriesEnum.DELIVERY_STATUS,
        sortOrder: 3
    },

    // HOSPITAL
    {
        name: PermissionsEnum.CREATE_HOSPITAL,
        description: 'Create Hospital',
        category: PermissionCategoriesEnum.HOSPITAL,
        sortOrder: 0
    },
    {
        name: PermissionsEnum.UPDATE_HOSPITAL,
        description: 'Update Hospital',
        category: PermissionCategoriesEnum.HOSPITAL,
        sortOrder: 1
    },
    {
        name: PermissionsEnum.VIEW_HOSPITAL,
        description: 'View Hospital',
        category: PermissionCategoriesEnum.HOSPITAL,
        sortOrder: 2
    },
    {
        name: PermissionsEnum.DELETE_HOSPITAL,
        description: 'Delete Hospital',
        category: PermissionCategoriesEnum.HOSPITAL,
        sortOrder: 3
    },

    // INVOICE
    {
        name: PermissionsEnum.CREATE_INVOICE,
        description: 'Create Invoice',
        category: PermissionCategoriesEnum.INVOICE,
        sortOrder: 0
    },
    {
        name: PermissionsEnum.UPDATE_INVOICE,
        description: 'Update Invoice',
        category: PermissionCategoriesEnum.INVOICE,
        sortOrder: 1
    },
    {
        name: PermissionsEnum.VIEW_INVOICE,
        description: 'View Invoice',
        category: PermissionCategoriesEnum.INVOICE,
        sortOrder: 2
    },
    {
        name: PermissionsEnum.CANCEL_INVOICE,
        description: 'Cancel Invoice',
        category: PermissionCategoriesEnum.INVOICE,
        sortOrder: 3
    },

    // LOCATIONS
    {
        name: PermissionsEnum.VIEW_LOCATION,
        description: 'View Locations',
        category: PermissionCategoriesEnum.LOCATIONS,
        sortOrder: 0
    },

    // MANNUFACTURER
    {
        name: PermissionsEnum.CREATE_MANNUFACTURER,
        description: 'Create Manufacturer',
        category: PermissionCategoriesEnum.MANUFACTURER,
        sortOrder: 0
    },
    {
        name: PermissionsEnum.UPDATE_MANNUFACTURER,
        description: 'Update Manufacturer',
        category: PermissionCategoriesEnum.MANUFACTURER,
        sortOrder: 1
    },
    {
        name: PermissionsEnum.VIEW_MANNUFACTURER,
        description: 'View Manufacturer',
        category: PermissionCategoriesEnum.MANUFACTURER,
        sortOrder: 1
    },
    {
        name: PermissionsEnum.DELETE_MANNUFACTURER,
        description: 'Delete Manufacturer',
        category: PermissionCategoriesEnum.MANUFACTURER,
        sortOrder: 3
    },

    // ORDER
    {
        name: PermissionsEnum.CREATE_ORDER,
        description: 'Create Order',
        category: PermissionCategoriesEnum.ORDER,
        sortOrder: 0
    },
    {
        name: PermissionsEnum.UPDATE_ORDER,
        description: 'Update Order',
        category: PermissionCategoriesEnum.ORDER,
        sortOrder: 1
    },
    {
        name: PermissionsEnum.VIEW_ORDER,
        description: 'View Order',
        category: PermissionCategoriesEnum.ORDER,
        sortOrder: 2
    },
    {
        name: PermissionsEnum.CANCEL_ORDER,
        description: 'Cancel Order',
        category: PermissionCategoriesEnum.ORDER,
        sortOrder: 3
    },

    // ORDER STATUS
    {
        name: PermissionsEnum.CREATE_ORDER_STATUS,
        description: 'Create Order Status',
        category: PermissionCategoriesEnum.ORDER_STATUS,
        sortOrder: 0
    },
    {
        name: PermissionsEnum.UPDATE_ORDER_STATUS,
        description: 'Update Order Status',
        category: PermissionCategoriesEnum.ORDER_STATUS,
        sortOrder: 1
    },
    {
        name: PermissionsEnum.VIEW_ORDER_STATUS,
        description: 'View Order Status',
        category: PermissionCategoriesEnum.ORDER_STATUS,
        sortOrder: 2
    },
    {
        name: PermissionsEnum.DELETE_ORDER_STATUS,
        description: 'Delete Order Status',
        category: PermissionCategoriesEnum.ORDER_STATUS,
        sortOrder: 3
    },

    // PATIENT
    {
        name: PermissionsEnum.CREATE_PATIENT,
        description: 'Create Patient',
        category: PermissionCategoriesEnum.PATIENT,
        sortOrder: 0
    },
    {
        name: PermissionsEnum.UPDATE_PATIENT,
        description: 'Update Patient',
        category: PermissionCategoriesEnum.PATIENT,
        sortOrder: 1
    },
    {
        name: PermissionsEnum.VIEW_PATIENT,
        description: 'View Patient',
        category: PermissionCategoriesEnum.PATIENT,
        sortOrder: 2
    },
    {
        name: PermissionsEnum.DELETE_PATIENT,
        description: 'Delete Patient',
        category: PermissionCategoriesEnum.PATIENT,
        sortOrder: 3
    },

    // PAYMENT
    {
        name: PermissionsEnum.CREATE_PAYMENT,
        description: 'Create Payment',
        category: PermissionCategoriesEnum.PAYMENT,
        sortOrder: 0
    },
    {
        name: PermissionsEnum.UPDATE_PAYMENT,
        description: 'Update Payment',
        category: PermissionCategoriesEnum.PAYMENT,
        sortOrder: 1
    },
    {
        name: PermissionsEnum.VIEW_PAYMENT,
        description: 'View Payment',
        category: PermissionCategoriesEnum.PAYMENT,
        sortOrder: 2
    },

    // PRESCRIPTION
    {
        name: PermissionsEnum.CREATE_PRESCRIPTION,
        description: 'Create Prescription',
        category: PermissionCategoriesEnum.PRESCRIPTION,
        sortOrder: 0
    },
    {
        name: PermissionsEnum.UPDATE_PRESCRIPTION,
        description: 'Update Prescription',
        category: PermissionCategoriesEnum.PRESCRIPTION,
        sortOrder: 1
    },
    {
        name: PermissionsEnum.VIEW_PRESCRIPTION,
        description: 'View Prescription',
        category: PermissionCategoriesEnum.PRESCRIPTION,
        sortOrder: 2
    },
    {
        name: PermissionsEnum.DELETE_PRESCRIPTION,
        description: 'Delete Prescription',
        category: PermissionCategoriesEnum.PRESCRIPTION,
        sortOrder: 3
    },

    // PRICE
    {
        name: PermissionsEnum.UPDATE_PRICE,
        description: 'Update Price',
        category: PermissionCategoriesEnum.PRICE,
        sortOrder: 0
    },
    {
        name: PermissionsEnum.VIEW_PRICE,
        description: 'View Price',
        category: PermissionCategoriesEnum.PRICE,
        sortOrder: 1
    },


    // PROCUREMENT
    {
        name: PermissionsEnum.CREATE_PROCUREMENT,
        description: 'Create Procurement',
        category: PermissionCategoriesEnum.PROCUREMENT,
        sortOrder: 0
    },
    {
        name: PermissionsEnum.UPDATE_PROCUREMENT,
        description: 'Update Procurement',
        category: PermissionCategoriesEnum.PROCUREMENT,
        sortOrder: 1
    },
    {
        name: PermissionsEnum.VIEW_PROCUREMENT,
        description: 'View Procurement',
        category: PermissionCategoriesEnum.PROCUREMENT,
        sortOrder: 2
    },


    // PRODUCT
    {
        name: PermissionsEnum.CREATE_PRODUCT,
        description: 'Create Product',
        category: PermissionCategoriesEnum.PRODUCT,
        sortOrder: 0
    },
    {
        name: PermissionsEnum.UPDATE_PRODUCT,
        description: 'Update Product',
        category: PermissionCategoriesEnum.PRODUCT,
        sortOrder: 1
    },
    {
        name: PermissionsEnum.VIEW_PRODUCT,
        description: 'View Product',
        category: PermissionCategoriesEnum.PRODUCT,
        sortOrder: 2
    },
    {
        name: PermissionsEnum.DELETE_PRODUCT,
        description: 'Delete Product',
        category: PermissionCategoriesEnum.PRODUCT,
        sortOrder: 3
    },

    // ROLE
    {
        name: PermissionsEnum.CREATE_ROLE,
        description: 'Create Role',
        category: PermissionCategoriesEnum.ROLE,
        sortOrder: 0
    },
    {
        name: PermissionsEnum.UPDATE_ROLE,
        description: 'Update Role',
        category: PermissionCategoriesEnum.ROLE,
        sortOrder: 1
    },
    {
        name: PermissionsEnum.VIEW_ROLE,
        description: 'View Role',
        category: PermissionCategoriesEnum.ROLE,
        sortOrder: 2
    },

    // STOCK
    {
        name: PermissionsEnum.VIEW_STOCK,
        description: 'View Stock',
        category: PermissionCategoriesEnum.STOCK,
        sortOrder: 0
    },

    // STOCK ISSUE
    {
        name: PermissionsEnum.CREATE_STOCK_ISSUE,
        description: 'Create Stock Issue',
        category: PermissionCategoriesEnum.STOCK_ISSUE,
        sortOrder: 0
    },
    {
        name: PermissionsEnum.VIEW_STOCK_ISSUE,
        description: 'View Stock Issue',
        category: PermissionCategoriesEnum.STOCK_ISSUE,
        sortOrder: 1
    },

    // STOCK RECEIPT
    {
        name: PermissionsEnum.CREATE_STOCK_RECEIPT,
        description: 'Create Stock Receipt',
        category: PermissionCategoriesEnum.STOCK_RECEIPT,
        sortOrder: 0
    },
    {
        name: PermissionsEnum.VIEW_STOCK_RECEIPT,
        description: 'View Stock Receipt',
        category: PermissionCategoriesEnum.STOCK_RECEIPT,
        sortOrder: 1
    },

    // USER
    {
        name: PermissionsEnum.CREATE_USER,
        description: 'Create User',
        category: PermissionCategoriesEnum.USER,
        sortOrder: 0
    },
    {
        name: PermissionsEnum.UPDATE_USER,
        description: 'Update User',
        category: PermissionCategoriesEnum.USER,
        sortOrder: 1
    },
    {
        name: PermissionsEnum.VIEW_USER,
        description: 'View User',
        category: PermissionCategoriesEnum.USER,
        sortOrder: 2
    },
    {
        name: PermissionsEnum.BLOCK_USER,
        description: 'Block User',
        category: PermissionCategoriesEnum.USER,
        sortOrder: 3
    },

    // CLIENT
    {
        name: PermissionsEnum.CREATE_CLIENT,
        description: 'Create Client',
        category: PermissionCategoriesEnum.CLIENT,
        sortOrder: 0
    },
    {
        name: PermissionsEnum.UPDATE_CLIENT,
        description: 'Update Client',
        category: PermissionCategoriesEnum.CLIENT,
        sortOrder: 1
    },
    {
        name: PermissionsEnum.VIEW_CLIENT,
        description: 'View Client',
        category: PermissionCategoriesEnum.CLIENT,
        sortOrder: 2
    },
    {
        name: PermissionsEnum.BLOCK_CLIENT,
        description: 'Block Client',
        category: PermissionCategoriesEnum.CLIENT,
        sortOrder: 3
    },
    {
        name: PermissionsEnum.RESET_CLIENT_KEY,
        description: 'Reset Client Key',
        category: PermissionCategoriesEnum.CLIENT,
        sortOrder: 4
    },
];