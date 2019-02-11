describe('Account test', () => {
    require('./routes/accounts');
});

describe('Content tests', () => {
    require('./routes/abilities/attributes');
    require('./routes/abilities/skills');

    require('./routes/assets/asset-types');
    require('./routes/assets/assets');
    require('./routes/assets/currencies');
    require('./routes/assets/software');
    require('./routes/assets/wealth');

    require('./routes/combat/armours');
    require('./routes/combat/shields');
    require('./routes/combat/tactics');
    require('./routes/combat/weapon-mods');
    require('./routes/combat/weapon-types');

    require('./routes/characteristics/body-parts');
    require('./routes/characteristics/expertises');
    require('./routes/characteristics/gifts');
    require('./routes/characteristics/identities');
    require('./routes/characteristics/imperfections');
    require('./routes/characteristics/natures');
    require('./routes/characteristics/species');

    require('./routes/magic/manifestations');
    require('./routes/magic/focuses');
    require('./routes/magic/forms');
    require('./routes/magic/primals');
    require('./routes/magic/spell-types');
    require('./routes/magic/spells');

    require('./routes/worlds/languages');
    require('./routes/worlds/corporations');
    require('./routes/worlds/locations');
    require('./routes/worlds/countries');

    require('./routes/assets/augmentations');
    require('./routes/assets/bionics');

    require('./routes/combat/weapons');

    require('./routes/characteristics/backgrounds');
    require('./routes/characteristics/milestones');

    require('./routes/worlds/worlds');
    require('./routes/worlds/epochs');

    require('./routes/creatures');
});
