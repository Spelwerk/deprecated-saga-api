'use strict';

const logger = require('../../logger/winston');
const { SELECT } = require('./sql-helper');
const { validator } = require('../../utils');

const AccountNotLoggedInError = require('../../errors/account-not-logged-in-error');
const AccountNotAllowedToEditError = require('../../errors/account-not-allowed-to-edit-error');

const creaturePermission = async (accountId, creatureId) => {
    logger.debug('common-sql-helper-permission.creaturePermission');

    accountId = parseInt(accountId);
    creatureId = parseInt(creatureId);

    const rowsCreatureStory = await SELECT('creature_is_story', ['\*'], { creature_id: creatureId });
    const isInStory = rowsCreatureStory && rowsCreatureStory.length;

    if (!isInStory) {
        throw new AccountNotAllowedToEditError;
    }

    const storyId = parseInt(rowsCreatureStory[0].story_id);
    const creatureHasApproved = !!rowsCreatureStory[0].approved_creature;
    const storyTellerHasApproved = !!rowsCreatureStory[0].approved_storyteller;

    if (!creatureHasApproved || !storyTellerHasApproved) {
        throw new AccountNotAllowedToEditError;
    }

    const rowsStory = await SELECT('story', ['account_id'], { story_id: storyId });

    if (!rowsStory && !rowsStory.length) {
        throw new AccountNotAllowedToEditError;
    }

    const storyTeller = parseInt(rowsStory[0].account_id);

    if (accountId !== storyTeller) {
        throw new AccountNotAllowedToEditError;
    }
};

// ////////////////////////////////////////////////////////////////////////////////// //
// PUBLIC
// ////////////////////////////////////////////////////////////////////////////////// //

const getPermission = async (accountId, accountRoles, table, id) => {
    logger.debug('common-sql-helper-permission.getPermission');

    accountId = parseInt(accountId);
    id = parseInt(id);

    if (!accountId) {
        throw new AccountNotLoggedInError;
    }

    if (accountRoles.ADMIN) return;

    const rows = await SELECT(table, ['account_id'], { account_id: accountId, id });

    if (table === 'creature' && !rows && !rows.length) {
        await creaturePermission(accountId, id);
    } else if (!rows && !rows.length) {
        throw new AccountNotAllowedToEditError;
    }
};

// ////////////////////////////////////////////////////////////////////////////////// //
// EXPORTS
// ////////////////////////////////////////////////////////////////////////////////// //

module.exports = {
    getPermission,
};
