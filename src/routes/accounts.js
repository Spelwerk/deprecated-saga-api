'use strict';

const accountsHelper = require('../helpers/accounts');
const genericResponseHelper = require('../helpers/common/response-helper-generic');

module.exports = (router) => {
    const query = 'SELECT ' +
        'id, ' +
        'is_locked AS isLocked, ' +
        'display_name AS displayName, ' +
        'created, ' +
        'updated, ' +
        'deleted ' +
        'FROM account';

    router.route('/')
        .get(async (req, res, next) => {
            const call = query + ' WHERE deleted = 0';
            await genericResponseHelper.GET(req, res, next, call);
        })
        .post(async (req, res, next) => {
            await accountsHelper.accounts.POST(req, res, next);
        });

    router.route('/exists/display-name/:name')
        .get(async (req, res, next) => {
            await accountsHelper.exists.displayNameExists(req, res, next, req.params.name);
        });

    router.route('/exists/email/:email')
        .get(async (req, res, next) => {
            await accountsHelper.exists.emailExists(req, res, next, req.params.email);
        });

    // Verify

    router.route('/verify/send')
        .post(async (req, res, next) => {
            await accountsHelper.verify.sendEmail(req, res, next);
        });

    router.route('/verify/secret')
        .post(async (req, res, next) => {
            await accountsHelper.verify.verifyAccount(req, res, next);
        });

    // Login

    router.route('/login/send')
        .post(async (req, res, next) => {
            await accountsHelper.login.sendEmail(req, res, next);
        });

    router.route('/login/secret')
        .post(async (req, res, next) => {
            await accountsHelper.login.validateLoginSecret(req, res, next);
        });

    router.route('/login/password')
        .post(async (req, res, next) => {
            await accountsHelper.login.withPassword(req, res, next);
        });

    // Logout

    router.route('/logout')
        .post(async (req, res, next) => {
            await accountsHelper.logout.logout(req, res, next);
        });

    // Session

    router.route('/session')
        .get(async (req, res, next) => {
            await accountsHelper.sessions.getSession(req, res, next);
        });

    router.route('/session/info')
        .get(async (req, res, next) => {
            await accountsHelper.sessions.getInfo(req, res, next);
        });

    // Tokens

    router.route('/tokens/refresh')
        .get(async (req, res, next) => {
            await accountsHelper.refreshToken.GET(req, res, next);
        })
        .put(async (req, res, next) => {
            await accountsHelper.refreshToken.PUT(req, res, next, req.body.uuid);
        });

    router.route('/tokens/refresh/:uuid')
        .delete(async (req, res, next) => {
            await accountsHelper.refreshToken.DELETE(req, res, next, req.params.uuid);
        });

    // Change Email

    router.route('/change-email/send')
        .post(async (req, res, next) => {
            await accountsHelper.email.sendEmail(req, res, next);
        });

    router.route('/change-email/secret')
        .post(async (req, res, next) => {
            await accountsHelper.email.setNewEmail(req, res, next);
        });

    // Change Password

    router.route('/change-password/send')
        .post(async (req, res, next) => {
            await accountsHelper.password.sendEmail(req, res, next);
        });

    router.route('/change-password/secret')
        .post(async (req, res, next) => {
            await accountsHelper.password.setNewPassword(req, res, next);
        });

    // Account

    router.route('/:id')
        .get(async (req, res, next) => {
            const call = query + ' WHERE deleted = 0 AND id = ?';
            await genericResponseHelper.GET(req, res, next, call, [req.params.id], true);
        })
        .put(async (req, res, next) => {
            await accountsHelper.accounts.PUT(req, res, next, req.params.id);
        })
        .delete(async (req, res, next) => {
            await accountsHelper.accounts.DELETE(req, res, next, req.params.id);
        });

    router.route('/:id/display-name')
        .put(async (req, res, next) => {
            await accountsHelper.accounts.setDisplayName(req, res, next, req.params.id);
        });

    router.route('/:id/one-time-password')
        .post(async (req, res, next) => {
            await accountsHelper.otp.POST(req, res, next, req.params.id);
        })
        .delete(async (req, res, next) => {
            await accountsHelper.otp.DELETE(req, res, next, req.params.id);
        });

    router.route('/:id/one-time-password/verify')
        .post(async (req, res, next) => {
            await accountsHelper.otp.verify(req, res, next, req.params.id);
        });

    router.route('/:id/roles')
        .get(async (req, res, next) => {
            await accountsHelper.roles.GET(req, res, next, req.params.id);
        })
        .post(async (req, res, next) => {
            await accountsHelper.roles.POST(req, res, next, req.params.id);
        });

    router.route('/:id/roles/:role')
        .delete(async (req, res, next) => {
            await accountsHelper.roles.DELETE(req, res, next, req.params.id, req.params.role);
        });

    router.route('/:id/security-question')
        .get(async (req, res, next) => {
            await accountsHelper.securityQuestion.GET(req, res, next, req.params.id);
        })
        .post(async (req, res, next) => {
            await accountsHelper.securityQuestion.POST(req, res, next, req.params.id);
        });

    router.route('/:id/security-question/verify')
        .get(async (req, res, next) => {
            await accountsHelper.securityQuestion.getValidation(req, res, next, req.params.id);
        })
        .post(async (req, res, next) => {
            await accountsHelper.securityQuestion.tryValidation(req, res, next, req.params.id);
        });

    router.route('/:id/security-question/:item')
        .put(async (req, res, next) => {
            await accountsHelper.securityQuestion.PUT(req, res, next, req.params.id, req.params.item);
        })
        .delete(async (req, res, next) => {
            await accountsHelper.securityQuestion.DELETE(req, res, next, req.params.id, req.params.item);
        });

    router.route('/:id/admin/email')
        .put(async (req, res, next) => {
            await accountsHelper.email.setNewEmailAsAdmin(req, res, next, req.params.id);
        });

    router.route('/:id/admin/password')
        .put(async (req, res, next) => {
            await accountsHelper.password.setNewPasswordAsAdmin(req, res, next, req.params.id);
        });
};
