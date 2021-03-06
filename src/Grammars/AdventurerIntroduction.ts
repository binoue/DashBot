import { RawGrammar } from '../tracery/Grammar';

export const AdventurerIntroduction: RawGrammar = {
	origin: [
		'You are #name#, #allegiance.a# #race# #class# #action#, #reasonClause#.',
	],
	action: [
		'travelling from the #location#',
		'searching for the #object#',
		'searching for the #location#',
		'#verb#',
		'#verb# with #name# from the #location#',
	],
	verb: ['#verbing#', '#verbing# #adverb#'],
	verbing: [
		'dancing',
		'running',
		'fighting',
		'drinking',
		'eating',
		'yelling',
		'training',
	],
	object: ['#adjective# #objectName#', '#objectName#'],
	adjective: [
		'holy',
		'unholy',
		'mysterious',
		'sexy',
		'legendary',
		'missing',
		'new',
		'great',
		'decaying',
		'fallen',
		'ruined',
		'mighty',
		'abandoned',
	],
	adverb: [
		'happily',
		'gleefully',
		'poorly',
		'slowly',
		'inappropriately',
		'hastily',
		'skilfully',
		'seductively',
	],
	reason: [
		'restore peace',
		'find true love',
		'get hot babes',
		'make papa proud',
		'see how far it is',
		'unlock all the achievements',
		'progress the main story line',
		'survive the #adjective# winter',
		'get a job',
		'woe your secret crush #name#',
		'defeat #name#',
		'avenge your fallen #sibling#, #name#',
	],
	sibling: ['brother', 'sister'],
	reasonClause: [
		'to #reason#',
		'in order to #reason#',
		'for no reason other than to #reason#',
		'to simply #reason#',
		'to #reason# and #reason#',
		'you forget exactly why',
	],
	objectName: [
		'pair of legs',
		'sweater',
		'rock',
		'grail',
		'amulet',
		'jewellery',
		'crown',
		'portal to the nether #location#',
	],
	txtFrom: ['from', 'travelling from', 'recently escaped from'],
	allegiance: [
		'good',
		'evil',
		'neutral',
		'apathetic',
		'inconsiderate',
		'loving',
		'salty',
		'inconsistent',
		'clumsy',
		'intolerable',
		'gracious',
		'happy-go-lucky',
		'singing',
	],
	race: [
		'Aarakockra',
		'Aasimar',
		'Bugbear',
		'Changeling',
		'Dragonborn',
		'Dwarf',
		'Elf',
		'Firbolg',
		'Genasi',
		'Gnome',
		'Goblin',
		'Goliath',
		'Halfling',
		'Half-Elf',
		'Half-Orc',
		'Hobgoblin',
		'Human',
		'Kenku',
		'Kobold',
		'Lizardfolk',
		'Orc',
		'Tabaxi',
		'Shifter',
		'Tiefling',
		'Tortle',
		'Triton',
		'Warforged',
		'Yuan-Ti',
		'Piece of shit',
	],
	class: [
		'Barbarian',
		'Bard',
		'Cleric',
		'Druid',
		'Fighter',
		'Monk',
		'Paladin',
		'Ranger',
		'Revised Ranger',
		'Rogue',
		'Sorcerer',
		'Warlock',
		'Wizard',
	],
	location: [
		'#adjective# city',
		'#adjective# town of #name.capitalizeAll#',
		'fortifications',
		'citadel',
		'#adjective# castle',
		"wizard's tower",
		'#adjective# watchtower',
		'stationary base of operations',
		'mobile base of operations',
		'public statement',
		'disaster area',
		'wilderness keep',
		'choke points and bottle necks',
		'toll bridge',
		'mountain pass gate',
		'valley road fort',
		'river confluence tower',
		'river mouth lighthouse',
		'tidal road',
		'cave stairway',
		'great temple',
		'sacred sanctuary',
		'isolated monastery',
		'unholy tombs',
		'desecrated shrine',
		'pilgrimage shrine',
		'wilderness',
		'enchanted forest',
		'vast desert',
		'wide ocean',
		'raging volcano',
		'magic island',
		'swamp',
		'goblin valley',
		'tundra',
		'encounters & hazards',
		'terrain',
		'inhabitants',
		'adventure ideas',
		'fertile grasslands',
		'savannah',
		'giant mountains',
		'exotic jungle',
		"dragon's lair",
	],
	name: [
		'#names.capitalizeAll#',
		'#names.capitalizeAll# the #allegiance.capitalizeAll#',
	],
	names: ['#nameWord#', '#nameWord#', '#nameWord# #names#'],
	nameWord: ['#nameMiddle##hardLetter#', '#nameMiddle##softLetter#'],
	nameMiddle: ['#syllable#', '#syllable##nameMiddle#'],
	hardLetter: ['b', 'd', 'g', 'k', 'p', 't', 'bj'],
	softLetter: [
		'c',
		'f',
		'g',
		'h',
		'j',
		'l',
		'm',
		'n',
		'q',
		'r',
		's',
		'v',
		'w',
		'x',
		'y',
		'z',
		'sh',
		'ch',
	],
	secondLetter: ['l', 'r', 'n'],
	vowel: ['a', 'e', 'é', 'i', 'o', 'u', 'ae', 'oo'],
	syllable: [
		'#hardLetter##vowel#',
		'#softLetter##vowel#',
		'#hardLetter##secondLetter##vowel#',
	],
};
