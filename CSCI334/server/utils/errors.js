class BaseError extends Error {
    constructor(message) {
        super();
        if(this.constructor === BaseError){
            throw new Error(" Object of Abstract Class cannot be created");
        }
        this.message = message;
        this.success = false;
        this.errCode = this.getCode();
    }

    getCode() {
        return -1;
    }
}

class ServerError extends BaseError {
    getCode() {
        return 500;
    }
}

class BadRequest extends ServerError {
    getCode(){
        return 400;
    }
}
class NotFound extends ServerError {
    getCode(){
        return 404;
    }
}
class Unauthorized extends ServerError {
    getCode(){
        return 401;
    }
}

class Forbidden extends ServerError {
    getCode(){
        return 403;
    }
}

module.exports = {
    ServerError,
    BadRequest,
    Unauthorized,
    Forbidden,
    NotFound
};