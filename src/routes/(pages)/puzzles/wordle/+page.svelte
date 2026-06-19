<script>
	import { onMount } from 'svelte';

	// Massive word list for the game - common 5-letter English words
	const WORDS = [
		// A words
		'ABOUT', 'ABOVE', 'ABUSE', 'ACORN', 'ACTOR', 'ACUTE', 'ADMIT', 'ADOPT', 'ADULT', 'AFTER',
		'AGAIN', 'AGENT', 'AGILE', 'AGING', 'AGREE', 'AHEAD', 'AISLE', 'ALARM', 'ALBUM', 'ALERT',
		'ALGAE', 'ALIEN', 'ALIGN', 'ALIKE', 'ALIVE', 'ALLEY', 'ALLOT', 'ALLOW', 'ALLOY', 'ALOFT',
		'ALONE', 'ALONG', 'ALOOF', 'ALPHA', 'ALTER', 'AMAZE', 'AMBER', 'AMEND', 'AMPLE', 'ANGEL',
		'ANGER', 'ANGLE', 'ANGRY', 'ANKLE', 'ANNOY', 'ANTIC', 'ANVIL', 'APART', 'APPLE', 'APPLY',
		'APRON', 'ARENA', 'ARGUE', 'ARISE', 'ARMOR', 'AROMA', 'AROSE', 'ARRAY', 'ARROW', 'ARSON',
		'ASSET', 'ATTIC', 'AUDIO', 'AUDIT', 'AVOID', 'AWAIT', 'AWAKE', 'AWARD', 'AWARE', 'AWFUL',
		// B words
		'BACON', 'BADGE', 'BADLY', 'BAGEL', 'BAKER', 'BALMY', 'BANAL', 'BANJO', 'BARGE', 'BARON',
		'BASIC', 'BASIL', 'BASIN', 'BASIS', 'BATCH', 'BEACH', 'BEARD', 'BEAST', 'BEGAN', 'BEGIN',
		'BEING', 'BELLY', 'BELOW', 'BENCH', 'BERRY', 'BIRTH', 'BLACK', 'BLADE', 'BLAME', 'BLAND',
		'BLANK', 'BLAST', 'BLAZE', 'BLEAK', 'BLEED', 'BLEND', 'BLESS', 'BLIND', 'BLINK', 'BLISS',
		'BLOCK', 'BLOND', 'BLOOD', 'BLOOM', 'BLOWN', 'BLUES', 'BLUNT', 'BLURB', 'BLURT', 'BLUSH',
		'BOARD', 'BOAST', 'BONUS', 'BOOTH', 'BOOZE', 'BOUND', 'BOXER', 'BRACE', 'BRAIN', 'BRAKE',
		'BRAND', 'BRASS', 'BRAVE', 'BREAD', 'BREAK', 'BREED', 'BRICK', 'BRIDE', 'BRIEF', 'BRING',
		'BRINK', 'BRISK', 'BROAD', 'BROIL', 'BROKE', 'BROOD', 'BROOK', 'BROOM', 'BROTH', 'BROWN',
		'BRUNT', 'BRUSH', 'BRUTE', 'BUDDY', 'BUILD', 'BUILT', 'BULGE', 'BULLY', 'BUNCH', 'BUNNY',
		'BURST', 'BUYER', 'BYLAW',
		// C words
		'CABIN', 'CABLE', 'CACHE', 'CADET', 'CAMEL', 'CAMEO', 'CANAL', 'CANDY', 'CANON', 'CAPER',
		'CARGO', 'CAROL', 'CARRY', 'CARVE', 'CATCH', 'CATER', 'CAUSE', 'CEASE', 'CHAIN', 'CHAIR',
		'CHALK', 'CHAMP', 'CHANT', 'CHAOS', 'CHARM', 'CHART', 'CHASE', 'CHEAP', 'CHEAT', 'CHECK',
		'CHEEK', 'CHEER', 'CHESS', 'CHEST', 'CHICK', 'CHIEF', 'CHILD', 'CHILL', 'CHINA', 'CHIRP',
		'CHOKE', 'CHORD', 'CHORE', 'CHOSE', 'CHUNK', 'CIGAR', 'CINCH', 'CIRCA', 'CIVIC', 'CIVIL',
		'CLAIM', 'CLAMP', 'CLANG', 'CLASH', 'CLASP', 'CLASS', 'CLEAN', 'CLEAR', 'CLERK', 'CLICK',
		'CLIFF', 'CLIMB', 'CLING', 'CLOAK', 'CLOCK', 'CLONE', 'CLOSE', 'CLOTH', 'CLOUD', 'CLOUT',
		'CLOWN', 'CLUB', 'CLUCK', 'CLUMP', 'CLUNG', 'COACH', 'COAST', 'COBRA', 'COCOA', 'COLON',
		'COLOR', 'COMET', 'COMIC', 'COMMA', 'CONCH', 'CORAL', 'COUCH', 'COUGH', 'COULD', 'COUNT',
		'COUPE', 'COURT', 'COVER', 'COVET', 'CRACK', 'CRAFT', 'CRAMP', 'CRANE', 'CRANK', 'CRASH',
		'CRATE', 'CRAVE', 'CRAWL', 'CRAZE', 'CRAZY', 'CREAK', 'CREAM', 'CREED', 'CREEK', 'CREEP',
		'CREST', 'CRIME', 'CRISP', 'CROAK', 'CROCK', 'CROOK', 'CROSS', 'CROWD', 'CROWN', 'CRUDE',
		'CRUEL', 'CRUSH', 'CRUST', 'CRYPT', 'CUBIC', 'CURRY', 'CURSE', 'CURVE', 'CYCLE',
		// D words
		'DAILY', 'DAIRY', 'DAISY', 'DANCE', 'DANDY', 'DEALT', 'DEATH', 'DEBIT', 'DEBUT', 'DECAL',
		'DECAY', 'DECOR', 'DECOY', 'DECRY', 'DEITY', 'DELAY', 'DELTA', 'DELVE', 'DEMON', 'DENIM',
		'DENSE', 'DEPOT', 'DEPTH', 'DERBY', 'DETOX', 'DEVIL', 'DIARY', 'DIGIT', 'DINER', 'DISCO',
		'DITCH', 'DIVER', 'DIZZY', 'DODGE', 'DOING', 'DOLLY', 'DONOR', 'DONUT', 'DOUBT', 'DOUGH',
		'DOWRY', 'DOZEN', 'DRAFT', 'DRAIN', 'DRAKE', 'DRAMA', 'DRANK', 'DRAPE', 'DRAWL', 'DRAWN',
		'DREAD', 'DREAM', 'DRESS', 'DRIED', 'DRIFT', 'DRILL', 'DRINK', 'DRIVE', 'DROIT', 'DROLL',
		'DRONE', 'DROOL', 'DROOP', 'DROSS', 'DROWN', 'DRUNK', 'DRYER', 'DRYLY', 'DUMMY', 'DUMP',
		'DUNCE', 'DUNES', 'DUSTY', 'DWARF', 'DWELL', 'DYING',
		// E words
		'EAGER', 'EAGLE', 'EARLY', 'EARTH', 'EASEL', 'EATEN', 'EATER', 'EBONY', 'EDGED', 'EDICT',
		'EIGHT', 'EJECT', 'ELBOW', 'ELDER', 'ELECT', 'ELITE', 'ELOPE', 'ELUDE', 'EMAIL', 'EMBER',
		'EMPTY', 'ENACT', 'ENDOW', 'ENJOY', 'ENSUE', 'ENTER', 'ENTRY', 'ENVOY', 'EPOCH', 'EQUAL',
		'EQUIP', 'ERASE', 'ERECT', 'ERODE', 'ERROR', 'ERUPT', 'ESSAY', 'ETHER', 'ETHIC', 'EVADE',
		'EVENT', 'EVERY', 'EVICT', 'EVOKE', 'EXACT', 'EXALT', 'EXCEL', 'EXERT', 'EXILE', 'EXIST',
		'EXPEL', 'EXTOL', 'EXTRA', 'EXUDE', 'EXULT',
		// F words
		'FABLE', 'FACET', 'FAINT', 'FAIRY', 'FAITH', 'FALSE', 'FANCY', 'FARCE', 'FATAL', 'FATTY',
		'FAULT', 'FAUNA', 'FAVOR', 'FEAST', 'FEIGN', 'FELLA', 'FELON', 'FEMUR', 'FENCE', 'FERAL',
		'FERRY', 'FETAL', 'FETCH', 'FETID', 'FETUS', 'FEVER', 'FIBER', 'FIBRE', 'FIELD', 'FIEND',
		'FIERY', 'FIFTH', 'FIFTY', 'FIGHT', 'FILMY', 'FILTH', 'FINAL', 'FINCH', 'FINER', 'FIRST',
		'FISHY', 'FIXED', 'FIXER', 'FIZZY', 'FJORD', 'FLACK', 'FLAIR', 'FLAKE', 'FLAKY', 'FLAME',
		'FLANK', 'FLARE', 'FLASH', 'FLASK', 'FLESH', 'FLICK', 'FLING', 'FLINT', 'FLOAT', 'FLOCK',
		'FLOOD', 'FLOOR', 'FLORA', 'FLOSS', 'FLOUR', 'FLOUT', 'FLOWN', 'FLUID', 'FLUKE', 'FLUNG',
		'FLUNK', 'FLUSH', 'FLUTE', 'FOAMY', 'FOCAL', 'FOCUS', 'FOGGY', 'FOLLY', 'FORCE', 'FORGE',
		'FORGO', 'FORMA', 'FORTE', 'FORTH', 'FORTY', 'FORUM', 'FOUND', 'FRAME', 'FRANK', 'FRAUD',
		'FREAK', 'FREED', 'FRESH', 'FRIAR', 'FRIED', 'FRILL', 'FRISK', 'FRONT', 'FROST', 'FROTH',
		'FROWN', 'FROZE', 'FRUIT', 'FUDGE', 'FULLY', 'FUNGI', 'FUNKY', 'FUNNY', 'FUROR', 'FURRY',
		'FUSSY', 'FUZZY', 'GAFFE',
		// G words
		'GAILY', 'GAMMA', 'GAMUT', 'GASSY', 'GAUGE', 'GAUNT', 'GAUZE', 'GAUZY', 'GAVEL', 'GAWKY',
		'GAZER', 'GECKO', 'GEEKY', 'GEESE', 'GENIE', 'GENRE', 'GHOST', 'GIANT', 'GIDDY', 'GIRTH',
		'GIVEN', 'GIVER', 'GLADE', 'GLAND', 'GLARE', 'GLASS', 'GLAZE', 'GLEAM', 'GLEAN', 'GLIDE',
		'GLINT', 'GLITZ', 'GLOAT', 'GLOBE', 'GLOOM', 'GLORY', 'GLOSS', 'GLOVE', 'GLYPH', 'GNARLY',
		'GNASH', 'GNOME', 'GODLY', 'GOING', 'GOLEM', 'GOLLY', 'GOODY', 'GOOEY', 'GOOFY', 'GOOSE',
		'GORGE', 'GOUGE', 'GOURD', 'GRACE', 'GRADE', 'GRAFT', 'GRAIL', 'GRAIN', 'GRAND', 'GRANT',
		'GRAPE', 'GRAPH', 'GRASP', 'GRASS', 'GRATE', 'GRAVE', 'GRAVY', 'GRAZE', 'GREAT', 'GREED',
		'GREEK', 'GREEN', 'GREET', 'GRIEF', 'GRILL', 'GRIME', 'GRIMY', 'GRIND', 'GRIPE', 'GROAN',
		'GROIN', 'GROOM', 'GROPE', 'GROSS', 'GROUP', 'GROUT', 'GROVE', 'GROWL', 'GROWN', 'GRUEL',
		'GRUFF', 'GRUNT', 'GUAVA', 'GUESS', 'GUEST', 'GUIDE', 'GUILD', 'GUILT', 'GUISE', 'GULCH',
		'GUMMY', 'GUPPY', 'GUSTO', 'GUSTY', 'GUTTER',
		// H words
		'HABIT', 'HAIKU', 'HAIRY', 'HALVE', 'HANDY', 'HAPPY', 'HARDY', 'HASTE', 'HASTY', 'HATCH',
		'HAUNT', 'HAVEN', 'HAVOC', 'HAZEL', 'HEADY', 'HEARD', 'HEART', 'HEATH', 'HEAVE', 'HEAVY',
		'HEDGE', 'HEFTY', 'HEIST', 'HELIX', 'HELLO', 'HENCE', 'HERON', 'HITCH', 'HOARD', 'HOBBY',
		'HOMER', 'HONEY', 'HONOR', 'HORDE', 'HORSE', 'HOTEL', 'HOUND', 'HOUSE', 'HOVER', 'HUMAN',
		'HUMID', 'HUMOR', 'HUMPS', 'HUNCH', 'HUNKY', 'HURRY', 'HUSKY', 'HYENA', 'HYPER',
		// I words
		'ICING', 'IDEAL', 'IDIOM', 'IDIOT', 'IDLER', 'IGLOO', 'IMAGE', 'IMBUE', 'IMPEL', 'IMPLY',
		'INANE', 'INBOX', 'INCUR', 'INDEX', 'INEPT', 'INERT', 'INFER', 'INGOT', 'INLET', 'INNER',
		'INPUT', 'INTRO', 'IONIC', 'IRATE', 'IRONY', 'ISSUE', 'ITCHY', 'IVORY',
		// J words
		'JAUNT', 'JAZZY', 'JEANS', 'JELLY', 'JERKY', 'JEST', 'JETTY', 'JEWEL', 'JIFFY', 'JOINT',
		'JOKER', 'JOLLY', 'JOUST', 'JUDGE', 'JUICE', 'JUICY', 'JUMBO', 'JUMPY', 'JUNKY', 'JUROR',
		// K words
		'KARMA', 'KAYAK', 'KEBAB', 'KHAKI', 'KINKY', 'KIOSK', 'KITTY', 'KNACK', 'KNEAD', 'KNEED',
		'KNEEL', 'KNELT', 'KNIFE', 'KNOCK', 'KNOLL', 'KNOWN',
		// L words
		'LABEL', 'LABOR', 'LADEN', 'LADLE', 'LAGER', 'LANCE', 'LANKY', 'LAPEL', 'LAPSE', 'LARGE',
		'LARVA', 'LASER', 'LASSO', 'LATCH', 'LATER', 'LATHE', 'LATTE', 'LAUGH', 'LAYER', 'LEACH',
		'LEAFY', 'LEAKY', 'LEANT', 'LEAPT', 'LEARN', 'LEASE', 'LEASH', 'LEAST', 'LEAVE', 'LEDGE',
		'LEECH', 'LEGAL', 'LEMON', 'LEMUR', 'LEVER', 'LIBEL', 'LIGHT', 'LIKED', 'LIKEN', 'LILAC',
		'LIMBO', 'LIMIT', 'LINEN', 'LINER', 'LINGO', 'LIPID', 'LIVER', 'LLAMA', 'LOAMY', 'LOATH',
		'LOBBY', 'LOCAL', 'LOCUS', 'LODGE', 'LOFTY', 'LOGIC', 'LOGIN', 'LOOPY', 'LOOSE', 'LORRY',
		'LOSER', 'LOTTO', 'LOTUS', 'LOUSY', 'LOVER', 'LOWER', 'LOYAL', 'LUCID', 'LUCKY', 'LUMEN',
		'LUMPY', 'LUNAR', 'LUNCH', 'LUNGE', 'LUPUS', 'LURCH', 'LURID', 'LUSTY', 'LYING', 'LYMPH',
		'LYNCH', 'LYRIC',
		// M words
		'MACHO', 'MACRO', 'MADAM', 'MADLY', 'MAFIA', 'MAGIC', 'MAGMA', 'MAIZE', 'MAJOR', 'MAKER',
		'MAMBO', 'MAMMA', 'MANGO', 'MANGY', 'MANIA', 'MANIC', 'MANLY', 'MANOR', 'MAPLE', 'MARCH',
		'MARRY', 'MARSH', 'MASON', 'MATCH', 'MATED', 'MAUVE', 'MAXIM', 'MAYBE', 'MAYOR', 'MEALY',
		'MEANT', 'MEATY', 'MEDAL', 'MEDIA', 'MEDIC', 'MELEE', 'MELON', 'MERCY', 'MERGE', 'MERIT',
		'MERRY', 'MESSY', 'METAL', 'METER', 'METRO', 'MICRO', 'MIDST', 'MIGHT', 'MIMIC', 'MINCE',
		'MINOR', 'MINUS', 'MIRTH', 'MISER', 'MISSY', 'MISTY', 'MITRE', 'MIXER', 'MOCHA', 'MODEL',
		'MODEM', 'MOGUL', 'MOIST', 'MOLDY', 'MONEY', 'MONTH', 'MOODY', 'MOOSE', 'MORAL', 'MORON',
		'MORPH', 'MOSSY', 'MOTEL', 'MOTIF', 'MOTOR', 'MOTTO', 'MOULD', 'MOULT', 'MOUND', 'MOUNT',
		'MOURN', 'MOUSE', 'MOUTH', 'MOVER', 'MOVIE', 'MOWER', 'MUCUS', 'MUDDY', 'MULCH', 'MUMMY',
		'MUNCH', 'MURAL', 'MURKY', 'MUSHY', 'MUSIC', 'MUSKY', 'MUSTY', 'MYRRH', 'MYTHS',
		// N words
		'NADIR', 'NAIVE', 'NANNY', 'NASAL', 'NASTY', 'NATAL', 'NAVAL', 'NAVEL', 'NEEDY', 'NERDY',
		'NERVE', 'NEVER', 'NEWER', 'NEWLY', 'NICER', 'NICHE', 'NIECE', 'NIGHT', 'NINJA', 'NINTH',
		'NOBLE', 'NOBLY', 'NOISE', 'NOISY', 'NOMAD', 'NOOSE', 'NORTH', 'NOTCH', 'NOTED', 'NOVEL',
		'NUDGE', 'NURSE', 'NUTTY', 'NYLON', 'NYMPH',
		// O words
		'OAKEN', 'OASIS', 'OCCUR', 'OCEAN', 'OCTET', 'ODDER', 'ODDLY', 'OFFAL', 'OFFER', 'OFTEN',
		'OLDEN', 'OLDER', 'OLIVE', 'OMBRE', 'OMEGA', 'ONION', 'ONSET', 'OPERA', 'OPIUM', 'OPTIC',
		'ORBIT', 'ORDER', 'ORGAN', 'OTHER', 'OTTER', 'OUGHT', 'OUNCE', 'OUTDO', 'OUTER', 'OUTGO',
		'OVARY', 'OVATE', 'OVERT', 'OWING', 'OWNER', 'OXIDE', 'OZONE',
		// P words
		'PADDY', 'PAGAN', 'PAINT', 'PALER', 'PALSY', 'PANEL', 'PANIC', 'PANSY', 'PAPAL', 'PAPER',
		'PARER', 'PARTY', 'PASTA', 'PASTE', 'PASTY', 'PATCH', 'PATIO', 'PATSY', 'PATTY', 'PAUSE',
		'PAYEE', 'PEACE', 'PEACH', 'PEARL', 'PECAN', 'PEDAL', 'PENAL', 'PENCE', 'PENNY', 'PERCH',
		'PERIL', 'PERKY', 'PESTO', 'PETAL', 'PETTY', 'PHASE', 'PHONE', 'PHONY', 'PHOTO', 'PIANO',
		'PICKY', 'PIECE', 'PIETY', 'PIGGY', 'PILOT', 'PINCH', 'PINEY', 'PINKY', 'PINTO', 'PIOUS',
		'PIPED', 'PIPER', 'PIQUE', 'PITCH', 'PITHY', 'PITON', 'PIVOT', 'PIXEL', 'PIXIE', 'PIZZA',
		'PLACE', 'PLAID', 'PLAIN', 'PLAIT', 'PLANE', 'PLANK', 'PLANT', 'PLATE', 'PLAZA', 'PLEAD',
		'PLEAT', 'LEDGE', 'PLIER', 'PLOD', 'PLOP', 'PLOT', 'PLOY', 'PLUCK', 'PLUMB', 'PLUME',
		'PLUMP', 'PLUNK', 'PLUSH', 'POACH', 'POINT', 'POISE', 'POLAR', 'POLYP', 'POUND', 'POWER',
		'PRANK', 'PRAWN', 'PREEN', 'PRESS', 'PRICE', 'PRICK', 'PRIDE', 'PRIME', 'PRIMP', 'PRINT',
		'PRIOR', 'PRISM', 'PRIVY', 'PRIZE', 'PROBE', 'PROMO', 'PRONE', 'PRONG', 'PROOF', 'PROSE',
		'PROUD', 'PROVE', 'PROWL', 'PROXY', 'PRUDE', 'PRUNE', 'PSALM', 'PUBIC', 'PUDGY', 'PULSE',
		'PUNCH', 'PUPIL', 'PUPPY', 'PUREE', 'PURER', 'PURGE', 'PURSE', 'PUSHY', 'PUTTY', 'PYGMY',
		// Q words
		'QUACK', 'QUAFF', 'QUAIL', 'QUALM', 'QUARK', 'QUART', 'QUASI', 'QUEEN', 'QUERY', 'QUEST',
		'QUEUE', 'QUICK', 'QUIET', 'QUILL', 'QUILT', 'QUIRK', 'QUOTA', 'QUOTE',
		// R words
		'RABBI', 'RABID', 'RACER', 'RADAR', 'RADII', 'RADIO', 'RAINY', 'RAISE', 'RALLY', 'RALPH',
		'RAMEN', 'RANCH', 'RANDY', 'RANGE', 'RAPID', 'RARER', 'RASPY', 'RATIO', 'RATTY', 'RAVEN',
		'RAYON', 'RAZOR', 'REACH', 'REACT', 'READY', 'REALM', 'REAMS', 'REBEL', 'REBUT', 'RECAP',
		'RECUR', 'REFER', 'REHAB', 'REIGN', 'RELAX', 'RELAY', 'RELIC', 'REMIT', 'RENAL', 'RENEW',
		'REPAY', 'REPEL', 'REPLY', 'RERUN', 'RESET', 'RESIN', 'RETCH', 'RETRO', 'RETRY', 'REUSE',
		'REVEL', 'REVUE', 'RHINO', 'RHYME', 'RIDER', 'RIDGE', 'RIFLE', 'RIGHT', 'RIGID', 'RIGOR',
		'RINSE', 'RIPEN', 'RIPER', 'RISEN', 'RISER', 'RISKY', 'RIVAL', 'RIVER', 'RIVET', 'ROACH',
		'ROAST', 'ROBIN', 'ROBOT', 'ROCKY', 'RODEO', 'ROGER', 'ROGUE', 'ROOMY', 'ROOST', 'ROTOR',
		'ROUGE', 'ROUGH', 'ROUND', 'ROUSE', 'ROUTE', 'ROVER', 'ROWDY', 'ROWER', 'ROYAL', 'RUDDY',
		'RUDER', 'RUGBY', 'RUIN', 'RULER', 'RUMBA', 'RUMOR', 'RUPEE', 'RURAL', 'RUSTY',
		// S words
		'SADLY', 'SAFER', 'SAINT', 'SALAD', 'SALON', 'SALSA', 'SALTY', 'SALVE', 'SALVO', 'SANDY',
		'SANER', 'SAPID', 'SASSY', 'SATIN', 'SATYR', 'SAUCE', 'SAUCY', 'SAUNA', 'SAUTE', 'SAVOR',
		'SAVVY', 'SCALD', 'SCALE', 'SCALP', 'SCALY', 'SCAMP', 'SCANT', 'SCARE', 'SCARF', 'SCARY',
		'SCENE', 'SCENT', 'SCION', 'SCOFF', 'SCOLD', 'SCONE', 'SCOOP', 'SCOPE', 'SCORE', 'SCORN',
		'SCOUT', 'SCOWL', 'SCRAM', 'SCRAP', 'SCREE', 'SCREW', 'SCRUB', 'SEAMY', 'SEDAN', 'SEIZE',
		'SENSE', 'SEPIA', 'SERIF', 'SERUM', 'SERVE', 'SETUP', 'SEVEN', 'SEVER', 'SHADE', 'SHADY',
		'SHAFT', 'SHAKE', 'SHAKY', 'SHALL', 'SHAME', 'SHANK', 'SHAPE', 'SHARD', 'SHARE', 'SHARK',
		'SHARP', 'SHAVE', 'SHAWL', 'SHEAR', 'SHEEN', 'SHEEP', 'SHEER', 'SHEET', 'SHELF', 'SHELL',
		'SHIFT', 'SHINE', 'SHINY', 'SHIRE', 'SHIRK', 'SHIRT', 'SHOCK', 'SHONE', 'SHOOK', 'SHOOT',
		'SHORE', 'SHORN', 'SHORT', 'SHOUT', 'SHOVE', 'SHOWN', 'SHOWY', 'SHREW', 'SHRUB', 'SHRUG',
		'SHUCK', 'SHUNT', 'SIGHT', 'SIGMA', 'SILKY', 'SILLY', 'SINCE', 'SINEW', 'SIREN', 'SISSY',
		'SIXTH', 'SIXTY', 'SKATE', 'SKIER', 'SKIFF', 'SKILL', 'SKIMP', 'SKIRT', 'SKULK', 'SKULL',
		'SKUNK', 'SLACK', 'SLAIN', 'SLANG', 'SLANT', 'SLASH', 'SLATE', 'SLAVE', 'SLEEK', 'SLEEP',
		'SLEET', 'SLICE', 'SLICK', 'SLIDE', 'SLIME', 'SLIMY', 'SLING', 'SLINK', 'SLOPE', 'SLOSH',
		'SLOTH', 'SLUMP', 'SLUNG', 'SLUNK', 'SLURP', 'SLUSH', 'SLYLY', 'SMACK', 'SMALL', 'SMART',
		'SMASH', 'SMEAR', 'SMELL', 'SMELT', 'SMILE', 'SMIRK', 'SMITE', 'SMITH', 'SMOCK', 'SMOKE',
		'SMOKY', 'SNAFU', 'SNAIL', 'SNAKE', 'SNAKY', 'SNARE', 'SNARL', 'SNEAK', 'SNEER', 'SNIDE',
		'SNIFF', 'SNORE', 'SNORT', 'SNOUT', 'SNOWY', 'SNUCK', 'SOAPY', 'SOBER', 'SOGGY', 'SOLAR',
		'SOLID', 'SOLVE', 'SONAR', 'SONIC', 'SOOTH', 'SOOTY', 'SORRY', 'SOUND', 'SOUTH', 'SPACE',
		'SPADE', 'SPANK', 'SPARE', 'SPARK', 'SPASM', 'SPAWN', 'SPEAK', 'SPEAR', 'SPECK', 'SPEED',
		'SPELL', 'SPEND', 'SPENT', 'SPICE', 'SPICY', 'SPIED', 'SPIEL', 'SPIKE', 'SPIKY', 'SPILL',
		'SPINE', 'SPINY', 'SPIRE', 'SPITE', 'SPLAT', 'SPLIT', 'SPOIL', 'SPOKE', 'SPOOF', 'SPOOK',
		'SPOON', 'SPORE', 'SPORT', 'SPOUT', 'SPRAY', 'SPREE', 'SPRIG', 'SPUNK', 'SPURN', 'SPURT',
		'SQUAD', 'SQUAT', 'SQUIB', 'STACK', 'STAFF', 'STAGE', 'STAIN', 'STAIR', 'STAKE', 'STALE',
		'STALK', 'STALL', 'STAMP', 'STAND', 'STANK', 'STARK', 'START', 'STASH', 'STATE', 'STAVE',
		'STEAD', 'STEAK', 'STEAL', 'STEAM', 'STEED', 'STEEL', 'STEEP', 'STEER', 'STERN', 'STICK',
		'STIFF', 'STILL', 'STILT', 'STING', 'STINK', 'STINT', 'STOCK', 'STOIC', 'STOKE', 'STOLE',
		'STOMP', 'STONE', 'STONY', 'STOOD', 'STOOL', 'STOOP', 'STORE', 'STORK', 'STORM', 'STORY',
		'STOUT', 'STOVE', 'STRAP', 'STRAW', 'STRAY', 'STRIP', 'STRUT', 'STUCK', 'STUDY', 'STUFF',
		'STUMP', 'STUNG', 'STUNK', 'STUNT', 'STYLE', 'SUAVE', 'SUGAR', 'SUING', 'SUITE', 'SULKY',
		'SUNNY', 'SUPER', 'SURGE', 'SURLY', 'SUSHI', 'SWAMP', 'SWARM', 'SWATH', 'SWEAR', 'SWEAT',
		'SWEEP', 'SWEET', 'SWELL', 'SWEPT', 'SWIFT', 'SWILL', 'SWINE', 'SWING', 'SWIPE', 'SWIRL',
		'SWISH', 'SWISS', 'SWOON', 'SWOOP', 'SWORD', 'SWORE', 'SWORN', 'SWUNG', 'SYRUP',
		// T words
		'TABBY', 'TABLE', 'TABOO', 'TACIT', 'TACKY', 'TAFFY', 'TAINT', 'TAKEN', 'TAKER', 'TALLY',
		'TALON', 'TANGO', 'TANGY', 'TAPIR', 'TARDY', 'TASTE', 'TASTY', 'TATTY', 'TAUNT', 'TAWNY',
		'TEACH', 'TEARY', 'TEASE', 'TEDDY', 'TEETH', 'TEMPO', 'TENET', 'TENOR', 'TENSE', 'TENTH',
		'TEPEE', 'TEPID', 'TERMS', 'TERRY', 'TERSE', 'TESTY', 'THANK', 'THEFT', 'THEIR', 'THEME',
		'THERE', 'THESE', 'THICK', 'THIEF', 'THIGH', 'THING', 'THINK', 'THIRD', 'THORN', 'THOSE',
		'THREE', 'THREW', 'THRIFT', 'THROW', 'THRUM', 'THUMB', 'THUMP', 'TIARA', 'TIDAL', 'TIGER',
		'TIGHT', 'TILDE', 'TIMER', 'TIMID', 'TIPSY', 'TITAN', 'TITLE', 'TOAST', 'TODAY', 'TOKEN',
		'TONAL', 'TONIC', 'TOOTH', 'TOPAZ', 'TOPIC', 'TORCH', 'TORSO', 'TOTAL', 'TOTEM', 'TOUCH',
		'TOUGH', 'TOWEL', 'TOWER', 'TOXIC', 'TRACE', 'TRACK', 'TRACT', 'TRADE', 'TRAIL', 'TRAIN',
		'TRAIT', 'TRAMP', 'TRASH', 'TRAWL', 'TREAD', 'TREAT', 'TREND', 'TRIAL', 'TRIBE', 'TRICK',
		'TRIED', 'TRIER', 'TRILL', 'TRIPE', 'TRITE', 'TROLL', 'TROOP', 'TROPE', 'TROUT', 'TRUCE',
		'TRUCK', 'TRULY', 'TRUMP', 'TRUNK', 'TRUSS', 'TRUST', 'TRUTH', 'TRYST', 'TUBAL', 'TUBER',
		'TULIP', 'TUMOR', 'TUNED', 'TUNER', 'TUNIC', 'TURBO', 'TUTOR', 'TWANG', 'TWEAK', 'TWEED',
		'TWEET', 'TWICE', 'TWINE', 'TWIRL', 'TWIST', 'TYING', 'TYPOS',
		// U words
		'UDDER', 'ULCER', 'ULTRA', 'UMBRA', 'UNCLE', 'UNCUT', 'UNDER', 'UNDID', 'UNDUE', 'UNFED',
		'UNFIT', 'UNIFY', 'UNION', 'UNITE', 'UNITY', 'UNLIT', 'UNMET', 'UNSET', 'UNTIE', 'UNTIL',
		'UPPER', 'UPSET', 'URBAN', 'URINE', 'USAGE', 'USHER', 'USING', 'USUAL', 'USURP', 'UTILE',
		'UTTER',
		// V words
		'VAGUE', 'VALET', 'VALID', 'VALOR', 'VALUE', 'VALVE', 'VAPID', 'VAPOR', 'VAULT', 'VAUNT',
		'VEGAN', 'VENAL', 'VENOM', 'VENUE', 'VERGE', 'VERSE', 'VERSO', 'VERY', 'VICAR', 'VIDEO',
		'VIGOR', 'VILLA', 'VINYL', 'VIOLA', 'VIPER', 'VIRAL', 'VISOR', 'VISTA', 'VITAL', 'VIVID',
		'VIXEN', 'VOCAL', 'VODKA', 'VOGUE', 'VOICE', 'VOILA', 'VOMIT', 'VOTER', 'VOUCH', 'VOWEL',
		'VYING',
		// W words
		'WACKY', 'WAFER', 'WAGER', 'WAGON', 'WAIST', 'WAIVE', 'WALTZ', 'WARTY', 'WASTE', 'WATCH',
		'WATER', 'WAVER', 'WAXEN', 'WEARY', 'WEAVE', 'WEDGE', 'WEEDY', 'WEIGH', 'WEIRD', 'WELSH',
		'WENCH', 'WHACK', 'WHALE', 'WHARF', 'WHEAT', 'WHEEL', 'WHERE', 'WHICH', 'WHIFF', 'WHILE',
		'WHINE', 'WHINY', 'WHIRL', 'WHISK', 'WHITE', 'WHOLE', 'WHOSE', 'WIDEN', 'WIDER', 'WIDOW',
		'WIDTH', 'WIELD', 'WILLY', 'WIMPY', 'WINCE', 'WINCH', 'WINDY', 'WIRED', 'WIRY', 'WITCH',
		'WITTY', 'WOKEN', 'WOMAN', 'WOMEN', 'WOODY', 'WOOZY', 'WORDY', 'WORLD', 'WORRY', 'WORSE',
		'WORST', 'WORTH', 'WOULD', 'WOUND', 'WOVEN', 'WRACK', 'WRATH', 'WREAK', 'WRECK', 'WREST',
		'WRING', 'WRIST', 'WRITE', 'WRONG', 'WROTE', 'WRUNG', 'WRYLY',
		// X words
		'XENON', 'XEROX',
		// Y words
		'YACHT', 'YEARN', 'YEAST', 'YIELD', 'YOUNG', 'YOUTH', 'YUMMY',
		// Z words
		'ZAPPY', 'ZEBRA', 'ZESTY', 'ZIPPY', 'ZLOTY', 'ZONAL', 'ZONES'
	];

	// All words are valid for guessing
	const VALID_WORDS = new Set(WORDS);

	let targetWord = '';
	let guesses = $state([]);
	let currentGuess = $state('');
	let gameStatus = $state('playing'); // 'playing', 'won', 'lost'
	let shake = $state(false);
	let message = $state('');

	const MAX_GUESSES = 6;

	function startNewGame() {
		targetWord = WORDS[Math.floor(Math.random() * WORDS.length)];
		guesses = [];
		currentGuess = '';
		gameStatus = 'playing';
		message = '';
	}

	function getLetterStatus(letter, position, word) {
		if (targetWord[position] === letter) {
			return 'correct';
		} else if (targetWord.includes(letter)) {
			// Count how many times this letter appears in target
			const targetCount = targetWord.split('').filter(l => l === letter).length;
			// Count how many times this letter is correctly placed or already marked present before this position
			let usedCount = 0;
			for (let i = 0; i < 5; i++) {
				if (word[i] === letter) {
					if (targetWord[i] === letter) {
						usedCount++;
					} else if (i < position) {
						usedCount++;
					}
				}
			}
			return usedCount < targetCount ? 'present' : 'absent';
		}
		return 'absent';
	}

	function submitGuess() {
		if (currentGuess.length !== 5) {
			message = 'Word must be 5 letters';
			shake = true;
			setTimeout(() => shake = false, 500);
			return;
		}

		if (!VALID_WORDS.has(currentGuess.toUpperCase())) {
			message = 'Not in word list';
			shake = true;
			setTimeout(() => shake = false, 500);
			return;
		}

		const guess = currentGuess.toUpperCase();
		guesses = [...guesses, guess];
		currentGuess = '';
		message = '';

		if (guess === targetWord) {
			gameStatus = 'won';
			message = ['Genius!', 'Magnificent!', 'Impressive!', 'Splendid!', 'Great!', 'Phew!'][guesses.length - 1];
		} else if (guesses.length >= MAX_GUESSES) {
			gameStatus = 'lost';
			message = `The word was ${targetWord}`;
		}
	}

	function handleKeyPress(key) {
		if (gameStatus !== 'playing') return;

		if (key === 'ENTER') {
			submitGuess();
		} else if (key === 'BACKSPACE') {
			currentGuess = currentGuess.slice(0, -1);
		} else if (/^[A-Z]$/.test(key) && currentGuess.length < 5) {
			currentGuess += key;
		}
	}

	function getKeyStatus(key) {
		let status = 'unused';
		for (const guess of guesses) {
			for (let i = 0; i < 5; i++) {
				if (guess[i] === key) {
					const letterStatus = getLetterStatus(key, i, guess);
					if (letterStatus === 'correct') return 'correct';
					if (letterStatus === 'present' && status !== 'correct') status = 'present';
					if (letterStatus === 'absent' && status === 'unused') status = 'absent';
				}
			}
		}
		return status;
	}

	const KEYBOARD_ROWS = [
		['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
		['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
		['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
	];

	onMount(() => {
		startNewGame();

		function onKeyDown(e) {
			if (e.ctrlKey || e.metaKey || e.altKey) return;
			const key = e.key.toUpperCase();
			if (key === 'ENTER' || key === 'BACKSPACE' || /^[A-Z]$/.test(key)) {
				handleKeyPress(key);
			}
		}

		window.addEventListener('keydown', onKeyDown);
		return () => window.removeEventListener('keydown', onKeyDown);
	});
</script>

<svelte:head>
	<title>Wordle · The Fun Website</title>
	<meta name="theme-color" content="#6aaa64" />
</svelte:head>

<section class="panel">
	<header>
		<a href="/puzzles" class="back">← Puzzles</a>
		<h1>🟩 Wordle</h1>
		<p>Guess the 5-letter word in 6 tries!</p>
	</header>

	{#if message}
		<div class="message" class:win={gameStatus === 'won'} class:lose={gameStatus === 'lost'}>
			{message}
		</div>
	{/if}

	<div class="board" class:shake>
		{#each Array(MAX_GUESSES) as _, rowIndex}
			<div class="row">
				{#each Array(5) as _, colIndex}
					{@const letter = rowIndex < guesses.length
						? guesses[rowIndex][colIndex]
						: rowIndex === guesses.length
							? currentGuess[colIndex] || ''
							: ''}
					{@const status = rowIndex < guesses.length
						? getLetterStatus(letter, colIndex, guesses[rowIndex])
						: ''}
					<div
						class="cell"
						class:filled={letter}
						class:correct={status === 'correct'}
						class:present={status === 'present'}
						class:absent={status === 'absent'}
						class:pop={rowIndex === guesses.length && letter}
					>
						{letter}
					</div>
				{/each}
			</div>
		{/each}
	</div>

	<div class="keyboard">
		{#each KEYBOARD_ROWS as row}
			<div class="keyboard-row">
				{#each row as key}
					{@const status = getKeyStatus(key)}
					<button
						class="key"
						class:wide={key === 'ENTER' || key === 'BACKSPACE'}
						class:correct={status === 'correct'}
						class:present={status === 'present'}
						class:absent={status === 'absent'}
						onclick={() => handleKeyPress(key)}
					>
						{key === 'BACKSPACE' ? '⌫' : key}
					</button>
				{/each}
			</div>
		{/each}
	</div>

	{#if gameStatus !== 'playing'}
		<button class="new-game" onclick={startNewGame}>
			Play Again
		</button>
	{/if}
</section>

<style>
	.panel {
		width: min(500px, 100%);
		background-color: rgba(255, 255, 255, 0.95);
		border: 4px solid #6aaa64;
		border-radius: 28px;
		padding: clamp(20px, 4vw, 36px);
		text-align: center;
		box-shadow: 0 18px 50px rgba(20, 50, 100, 0.25);
	}

	header {
		margin-bottom: 20px;
	}

	.back {
		display: inline-block;
		margin-bottom: 8px;
		color: #6aaa64;
		text-decoration: none;
		font-weight: 600;
	}

	.back:hover {
		text-decoration: underline;
	}

	h1 {
		margin: 0 0 8px;
		font-size: clamp(1.5rem, 5vw, 2rem);
		font-weight: 800;
		color: #2c3e50;
	}

	p {
		margin: 0;
		color: #5a6c7d;
	}

	.message {
		padding: 10px 20px;
		margin-bottom: 16px;
		border-radius: 12px;
		font-weight: 700;
		background: #f0f0f0;
		color: #333;
	}

	.message.win {
		background: #6aaa64;
		color: white;
	}

	.message.lose {
		background: #787c7e;
		color: white;
	}

	.board {
		display: flex;
		flex-direction: column;
		gap: 6px;
		margin-bottom: 20px;
	}

	.board.shake {
		animation: shake 0.5s ease;
	}

	@keyframes shake {
		0%, 100% { transform: translateX(0); }
		20% { transform: translateX(-8px); }
		40% { transform: translateX(8px); }
		60% { transform: translateX(-8px); }
		80% { transform: translateX(8px); }
	}

	.row {
		display: flex;
		justify-content: center;
		gap: 6px;
	}

	.cell {
		width: clamp(48px, 12vw, 62px);
		height: clamp(48px, 12vw, 62px);
		border: 2px solid #d3d6da;
		border-radius: 8px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: clamp(1.5rem, 5vw, 2rem);
		font-weight: 800;
		text-transform: uppercase;
		background: white;
		transition: all 0.2s ease;
	}

	.cell.filled {
		border-color: #878a8c;
	}

	.cell.pop {
		animation: pop 0.1s ease;
	}

	@keyframes pop {
		50% { transform: scale(1.1); }
	}

	.cell.correct {
		background: #6aaa64;
		border-color: #6aaa64;
		color: white;
		animation: flip 0.5s ease;
	}

	.cell.present {
		background: #c9b458;
		border-color: #c9b458;
		color: white;
		animation: flip 0.5s ease;
	}

	.cell.absent {
		background: #787c7e;
		border-color: #787c7e;
		color: white;
		animation: flip 0.5s ease;
	}

	@keyframes flip {
		0% { transform: rotateX(0); }
		50% { transform: rotateX(90deg); }
		100% { transform: rotateX(0); }
	}

	.keyboard {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.keyboard-row {
		display: flex;
		justify-content: center;
		gap: 4px;
	}

	.key {
		min-width: clamp(28px, 7vw, 43px);
		height: clamp(48px, 10vw, 58px);
		border: none;
		border-radius: 6px;
		background: #d3d6da;
		font-size: clamp(0.75rem, 2.5vw, 1rem);
		font-weight: 700;
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.key:hover {
		transform: scale(1.05);
	}

	.key:active {
		transform: scale(0.95);
	}

	.key.wide {
		min-width: clamp(52px, 12vw, 65px);
		font-size: clamp(0.65rem, 2vw, 0.8rem);
	}

	.key.correct {
		background: #6aaa64;
		color: white;
	}

	.key.present {
		background: #c9b458;
		color: white;
	}

	.key.absent {
		background: #787c7e;
		color: white;
	}

	.new-game {
		margin-top: 20px;
		padding: 14px 32px;
		border: 3px solid #6aaa64;
		border-radius: 16px;
		background: #6aaa64;
		color: white;
		font-size: 1.1rem;
		font-weight: 700;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.new-game:hover {
		background: #5a9a54;
		transform: translateY(-2px);
	}
</style>
