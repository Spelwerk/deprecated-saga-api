'use strict';

const logger = require('../../logger/winston');
const { SELECT, INSERT, UPDATE, DELETE } = require('../common/sql-helper');
const { jwt, validator } = require('../../utils');

const AccountNotLoggedInError = require('../../errors/account-not-logged-in-error');

// ////////////////////////////////////////////////////////////////////////////////// //
// PUBLIC
// ////////////////////////////////////////////////////////////////////////////////// //

const getTokens = async (accountId) => {
    accountId = parseInt(accountId);

    if (!accountId) {
        throw new AccountNotLoggedInError;
    }

    return await SELECT('account_token', ['uuid','name','browser','os'], { account_id: accountId });
};

const setName = async (accountId, uuid, name) => {
    accountId = parseInt(accountId);

    if (!accountId) {
        throw new AccountNotLoggedInError;
    }

    await UPDATE('account_token', { name }, { account_id: accountId, uuid });
};

const revoke = async (uuid) => {
    await DELETE('account_token', { uuid });
};

const create = async (id, userAgent) => {
    logger.debug('accounts/sql-helper-tokens.createRefreshToken');

    id = parseInt(id);

    const { refreshToken, uuid } = jwt.encodeRefreshToken();

    await INSERT('account_token', {
        account_id: id,
        uuid,

        remote_address: userAgent.remoteAddress,

        is_mobile: userAgent.isMobile,
        is_tablet: userAgent.isTablet,
        is_desktop: userAgent.isDesktop,
        is_android: userAgent.isAndroid,
        is_iphone: userAgent.isiPhone,
        is_chrome: userAgent.isChrome,
        is_edge: userAgent.isEdge,
        is_firefox: userAgent.isFirefox,
        is_ie: userAgent.isIE,
        is_opera: userAgent.isOpera,
        is_safari: userAgent.isSafari,
        is_chrome_os: userAgent.isChromeOS,
        is_linux: userAgent.isLinux,
        is_mac: userAgent.isMac,
        is_windows: userAgent.isWindows,
    });

    return { refreshToken, uuid };
};

// ////////////////////////////////////////////////////////////////////////////////// //
// EXPORTS
// ////////////////////////////////////////////////////////////////////////////////// //

module.exports = {
    getTokens,
    setName,
    revoke,
    create,
};
