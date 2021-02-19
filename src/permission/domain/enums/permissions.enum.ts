export enum PermissionsEnum {
    //AUTHENTICATION
    VIEW_AUTH = 'view_auth',

    // PERMISSIONS
    ADD_PERMISSIONS = 'add_permission',
    EDIT_PERMISSIONS = 'edit_permission',
    DELETE_PERMISSIONS = 'delete_permission',
    VIEW_PERMISSIONS = 'view_permission',

    // ADJUSTMENT
    CREATE_ADJUSTMENT = "create_adjustment",
    VIEW_ADJUSTMENT = "view_adjustment",


    // CANCER STAGE
    CREATE_CANCER_STAGE = "create_cs",
    UPDATE_CANCER_STAGE = "update_cs",
    VIEW_CANCER_STAGE = "view_cs",
    DELETE_CANCER_STAGE = "delete_cs",


    // CANCER TYPE
    CREATE_CANCER_TYPE = "create_ct",
    UPDATE_CANCER_TYPE = "update_ct",
    VIEW_CANCER_TYPE = "view_ct",
    DELETE_CANCER_TYPE = "delete_ct",

    // DELIVERY STATUS
    CREATE_DELIVERY_STATUS = "create_ds",
    UPDATE_DELIVERY_STATUS = "update_ds",
    VIEW_DELIVERY_STATUS = "view_ds",
    DELETE_DELIVERY_STATUS = "delete_ds",


    // HOSPITAL
    CREATE_HOSPITAL = "create_hospital",
    UPDATE_HOSPITAL = "update_hospital",
    VIEW_HOSPITAL = "view_hospital",
    DELETE_HOSPITAL = "delete_hospital",

    // INVOICE
    CREATE_INVOICE = "create_invoice",
    UPDATE_INVOICE = "update_invoice",
    VIEW_INVOICE = "view_invoice",
    CANCEL_INVOICE = "cancel_invoice",

    // LOCATIONS
    VIEW_LOCATION = "view_locations",

    // MANNUFACTURER
    CREATE_MANNUFACTURER = "create_manufacturer",
    UPDATE_MANNUFACTURER = "update_manufacturer",
    VIEW_MANNUFACTURER = "view_manufacturer",
    DELETE_MANNUFACTURER = "delete_manufacturer",

    // ORDER
    CREATE_ORDER = "create_order",
    UPDATE_ORDER = "update_order",
    VIEW_ORDER = "view_order",
    CANCEL_ORDER = "cancel_order",


    // ORDER STATUS
    CREATE_ORDER_STATUS = "create_order_status",
    UPDATE_ORDER_STATUS = "update_order_status",
    VIEW_ORDER_STATUS = "view_order_status",
    DELETE_ORDER_STATUS = "delete_order_status",

    // PATIENT
    CREATE_PATIENT = "create_patient",
    UPDATE_PATIENT = "update_patient",
    VIEW_PATIENT = "view_patient",
    DELETE_PATIENT = "delete_patient",


    // PAYMENT
    CREATE_PAYMENT = "create_payment",
    UPDATE_PAYMENT = "update_payment",
    VIEW_PAYMENT = "view_payment",

    // PRESCRIPTION
    CREATE_PRESCRIPTION = "create_prescription",
    UPDATE_PRESCRIPTION = "update_prescription",
    VIEW_PRESCRIPTION = "view_prescription",
    DELETE_PRESCRIPTION = "delete_prescription",

    // PRICE
    UPDATE_PRICE = "update_price",
    VIEW_PRICE = "view_price",


    // PROCUREMENT
    CREATE_PROCUREMENT = "create_procurement",
    UPDATE_PROCUREMENT = "update_procurement",
    VIEW_PROCUREMENT = "view_procurement",


    // PRODUCT
    CREATE_PRODUCT = "create_product",
    UPDATE_PRODUCT = "update_product",
    VIEW_PRODUCT = "view_product",
    DELETE_PRODUCT = "delete_product",

    // ROLE
    CREATE_ROLE = "create_role",
    UPDATE_ROLE = "update_role",
    VIEW_ROLE = "view_role",

    // STOCK
    VIEW_STOCK = "view_stock",

    // STOCK ISSUE
    CREATE_STOCK_ISSUE = "create_si",
    VIEW_STOCK_ISSUE = "view_si",

    // STOCK RECEIPT
    CREATE_STOCK_RECEIPT = "create_sr",
    VIEW_STOCK_RECEIPT = "view_sr",


    // USER
    CREATE_USER = "create_user",
    UPDATE_USER = "update_user",
    VIEW_USER = "view_user",
    BLOCK_USER = "block_user",

    // CLIENT
    CREATE_CLIENT = "create_client",
    UPDATE_CLIENT = "update_client",
    VIEW_CLIENT = "view_client",
    BLOCK_CLIENT = "block_client",
    RESET_CLIENT_KEY = "reset_client_key",
}