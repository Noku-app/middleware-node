const database = require("@noku-app/nokubase").database

module.exports = (opts={}) => {
    const nokubase;
    if (opts.database) {
        nokubase = opts.database;
    } else {
        nokubase = new database(opts.config);
    };
    return async (req, res, next) => {
        //Handle token authentication and user info here

        if (!req.body.token) {
            res.status(401);
            return res.send(
                {
                    error: true,
                    data: {
                        reason: "missing_token",
                        message: "You are missing a token in your json body"
                    }
                }
            );
        } else {
            nokubase.userByToken(
                req.body.token,
                async (user) => {
                    if (!user) {
                        res.status(401);
                        return res.send(
                            {
                                error: true,
                                data: {
                                    reason: "invalid_token",
                                    message: "Your token is invalid or broken"
                                }
                            }
                        );
                    } else {
                        req.user = user;
                        next();
                    }
                }
            );
        };
    };
};