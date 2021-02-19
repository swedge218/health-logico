export class AuthDTO {
    user_id: number;
    refresh_token: string;
    token_valid: number;

    createDTO(uid, ref_token, validity) {
        this.user_id = uid;
        this.refresh_token = ref_token;
        this.token_valid = validity;

        return this;
    }

    // createPasswordHashObject(password: string) {
    //     return { password: password };
    // }
}