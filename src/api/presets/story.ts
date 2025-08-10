import { CardSuit, Character, Collectible, Ending, Job, ModProject, SkillId, Story, StoryPatch, StoryPatchType } from "@/lib/exoloader";
import { gameCollectibles } from "../collectibles";

const friendRebuilding = (character: Character) => {
	const id = crypto.randomUUID()
	return {
		id: crypto.randomUUID(),
		projectId: character.projectId,
		dbId: id,
		name: `${character.id}Rebuilding`,
		content: `	~if chara = _high_${character.id}
	~if mem_rebuilding
	~if repeat
	
	~set bg = destroyed
	~set left = ${character.id}

	// FIXME: Replace this, can change how many if else blocks here, or remove them all
	[if random]
	
	[else]
	
	[else]
	
	[else]
	
	[end]`,
		file: `chara_${character.id}`,
		category: `${character.nickname} - High Priority`,
		order: 1
	}
}

const friendMourning = (character: Character) => {
	const id = crypto.randomUUID()
	return {
		id: id,
		projectId: character.projectId,
		dbId: id,
		name: `${character.id}Mourning`,
		content: `	~if chara = _high_${character.id}
	// block any happier events while you're in mourning for something not caught above
	~if status = mourning
	~if repeat
	
	[if mem_dead_dad && story_main_shimmerEnd <= 2]
		// Reaction to dad's death
		
	[else if mem_dead_mom && story_main_starveDeath <= 4]
		// Reaction to mom's death, can be probably removed for Helios

	[else]
		// Reaction to other death
		
	[end]`,
		file: `chara_${character.id}`,
		category: `${character.nickname} - High Priority`,
		order: 2
	}
}

const helioIntro = (character: Character) => {
	const id = crypto.randomUUID()
	return {
		id: id,
		projectId: character.projectId,
		dbId: id,
		name: `${character.id}Intro`,
		content: `	~if chara = high_${character.id}
	~if story_main_newShip < 12
	~if mem_newShip

	// Helio names aren't automatically known (and if you miss this event, tough tits)
	~call charafact(${character.id}, name)
	
	// Your code here

	// set in code after any time their sprite appears in a story
	[if !mem_met_${character.id}]
		// Didn't meet them yet
	[else]
		// Met/seen them before somewhere else
	[end]
	
	// Your code here`,
		file: `chara_${character.id}`,
		category: '${character.nickname} - High Priority',
		order: 3
	}
}

const stratosIntro = (character: Character) => {
	const id = crypto.randomUUID()
	return {
		id: id,
		projectId: character.projectId,
		dbId: id,
		name: `${character.id}Intro`,
		content: `	~if chara = high_${character.id}
	~if age <= 13
	
	~set midleft = ${character.id}
	
	// Your code here`,
		file: `chara_${character.id}`,
		category: `${character.nickname} - High Priority`,
		order: 4
	}
}

const bffs = (character: Character, skill: SkillId) => {
	const id = crypto.randomUUID()
	return {
		id: id,
		projectId: character.projectId,
		dbId: id,
		name: `${character.id}Bffs`,
		content: `	~if chara = high_${character.id}
	~if story_main_bffsStart < 2
	~if mem_bff = null
	~if repeat

	// The structure here is merely a suggestion based on other similar events
	
	[if first]
		// First time interacting with ${character.id} during BFF event
	[else]
		// All other times
	[end]

	// can skill check sometimes to be BFFs, doesn't have to be character's related skill
	* Option 1
		~ifd skill_${skill} >= 10
		~set mem_bff = ${character.id}
		~set love_${character.id}++
		
		// Your code here
		
	* Option 2
		
		// Some characters can reject BFF offer, Marz always agrees without any skill checks
	
	* Option 3
		// Sometimes there is option based on being lovers in one of the past lives for BFFs, "Sometimes I dream we grow old together.", "In my dreams, we are in love." or something like that
		~if hog_love_${character.id}
		~set mem_flirt_${character.id} = true
		
		// Your code here, some characters can reject here and set ~set mem_delusions++, others are not offended and like this (like Marz, Dys and Tang, for example)
		
		** Agree option
			~set mem_bff = ${character.id}
			~set love_${character.id}++
			
			// Your code here
		
		** "On second thought..."

			// Your code here
			
	* On second thought...
	
		// Your code here`,
		file: `chara_${character.id}`,
		category: `${character.nickname} - High Priority`,
		order: 5
	}
}

const secretAdmirer = (character: Character) => {
	const id = crypto.randomUUID()
	return {
		id: id,
		projectId: character.projectId,
		dbId: id,
		name: `${character.id}SecretAdmirer`,
		content: `	~if chara = high_${character.id}
	~if mem_quest_secretAdmirer
	
	~set bg = engineering
	~set left = ${character.id}
	
	// Your code here
	
	* "Are you my secret admirer?"
		~if mem_quest_secretAdmirer == ${character.id}
		~set mem_quest_secretAdmirer = false
		
		// They are your secret admirer
		
		** Option 1
			// Confirm that you like them, can be more suboptions here
			~set love_${character.id}++
			~set mem_flirt_${character.id}
			
			// Your code here
				
		** Option 2
			
			// Your code here, you don't feel the same way
			
	* "Are you my secret admirer?"
		~if mem_quest_secretAdmirer != ${character.id}
		
		// They are not your secret admirer
		
	* Leave ${character.nickname} alone for now
		~set charas = none
		// run again next time you talk to the chara, 'if first' will still be true, won't log story
		~call keep
		
		You excuse yourself. You can always ask again later... if you have the guts.
		
	* This is pointless. I don't want to know.
		// end secret admirer phase
		~set mem_quest_secretAdmirer = false
		~set charas = none
		
		You shove the databand into your pocket and decide you have better things to do than track down who gave it to you.`,
		file: `chara_${character.id}`,
		category: `${character.nickname} - High Priority`,
		order: 6
	}
}

const dateStory = (character: Character) => {
	const id = crypto.randomUUID()
	return {
		id: id,
		projectId: character.projectId,
		dbId: id,
		name: `date_${character.id}`,
		content: `	~if location = none
	// date story is called directly from ${character.id}Repeat
	
	~set bg = ${character.defaultBg ?? 'colony'}
	~set left = ${character.id}
	
	// Your code here, can change backgrounds and sprites in suboptions, can be removed if not needed, can be more or less options
	
	* Option 1
		~if random
		~set bg = ${character.defaultBg ?? 'colony'}
		~set left = ${character.id}
		
		// Your code here
		
		-
		~set skill_stress - 20

		// Your code here
		
	* Option 2
		~if random
		~set bg = ${character.defaultBg ?? 'colony'}
		~set left = ${character.id}
		
		// Your code here
		
		-
		~set skill_stress - 20

		// Your code here

	* Option 3
		~if random
		~set bg = ${character.defaultBg ?? 'colony'}
		~set left = ${character.id}
		
		// Your code here
		
		-
		~set skill_stress - 20

		// Your code here

	* Option 4
		~if random
		~set bg = ${character.defaultBg ?? 'colony'}
		~set left = ${character.id}
		
		// Your code here
		
		-
		~set skill_stress - 20

		// Your code here`,
		file: `chara_${character.id}`,
		category: `${character.nickname} - Direct Calls`,
		order: 1
	}
}

const friendshipEvent = (character: Character, i: number) => {
	const id = crypto.randomUUID()
	const comment = i === 10
		? `This is ultimate friendship event, don't forget to ~set card = ${character.id}3 somewhere in the code!`
		: "Your code here, can have more conditions on top level depending on story, when it happens, if character is Stratos or Helios, etc."
	return {
		id: id,
		projectId: character.projectId,
		dbId: id,
		name: `${character.id}${i}${i === 10 ? "Ultimate" : "Friendship"}`,
		content: `	~if chara = ${character.id}
	~if love_${character.id} >= ${i * 10}

	// ${comment}`,
		file: `chara_${character.id}`,
		category: character.nickname,
		order: i
	}
}

const giftInsert = (character: Character, collectibles: Collectible[]) => {
	const likes = character.likes ?? []
	const dislikes = character.dislikes ?? []

	collectibles.forEach((c) => {
		if (c.like?.includes(character.id) && !likes.includes(c.id)) {
			likes.push(c.id)
		} else if (c.dislike?.includes(character.id) && !dislikes.includes(c.id)) {
			dislikes.push(c.id)
		}
	})

	const giftInserts: string[] = [
		`**= card_whiteFlower
		// Reaction to recieving special white flower`
	]

	likes.forEach((c) => {
		giftInserts.push(`		**= card_${c}
			// liked gift
			[if call_charaBirthday(${character.id})]
				// Birthday reaction
			[else]
				// Regular reaction
			[end]
    `)
	})

	dislikes.forEach((c) => {
		giftInserts.push(`		**= card_${c}
			// disliked gift
			[if call_charaBirthday(${character.id})]
				// Birthday reaction
			[else]
				// Regular reaction
			[end]
    `)
	})

	giftInserts.push(`		**= card_default
			// Any other gift not listed above
			[if call_charaBirthday(${character.id})]
				// Birthday reaction
			[else]
				// Regular reaction
			[end]`)

	return giftInserts.join('\n\n')
}

const helioRepeat = (character: Character,
	collectibles: Collectible[],
	primarySkill: SkillId
) => {
	const id = crypto.randomUUID()
	return {
		id: id,
		projectId: character.projectId,
		dbId: id,
		name: `${character.id}Repeat`,
		content: `	~if chara = low_${character.id}
	~if repeat

	// A lot of code block placeholders here, can be removed or added as needed, these are just modeled after Vace (a bit)
	
	[if season == glow]
		[if random!]

		[else if age == 15]

		[else if age >= 15 && age <= 16]

		[else if age >= 17]

		[end]

	[else if age == 15]
	
		[if random!]

		[else]

		[else]

		[else]

		[else if season == wet]

		[end]
		
	[elseif age == 16]
	
		[if random!]

		[else]

		[else]

		[else]

		[else]

		[else]

    [else if mem_date_${character.id}]

		[else if season == quiet]

		[else if season == pollen]

		[end]
		
	[elseif age == 17]
	
		[if random!]

		[else]

		[else]

		[else]

		[else]

		[else]

		[else if mem_date_${character.id}]

		[else if mem_tammyPregnant]

		[else if season == dust]

		[end]
		
	[elseif age == 18]
	
		[if random!]

		[else]

		[else]

		[else]

		[else]

		[else if mem_date_${character.id}]

		[else if season == quiet]

		[end]
		
	[elseif age == 19]
	
		[if random!]

		[else]

		[else]

		[else]

		[else if mem_wallGoBoom]

		[else if mem_dysLeft]

		[else if mem_date_${character.id}]

		[end]
		
	[else]
		
		// Default fallback if no other conditions are met
	[end]
	
	* Offer a gift
		~if mem_foundCollectible
		~ifd call_canGift(${character.id})
		~call preventSeenSkip
		~call chooseGift(${character.id})
		
		${giftInsert(character, collectibles)}
			
	// tailies don't get twenties
		
	* Skill interaction 40
		~ifd skill_${primarySkill} >= 40
		~if mem_${character.id}Unlock == 0
		~set mem_${character.id}Unlock = 1
		// Gift a fitting card with ~set card = cardname
		
		// Your code here
		
		-
		~set love_${character.id}++
		~set skill_${primarySkill}++
		
		// Your code here
		
	* Skill interaction 80
		~ifd skill_${primarySkill} >= 80
		~if mem_${character.id}Unlock == 1
		~set mem_${character.id}Unlock = 2
		// Gift a fitting card with ~set card = cardname
		
		// Your code here
		
		-
		~set love_${character.id}++
		~set skill_${primarySkill}++
		
		// Your code here
		
	* Go on a date option
		~if mem_date_${character.id}
		~if !story_date_${character.id} || story_date_${character.id} > 6
		~if season != glow
		~set mem_flirt_${character.id} // for the icon
		~call preventSeenSkip
		~call story(date_${character.id})
		
	* Stop dating option
		~if mem_date_${character.id}
		
		// Your code here
		
		** Option to continue dating
			// Your code here
		
		** Option to stop dating
			~set !mem_date_${character.id}
			~set mem_relationship = single
			
			// Your code here
		
	* Done`,
		file: `chara_${character.id}`,
		category: `${character.nickname} - Low Priority`,
		order: 1
	}
}

const stratosRepeat = (character: Character,
	collectibles: Collectible[],
	primarySkill: SkillId
) => {
	const id = crypto.randomUUID()
	return {
		id: id,
		projectId: character.projectId,
		dbId: id,
		name: `${character.id}Repeat`,
		content: `	~if chara = low_${character.id}
	~if repeat

	// A lot of code block placeholders here, can be removed or added as needed, these are just modeled after Marz
	
	[if age == 10]
		[if random!]

		[else]

		[else]

		[else]

		[else if mem_dead_tammy && season == pollen]

		[else if season == pollen]

		[else if season == wet]

		[end]
		
	[elseif age == 11]
		
		[if random!]

		[else]

		[else]

		[else]

		[else if mem_shopUnlocked]

		[else if season == pollen]

		[end]
		
	[elseif age == 12]
	
		[if random!]

		[else]

		[else]

		[else]

		[else]

		[else if season == wet]

		[end]
		
	[elseif age == 13]
	
		[if random!]

		[else]

		[else]

		[else]

		[else if season == pollen]

		[end]
		
	[elseif age == 14]
	
		[if random!]

		[else]

		[else]

		[else if mem_starve]

		[else if mem_starve]

		[else if mem_starve && season == pollen]

		[else if mem_dead_mom]

		[else]

		[end]
		
	[elseif age == 15]
		// New ship has arrived!
		[if random!]

		[else]

		[else]

		[else]

		[end]
		
	[elseif age == 16]
	
		[if random!]

		[else]

		[else]

		[else]

		[else]

		[else if mem_date_${character.id}]

		[else if season == dust]

		[end]
		
	[elseif age == 17]
	
		[if random!]

		[else]

		[else]

		[else]

		[else]

		[else if mem_date_${character.id}]

		[else if mem_tammyPregnant]

		[else if mem_tammyPregnant]

		[end]
		
	[elseif age == 18]
		// Tammy gives birth, mutiny is brewing
	
		[if random!]

		[else]

		[else]

		[else if !mem_dead_dys]

		[else]

		[else]

		[else if mem_date_${character.id}]

		[else if mem_tammyBaby]

		[end]
		
	[elseif age == 19]
	
		[if random!]

		[else]

		[else]

		[else]

		[else if mem_wallGoBoom]

		[else if mem_date_${character.id}]

		[end]
	
	[else]
		
		// Default text here if none of the above conditions are met
	[end]
	
	* Offer a gift
		~if mem_foundCollectible
		~ifd call_canGift(${character.id})
		~call preventSeenSkip
		~call chooseGift(${character.id})
		
		${giftInsert(character, collectibles)}
	
	* Skill interaction 20
		~ifd skill_${primarySkill} >= 20
		~if mem_${character.id}Unlock == 0 && !mem_newShip
		~set mem_${character.id}Unlock = 1
		// Gift a fitting card with ~set card = cardname

		// Your code here
		
		-
		~set love_${character.id}++
		~set skill_${primarySkill}++
		
		// Your code here
		
	* Skill interaction 40
		~ifd skill_${primarySkill} >= 40
		~if mem_${character.id}Unlock == 1 || mem_${character.id}Unlock == 0 && mem_newShip
		~set mem_${character.id}Unlock = 2
		// Gift a fitting card with ~set card = cardname
		
		// Your code here
		
		-
		~set love_${character.id}++
		~set skill_${primarySkill}++
		
		// Your code here

	* Skill interaction 80
		~ifd skill_${primarySkill} >= 80
		~if mem_${character.id}Unlock == 2
		~set mem_${character.id}Unlock = 3
		// Gift a fitting card with ~set card = cardname

		// Your code here
		
		-
		~set love_${character.id}++
		~set skill_${primarySkill}++
		
		// Your code here
			
	* Go on a date option
		~if mem_date_${character.id}
		~if !story_date_${character.id} || story_date_${character.id} > 6
		~if season != glow
		~set mem_flirt_${character.id} // for the icon
		~call preventSeenSkip
		~call story(date_${character.id})
		
	* Stop dating option
		~if mem_date_${character.id}
	
		// Your code here
		
		** Option to continue dating
		
			// Your code here
			
		** Option to stop dating
			~set !mem_date_${character.id}
			~set mem_relationship = single
			
			// Your code here
	
	* Done`,
		file: `chara_${character.id}`,
		category: `${character.nickname} - Low Priority`,
		order: 1
	}
}

const characterFriendEndingStory = (character: Character, project: ModProject) => {
	const lines: string[] = [
		'	~if location == none'
	]

	if (character.defaultBg) {
		lines.push(`	~set bg = ${character.defaultBg}`)
	}

	lines.push(`	~set effect = ending`)

	if (!character.ages) {
		lines.push(`	~set midright = ${character.id}`)
	} else if (character.helioOnly) {
		lines.push(`	~set left = ${character.id}2`)
		lines.push(`	~set midright = ${character.id}3`)
		lines.push(`	~set right = spacer`)
	} else {
		lines.push(`	~set left = ${character.id}1`)
		lines.push(`	~set midright = ${character.id}2`)
		lines.push(`	~set right = ${character.id}3`)
	}

	lines.push(`	~call delayText(1)`)
	lines.push('')
	lines.push(`	// Your code here`)

	const content = lines.join('\n')
	const id = crypto.randomUUID()

	return {
		id,
		projectId: character.projectId,
		dbId: id,
		name: `ending_chara_${character.id}`,
		content: spacesToTabs(content),
		file: `${project.folderName}_endings`,
		category: 'Endings - Charas',
		order: 1
	}
}

const characterFriendEndingDeadStory = (character: Character, project: ModProject) => {
	const lines: string[] = [
		'	~if location == none'
	]

	if (character.defaultBg) {
		lines.push(`	~set bg = ${character.defaultBg}`)
	}

	lines.push(`	~set effect = ending`)

	if (!character.ages) {
		lines.push(`	~set midright = ${character.id}`)
	} else if (character.helioOnly) {
		lines.push(`	~set left = ${character.id}2`)
		lines.push(`	~set midright = ${character.id}3`)
		lines.push(`	~set right = spacer`)
	} else {
		lines.push(`	~set left = ${character.id}1`)
		lines.push(`	~set midright = ${character.id}2`)
		lines.push(`	~set right = ${character.id}3`)
	}

	lines.push(`	~call delayText(1)`)
	lines.push('')
	lines.push(`	// Your code here, this story/event is needed if your character can die after player got 80 friendship with them`)

	const content = lines.join('\n')
	const id = crypto.randomUUID()

	return {
		id,
		projectId: character.projectId,
		dbId: id,
		name: `ending_chara_${character.id}_dead`,
		content: spacesToTabs(content),
		file: `${project.folderName}_endings`,
		category: 'Endings - Charas',
		order: 2
	}
}

export const friendPresets = (
	character: Character,
	collectibles: Collectible[],
	primarySkill: SkillId,
	project: ModProject
) => {
	const stories: Story[] = []

	if (!character.helioOnly) {
		stories.push(friendRebuilding(character))
	}

	stories.push(friendMourning(character))

	if (character.helioOnly) {
		stories.push(helioIntro(character))
	} else {
		stories.push(stratosIntro(character))
		stories.push(bffs(character, primarySkill))
	}

	stories.push(secretAdmirer(character))
	stories.push(dateStory(character))

	for (let i = 1; i <= 10; i++) {
		stories.push(friendshipEvent(character, i))
	}

	if (character.helioOnly) {
		stories.push(helioRepeat(character, collectibles, primarySkill))
	} else {
		stories.push(stratosRepeat(character, collectibles, primarySkill))
	}

	stories.push(characterFriendEndingStory(character, project))
	stories.push(characterFriendEndingDeadStory(character, project))

	return stories
}

const getSuitFromSkill = (skill: SkillId): CardSuit => {
	switch (skill) {
		case SkillId.Bravery:
		case SkillId.Creativity:
		case SkillId.Empathy:
		case SkillId.Persuasion:
			return CardSuit.Social
		case SkillId.Animals:
		case SkillId.Perception:
		case SkillId.Toughness:
		case SkillId.Combat:
			return CardSuit.Physical
		default:
			return CardSuit.Mental
	}
}

export const characterFriendStoryPatches = (character: Character, primarySkill: SkillId,): StoryPatch[] => {
	const patches: StoryPatch[] = []

	if (character.ages && !character.helioOnly) {
		patches.push({
			id: `character-friend-${character.id}-intro-patch`,
			dbId: crypto.randomUUID(),
			projectId: character.projectId,
			file: `chara_${character.id}`,
			type: StoryPatchType.Insert,
			storyId: 'gameStartIntro',
			locationKey: '~call charafact(tammy, name)',
			locationIndex: 0,
			body: `	~call charafact(${character.id}, name)
	~set love_${character.id} + 2`,
			category: 'Character Intro Sets',
			order: 0
		})

		const suit = getSuitFromSkill(primarySkill)

		patches.push({
			id: `character-friend-${character.id}-childhood-friend-patch1`,
			dbId: crypto.randomUUID(),
			projectId: character.projectId,
			file: `chara_${character.id}`,
			type: StoryPatchType.Insert,
			storyId: 'gameStartIntro',
			locationKey: '** Shy and sweet Tammy',
			locationIndex: 0,
			body: `		** Chose ${character.nickname} as childhood friend (first time playing the game)
			~set mem_childfriend = ${character.id}
			~set mem_met_${character.id}
			~set love_${character.id} + 5
			~set skill_${primarySkill} + 10
			// ~set skill_creativity + 10 // choose skill here for bonus, don't forget to decrease it in "Wait, that's not right..." part
			~set card = ${character.id}1
			~set card_hidden = ${suit}1

			~set bg = creche
			~set left = ${character.id}

			Description here, no sub-event for the first time playing the game, but can revert the choice

			*** Yeah, ${character.nickname}!
				> question6

			*** Wait, that's not right...
				~set love_${character.id} - 5
				~call decrementSkillWithBonuses(${primarySkill}, -10)
				// ~call decrementSkillWithBonuses(creativity, -10)
				~call losecard(${character.id}1)
				~call losecard(${suit}1)
				~call clearchanges

				> question5
				`,
			category: 'Childhood Friend - Playing the game first time',
			order: 1
		})

		patches.push({
			id: `character-friend-${character.id}-childhood-friend-patch2`,
			dbId: crypto.randomUUID(),
			projectId: character.projectId,
			file: `chara_${character.id}`,
			type: StoryPatchType.Insert,
			storyId: 'gameStartIntro',
			locationKey: '** Ship\'s Computer Congruence',
			locationIndex: 0,
			body: `		** Chose ${character.nickname} as childhood friend
			~set mem_childfriend = ${character.id}
			~set mem_met_${character.id}
			~set love_${character.id} + 5
			~set skill_${primarySkill} + 5
			// ~set skill_creativity + 5 // choose skill here for bonus
			~set card = ${character.id}1
			~set card_hidden = ${suit}1
			
			~set bg = creche
			~set left = ${character.id}
			
			Description here, with some sub-events!
			
			*** Option 1
				// Can grant +5 to some skill here, +2/-2 to rebellion, grant love optionally like ~set love_${character.id}++
				// And similar in other suboptions

				> question6
				
			*** Option 2

				> question6
				
			*** Option 3

				> question6
				
			*** Option 4
		
				> question6
				`,
			category: 'Childhood Friend - Playing the game second+ time',
			order: 2
		})
	}

	if (character.ages) {
		patches.push({
			id: `character-friend-${character.id}-secret-admirer-patch`,
			dbId: crypto.randomUUID(),
			projectId: character.projectId,
			file: `chara_${character.id}`,
			type: StoryPatchType.Insert,
			storyId: 'main_secretAdmirer',
			locationKey: '* You overhear Cal on his hearspeak',
			locationIndex: 0,
			body: `	* Failed to locate ${character.nickname} as a secret admirer
			~if mem_quest_secretAdmirer == ${character.id}
			~set mem_quest_secretAdmirer == false
			~set left = ${character.id}
			
			// Your code here
				`,
			category: 'Failed to locate Secret Admirer',
			order: 0
		})

		patches.push({
			id: `character-friend-${character.id}-birthday-16-patch`,
			dbId: crypto.randomUUID(),
			projectId: character.projectId,
			file: `chara_${character.id}`,
			type: StoryPatchType.Insert,
			storyId: 'main_birthday16',
			locationKey: '* Someone knocking on the door',
			locationIndex: 0,
			body: `	* Someone knocking on the door (${character.nickname})
		~if call_mostlove == ${character.id}
		~set skill_stress - 10
		
		~set midleft = ${character.id}
		
		// Your code here
		
		>! balcony`,
			category: 'Birthday 16 (friend visit)',
			order: 0
		})

		patches.push({
			id: `character-friend-${character.id}-birthday-dance-patch`,
			dbId: crypto.randomUUID(),
			projectId: character.projectId,
			file: `chara_${character.id}`,
			type: StoryPatchType.Insert,
			storyId: 'main_birthday17',
			locationKey: '** Think about Sym...',
			locationIndex: 0,
			body: `		** Go to ${character.nickname}
				~if love_${character.id} >= 50 || mem_date_${character.id}
				
				~set mem_flirt_${character.id}
				~set love_${character.id}++
				~set midleft = ${character.id}
				
				// Your code here
	
				> continue
				`,
			category: 'Birthday 17 Dance',
			order: 0
		})

		patches.push({
			id: `character-friend-${character.id}-tammy-100-friendship-patch`,
			dbId: crypto.randomUUID(),
			projectId: character.projectId,
			file: `chara_${character.id}`,
			type: StoryPatchType.Insert,
			storyId: 'tammy10Ultimate',
			locationKey: '** Go talk to my mom!',
			locationIndex: 0,
			body: `		** Talk to ${character.nickname}
			~if love_${character.id} >= 50
			~if once
			~set speaker = ${character.id}
			~set left = ${character.id}
			
			// Your code here
			
			*** Option 1
			
				// Your code here
			
				> continue${character.id}
			
			*** Option 2
			
				// Your code here
			
				> continue${character.id}
			
			***= continue${character.id}
			
				// Your code here
			
				>> choose
				`,
			category: 'Tammy\'s 100 Friendship',
			order: 0
		})

		// Vace's jelousy event
		patches.push({
			id: `character-friend-${character.id}-vace-jealousy-patch`,
			dbId: crypto.randomUUID(),
			projectId: character.projectId,
			file: `chara_${character.id}`,
			type: StoryPatchType.Insert,
			storyId: 'vace7Jealous',
			locationKey: '[elseif call_mostlove != vace]',
			locationIndex: 0,
			body: `		[elseif mem_flirt_${character.id} = true]
			"You know, word gets around. People tell me how you act around ${character.nickname}," he sneers. "Vace's opinion of ${character.nickname} goes here."
		`,
			category: 'Vace\'s Jealousy (70 Friendship)',
			order: 0
		})

		// ending_special_destroyGardeners - mentions character if dating
		patches.push({
			id: `character-friend-${character.id}-destroy-gardeners-patch`,
			dbId: crypto.randomUUID(),
			projectId: character.projectId,
			file: `chara_${character.id}`,
			type: StoryPatchType.Insert,
			storyId: 'ending_special_destroyGardeners',
			locationKey: '[elseif mem_date_tammy]',
			locationIndex: 0,
			body: `[elseif mem_date_${character.id}]
		// Your code here - if dated ${character.nickname} while getting destroy gardeners ending

	`,
			category: 'Ending - Destroy Gardeners',
			order: 0
		})

		// Tangent's Cure ending (ending_special_virus)
		patches.push({
			id: `character-friend-${character.id}-ending_special_virus`,
			dbId: crypto.randomUUID(),
			projectId: character.projectId,
			file: `chara_${character.id}`,
			type: StoryPatchType.Insert,
			storyId: 'ending_special_virus',
			locationKey: '[elseif mem_date_vace]',
			locationIndex: 0,
			body: `	[elseif mem_date_${character.id}]
		// Your code here - if dated ${character.nickname} while getting Tangent's Cure ending
	`,
			category: 'Ending - Tangent\'s Cure',
			order: 0
		})

		// Sym's ending may mention Player's date
		patches.push({
			id: `character-friend-${character.id}-ending_chara_sym`,
			dbId: crypto.randomUUID(),
			projectId: character.projectId,
			file: `chara_${character.id}`,
			type: StoryPatchType.Insert,
			storyId: 'ending_chara_sym',
			locationKey: '[elseif mem_date_nomi]',
			locationIndex: 0,
			body: `[elseif mem_date_${character.id}]
			// Your code here - if dated ${character.nickname} while getting peace ending, what would be added to Sym's ending - ${character.nickname}'s opinion about Sym moving in with you
			`,
			category: 'Ending - Sym (peace ending, may mention Player\'s date)',
			order: 0
		})

		// Talking to mom (momRepeat) event
		patches.push({
			id: `character-friend-${character.id}-mom-repeat-patch`,
			dbId: crypto.randomUUID(),
			projectId: character.projectId,
			file: `chara_${character.id}`,
			type: StoryPatchType.Insert,
			storyId: 'momRepeat',
			locationKey: '[else if mem_date_dys && mem_dysLeft]',
			locationIndex: 0,
			category: 'Talking to mom',
			order: 0,
			body: `		[else if mem_date_${character.id}]
			// Your code here - mom's opinion about you dating ${character.nickname}
				`
		})

		// Talking to dad (dadRepeat) event
		patches.push({
			id: `character-friend-${character.id}-dad-repeat-patch`,
			dbId: crypto.randomUUID(),
			projectId: character.projectId,
			file: `chara_${character.id}`,
			type: StoryPatchType.Insert,
			storyId: 'dadRepeat',
			locationKey: '[else if mem_date_dys && mem_dysLeft]',
			locationIndex: 0,
			category: 'Talking to dad',
			order: 0,
			body: `		[else if mem_date_${character.id}]
			// Your code here - dad's opinion about you dating ${character.nickname}
				`
		})

		// Jobs - Delivery repeat (basic) event
		patches.push({
			id: `character-friend-${character.id}-jobs-delivery-repeat-patch`,
			dbId: crypto.randomUUID(),
			projectId: character.projectId,
			file: `chara_${character.id}`,
			type: StoryPatchType.Insert,
			storyId: 'deliveryRepeat',
			locationKey: '[else if mem_date_dys && mem_dysLeft]',
			locationIndex: 0,
			category: 'Jobs (if date inserts)',
			order: 0,
			body: `			[else if mem_date_${character.id}]
				Delivering packages isn't very complicated, giving your mind plenty of time to wander while you work. Inevitably, your thoughts turn to Dys. You wonder if he's doing okay, wherever he is...
				
				You think about Dys so much, you completely forget where you were walking and have to retrace your steps. Whoops!
					`
		})

		// Jobs - Depot Clerk (depotRepeat) event
		patches.push({
			id: `character-friend-${character.id}-jobs-depot-clerk-patch`,
			dbId: crypto.randomUUID(),
			projectId: character.projectId,
			file: `chara_${character.id}`,
			type: StoryPatchType.Insert,
			storyId: 'depotRepeat',
			locationKey: '[else if mem_date_dys && mem_dysLeft]',
			locationIndex: 0,
			category: 'Jobs (if date inserts)',
			order: 0,
			body: `				[else if mem_date_${character.id}]
					// Your code here - if dated ${character.nickname} while working Depot Clerk
					`
		})

		// Jobs - Construction (constructionRepeat) event
		patches.push({
			id: `character-friend-${character.id}-jobs-construction-patch`,
			dbId: crypto.randomUUID(),
			projectId: character.projectId,
			file: `chara_${character.id}`,
			type: StoryPatchType.Insert,
			storyId: 'constructionRepeat',
			locationKey: '[else if mem_date_dys && mem_dysLeft]',
			locationIndex: 0,
			category: 'Jobs (if date inserts)',
			order: 0,
			body: `		[else if mem_date_${character.id}]
			// Your code here - if dated ${character.nickname} while working Construction
				`
		})

		// Jobs - Leader (leaderRepeat) event
		patches.push({
			id: `character-friend-${character.id}-jobs-leader-patch`,
			dbId: crypto.randomUUID(),
			projectId: character.projectId,
			file: `chara_${character.id}`,
			type: StoryPatchType.Insert,
			storyId: 'leaderRepeat',
			locationKey: '[else if mem_date_dys && mem_dysLeft]',
			locationIndex: 0,
			category: 'Jobs (if date inserts)',
			order: 0,
			body: `		[else if mem_date_${character.id}]
			// Your code here - if dated ${character.nickname} while working Leader
				`
		})

		// Jobs - Tutoring (tutoringRepeat) event
		patches.push({
			id: `character-friend-${character.id}-jobs-tutoring-patch`,
			dbId: crypto.randomUUID(),
			projectId: character.projectId,
			file: `chara_${character.id}`,
			type: StoryPatchType.Insert,
			storyId: 'tutoringRepeat',
			locationKey: '[else if mem_date_dys && mem_dysLeft]',
			locationIndex: 0,
			category: 'Jobs (if date inserts)',
			order: 0,
			body: `		[else if mem_date_${character.id}]
			// Your code here - if dated ${character.nickname} while working Tutoring
				`
		})

		// Jobs - Robot Repair (robotRepeat) event
		patches.push({
			id: `character-friend-${character.id}-jobs-robot-repair-patch`,
			dbId: crypto.randomUUID(),
			projectId: character.projectId,
			file: `chara_${character.id}`,
			type: StoryPatchType.Insert,
			storyId: 'robotRepeat',
			locationKey: '[else if mem_date_dys && mem_dysLeft && mem_dead_dys]',
			locationIndex: 0,
			category: 'Jobs (if date inserts)',
			order: 0,
			body: `		[else if mem_date_${character.id}]
			// Your code here - if dated ${character.nickname} while working Robot Repair
				`
		})

		// Jobs - Nursing Assistant (nursingRepeat) event
		patches.push({
			id: `character-friend-${character.id}-jobs-nursing-patch`,
			dbId: crypto.randomUUID(),
			projectId: character.projectId,
			file: `chara_${character.id}`,
			type: StoryPatchType.Insert,
			storyId: 'nursingRepeat',
			locationKey: '[else if mem_date_dys && mem_dysLeft]',
			locationIndex: 0,
			category: 'Jobs (if date inserts)',
			order: 0,
			body: `		[else if mem_date_${character.id}]
			// Your code here - if dated ${character.nickname} while working Nursing Assistant
				`
		})

		// Jobs - Defense Training (defenseRepeat) event
		patches.push({
			id: `character-friend-${character.id}-jobs-defense-training-patch`,
			dbId: crypto.randomUUID(),
			projectId: character.projectId,
			file: `chara_${character.id}`,
			type: StoryPatchType.Insert,
			storyId: 'defenseRepeat',
			locationKey: '[else if mem_date_dys && mem_dysLeft]',
			locationIndex: 0,
			category: 'Jobs (if date inserts)',
			order: 0,
			body: `		[else if mem_date_${character.id}]
			// Your code here - if dated ${character.nickname} while working Defense Training
				`
		})

		// Jobs - Lookout Duty (lookoutRepeat) event
		patches.push({
			id: `character-friend-${character.id}-jobs-lookout-duty-patch`,
			dbId: crypto.randomUUID(),
			projectId: character.projectId,
			file: `chara_${character.id}`,
			type: StoryPatchType.Insert,
			storyId: 'lookoutRepeat',
			locationKey: '[else if mem_date_dys && mem_dysLeft]',
			locationIndex: 0,
			category: 'Jobs (if date inserts)',
			order: 0,
			body: `		[else if mem_date_${character.id}]
			// Your code here - if dated ${character.nickname} while working Lookout Duty
				`
		})

		// Jobs - Guard Duty (guardRepeat) event
		patches.push({
			id: `character-friend-${character.id}-jobs-guard-duty-patch`,
			dbId: crypto.randomUUID(),
			projectId: character.projectId,
			file: `chara_${character.id}`,
			type: StoryPatchType.Insert,
			storyId: 'guardRepeat',
			locationKey: '[else if mem_date_dys && mem_dysLeft]',
			locationIndex: 0,
			category: 'Jobs (if date inserts)',
			order: 0,
			body: `		[else if mem_date_${character.id}]
			// Your code here - if dated ${character.nickname} while working Guard Duty
				`
		})

		// Jobs - Relax on the Walls (relaxWallsRepeat) event
		patches.push({
			id: `character-friend-${character.id}-jobs-relax-on-the-walls-patch`,
			dbId: crypto.randomUUID(),
			projectId: character.projectId,
			file: `chara_${character.id}`,
			type: StoryPatchType.Insert,
			storyId: 'relaxWallsRepeat',
			locationKey: '[else if mem_date_dys && mem_dysLeft]',
			locationIndex: 0,
			category: 'Jobs (if date inserts)',
			order: 0,
			body: `		[else if mem_date_${character.id}]
			// Your code here - if dated ${character.nickname} while relaxing on the walls
				`
		})

		// Jobs - Xenobotany (plantsRepeat) event
		patches.push({
			id: `character-friend-${character.id}-jobs-xenobotany-patch`,
			dbId: crypto.randomUUID(),
			projectId: character.projectId,
			file: `chara_${character.id}`,
			type: StoryPatchType.Insert,
			storyId: 'plantsRepeat',
			locationKey: '[else if mem_date_dys && mem_dysLeft]',
			locationIndex: 0,
			category: 'Jobs (if date inserts)',
			order: 0,
			body: `		[else if mem_date_${character.id}]
			// Your code here - if dated ${character.nickname} while working Xenobotany
				`
		})

		// Jobs - Tending Animals (animalsRepeat) event
		patches.push({
			id: `character-friend-${character.id}-jobs-animals-patch`,
			dbId: crypto.randomUUID(),
			projectId: character.projectId,
			file: `chara_${character.id}`,
			type: StoryPatchType.Insert,
			storyId: 'animalsRepeat',
			locationKey: '[else if mem_date_dys && mem_dysLeft]',
			locationIndex: 0,
			category: 'Jobs (if date inserts)',
			order: 0,
			body: `		[else if mem_date_${character.id}]
			// Your code here - if dated ${character.nickname} while working Tending Animals
				`
		})

		// Jobs - Relax in the Park (relaxParkRepeat) event
		patches.push({
			id: `character-friend-${character.id}-jobs-relax-in-the-park-patch`,
			dbId: crypto.randomUUID(),
			projectId: character.projectId,
			file: `chara_${character.id}`,
			type: StoryPatchType.Insert,
			storyId: 'relaxParkRepeat',
			locationKey: '[else if mem_date_dys && mem_dysLeft]',
			locationIndex: 0,
			category: 'Jobs (if date inserts)',
			order: 0,
			body: `		[else if mem_date_${character.id}]
			// Your code here - if dated ${character.nickname} while relaxing in the park
				`
		})

		// Jobs - Cooking (cookingRepeat) event
		patches.push({
			id: `character-friend-${character.id}-jobs-cooking-patch`,
			dbId: crypto.randomUUID(),
			projectId: character.projectId,
			file: `chara_${character.id}`,
			type: StoryPatchType.Insert,
			storyId: 'cookingRepeat',
			locationKey: '[else if mem_date_dys && mem_dysLeft]',
			locationIndex: 0,
			category: 'Jobs  (if date inserts)',
			order: 0,
			body: `		[else if mem_date_${character.id}]
			// Your code here - if dated ${character.nickname} while working Cooking
				`
		})

		// Jobs - Barista (baristaRepeat) event
		patches.push({
			id: `character-friend-${character.id}-jobs-barista-patch`,
			dbId: crypto.randomUUID(),
			projectId: character.projectId,
			file: `chara_${character.id}`,
			type: StoryPatchType.Insert,
			storyId: 'baristaRepeat',
			locationKey: '[else if mem_date_dys && mem_dysLeft]',
			locationIndex: 0,
			category: 'Jobs (if date inserts)',
			order: 0,
			body: `		[else if mem_date_${character.id}]
			// Your code here - if dated ${character.nickname} while working Barista
				`
		})

		// Jobs - Play the Photophonor (photophonorRepeat) event
		patches.push({
			id: `character-friend-${character.id}-jobs-photophonor-patch`,
			dbId: crypto.randomUUID(),
			projectId: character.projectId,
			file: `chara_${character.id}`,
			type: StoryPatchType.Insert,
			storyId: 'photophonorRepeat',
			locationKey: '[else if mem_date_dys && mem_dysLeft]',
			locationIndex: 0,
			category: 'Jobs (if date inserts)',
			order: 0,
			body: `		[else if mem_date_${character.id}]
			// Your code here - if dated ${character.nickname} while playing the Photophonor
				`
		})

		// Jobs - Relax in the Lounge (relaxRepeat) event
		patches.push({
			id: `character-friend-${character.id}-jobs-relax-in-the-lounge-patch`,
			dbId: crypto.randomUUID(),
			projectId: character.projectId,
			file: `chara_${character.id}`,
			type: StoryPatchType.Insert,
			storyId: 'relaxRepeat',
			locationKey: '[else if mem_date_dys && mem_dysLeft]',
			locationIndex: 0,
			category: 'Jobs (if date inserts)',
			order: 0,
			body: `		[else if mem_date_${character.id}]
			// Your code here - if dated ${character.nickname} while relaxing in the lounge
				`
		})
	}

	return patches
}

const spacesToTabs = (str: string) => {
	return str.split('\n').map(line => {
		if (line.trim() === '') {
			return line
		}

		const match = line.match(/^(\s{2})+(\s*)(.*)$/)
		if (match) {
			const [, spaces, rest, content] = match
			const tabCount = Math.floor(spaces.length / 2)
			return '\t'.repeat(tabCount) + rest + content
		}

		return line
	}).join('\n')
}

export const nonFriendPresets = (character: Character, primarySkill: SkillId) => {
	const stories: Story[] = []

	if (!character.helioOnly) {
		const rebuildingId = crypto.randomUUID()
		stories.push({
			id: rebuildingId,
			projectId: character.projectId,
			dbId: rebuildingId,
			name: `${character.id}Rebuilding`,
			content: `	~if chara = _high_${character.id}
	~if mem_rebuilding
	~if repeat
	
	~set bg = destroyed
	~set left = ${character.id}
	
	[if random]
		
	[else]
		
	[else]
		
	[else]

	[end]`,
			file: `chara_${character.id}`,
			category: `${character.nickname} - High Priority`,
			order: 1
		})
	}

	const mourningId = crypto.randomUUID()
	stories.push({
		id: mourningId,
		projectId: character.projectId,
		dbId: mourningId,
		name: `${character.id}Mourning`,
		content: `	~if chara = _high_${character.id}
	// block any happier events while you're in mourning for something not caught above
	~if status = mourning
	~if repeat
	
	[if mem_dead_dad && story_main_shimmerEnd <= 2]

	[else mem_dead_mom && story_main_starveDeath <= 4]

	[else]

	[end]`,
		file: `chara_${character.id}`,
		category: `${character.nickname} - High Priority`,
		order: 2
	})

	const introId = crypto.randomUUID()
	stories.push({
		id: introId,
		projectId: character.projectId,
		dbId: introId,
		name: `${character.id}Intro`,
		content: `	~if chara = high_${character.id}
	~set bg = ${character.defaultBg ?? 'colony'}
	
	// Your code here`,
		file: `chara_${character.id}`,
		category: `${character.nickname} - High Priority`,
		order: 3
	})

	const repeatId = crypto.randomUUID()

	if (character.helioOnly) {
		stories.push({
			id: repeatId,
			projectId: character.projectId,
			dbId: repeatId,
			name: `${character.id}Repeat`,
			content: spacesToTabs(`      ~if chara = low_${character.id}
      ~if repeat
    
      // A lot of code block placeholders here, can be removed or added as needed, these are just modeled after Dad
      
      [if season == glow]
    
      [else if mem_starve]
        
        [if random!]
    
        [else]
    
        [else]
    
        [else if !mem_beansNever]
    
        [end]
    
      [else if age == 15]
      
        [if random!]
    
        [else]
    
        [else]
    
        [else]
    
        [end]
        
      [else if season == pollen && !mem_shimmerCure]
      
        [if random!]
    
        [else]
    
        [else]
    
        [else]
    
        [end]
          
      [else]
    
        [if random!]
    
        [else]
    
        [else]
    
        [else]
    
        [else]
    
        [else]
    
        [else]
    
        [else]
    
        [else]
    
        [else]
    
        [else if age == 12]
    
        [else if age >= 14]
    
        [else if age < 15]
    
        [else if age == 16]
    
        [else if age > 17]
    
        [else if mem_leader = player]
        
        [else]
        
        [else if season == pollen && mem_shimmerCure]
    
        [else if mem_shimmerCure]
    
        [else if season == dust]
    
        [else if season == wet]
    
        [else if mem_war]
    
        [else if call_dating]
        
          [if mem_date_sym]
    
          [else if mem_date_dys && mem_dysLeft]
    
          [else]
          
          [end]
          
        [end]
        
      [end]
      
      // Helios do not get 20 skill interaction

      * Skill interaction 40
        ~ifd skill_${primarySkill} >= 40
        ~if mem_${character.id}Unlock == 1
        ~set mem_${character.id}Unlock = 2
        // Gift a fitting card with ~set card = cardname
        
        // Your code here
        
        -
        ~set skill_${primarySkill}++
        
        // Your code here
        
      * Skill interaction 80
        ~ifd skill_${primarySkill} >= 80
        ~if mem_${character.id}Unlock == 2
        ~set mem_${character.id}Unlock = 3
        // Gift a fitting card with ~set card = cardname
        
        // Your code here
        
        -
        ~set skill_${primarySkill}++
        
        // Your code here
      
      * Done
        // get out of here`),
			file: `chara_${character.id}`,
			category: `${character.nickname} - Low Priority`,
			order: 1
		})
	} else {
		stories.push({
			id: repeatId,
			projectId: character.projectId,
			dbId: repeatId,
			name: `${character.id}Repeat`,
			content: spacesToTabs(`	~if chara = low_${character.id}
	~if repeat

  // A lot of code block placeholders here, can be removed or added as needed, these are just modeled after Dad
	
	[if season == glow]

	[else if mem_starve]
		
		[if random!]

		[else]

		[else]

		[else if !mem_beansNever]

		[end]

	[else if age == 15]
	
		[if random!]

		[else]

		[else]

		[else]

		[end]
		
	[else if season == pollen && !mem_shimmerCure]
	
		[if random!]

		[else]

		[else]

		[else]

		[end]
			
	[else]

		[if random!]

		[else]

		[else]

		[else]

		[else]

		[else]

		[else]

		[else]

		[else]

		[else]

		[else if age == 12]

		[else if age >= 14]

		[else if age < 15]

		[else if age == 16]

		[else if age > 17]

		[else if mem_leader = player]
		
		[else]
		
		[else if season == pollen && mem_shimmerCure]

		[else if mem_shimmerCure]

		[else if season == dust]

		[else if season == wet]

		[else if mem_war]

		[else if call_dating]
		
			[if mem_date_sym]

			[else if mem_date_dys && mem_dysLeft]

			[else]
			
			[end]
			
		[end]
		
	[end]
	
	* Skill interaction 20
		~ifd skill_${primarySkill} >= 20
		~if mem_${character.id}Unlock == 0
		~set mem_${character.id}Unlock = 1
    // Gift a fitting card with ~set card = cardname

		// Your code here
		-
		~set skill_${primarySkill}++
		
		// Your code here
		
	* Skill interaction 40
		~ifd skill_${primarySkill} >= 40
		~if mem_${character.id}Unlock == 1
		~set mem_${character.id}Unlock = 2
    // Gift a fitting card with ~set card = cardname
		
		// Your code here
		
		-
		~set skill_${primarySkill}++
		
		// Your code here
		
	* Skill interaction 80
		~ifd skill_${primarySkill} >= 80
		~if mem_${character.id}Unlock == 2
		~set mem_${character.id}Unlock = 3
    // Gift a fitting card with ~set card = cardname
		
		// Your code here
		
		-
		~set skill_${primarySkill}++
		
		// Your code here
	
	* Done
		// get out of here`),
			file: `chara_${character.id}`,
			category: `${character.nickname} - Low Priority`,
			order: 1
		})
	}

	return stories
}

const jobStory = (job: Job, i: number, project: ModProject) => {
	const id = crypto.randomUUID()
	return {
		id,
		projectId: job.projectId,
		dbId: id,
		name: `${job.id}${i}`,
		content: `	~if job = ${job.id}

	// Your code here`,
		file: `${project.folderName}_jobs`,
		category: `${job.name} - Job`,
		order: i + 1
	}
}

const jobUltimate = (job: Job, project: ModProject) => {
	const id = crypto.randomUUID()
	return {
		id,
		projectId: job.projectId,
		dbId: id,
		name: `${job.id}Ultimate`,
		content: `	~if job = high_${job.id}
	~if mem_work_${job.id} >= 10
	~if !mem_ultimate_${job.id}
	~if repeat_season = 2
	~if mem_newShip
	
	// Your code here, down below if you see skillname - replace it with whatever skill you want to use for the battle
	* Ultimate battle option
		~call battle(${job.primarySkill ?? 'skillname'}_hard)
		
	*= win
		
		// Your code here
		
		-
		~set mem_ultimate_${job.id}
		// ~set card = ultimate_${job.id} or some other card as a reward
		~set skill_kudos + 20
		
		// Your code here
		
	*= lose
	
		// Your code here`,
		file: `${project.folderName}_jobs`,
		category: `${job.name} - Job`,
		order: 7
	}
}

const jobCharactersRepeat = (job: Job, project: ModProject, charaId: string) => {
	const id = crypto.randomUUID()
	return {
		id,
		projectId: job.projectId,
		dbId: id,
		name: `${job.id}Repeat`,
		content: spacesToTabs(`	~if job = low_${job.id}
	~if repeat
    
	// 3/4 chance of regular event, 1/4 chance of seeing ${charaId}
	~setif random = 3 ? var_encounter = false : var_encounter = true
	~setif var_encounter ? midleft = ${charaId}

	// A lot of code block placeholders here, can be removed or added as needed, make sure to have mini events involving ${charaId} under if var_encounter part
	
	[if var_encounter]
	
		[if random!]
			
		[else]
			
		[else]
			
		[else]
			
		[else]
    
		[else]
			
		[end]
	
	[else]
    
		[if random]
			
		[else]
			
		[else]
			
		[else]
			
		[else]
			
		[else]
			
		[else]
			
		[else]
			
		[else if age < 15]
			
		[else if age < 15]
			
		[else if season == pollen]
			
		[else if season == wet]
			
		[else if season == dust]
			
		[else if season == glow]
			
		[else if season == quiet]
			
		[else if !mem_dead_dad]
			
		[else if call_dating]
			
			[if mem_date_sym]
    
			[else if mem_date_dys && mem_dysLeft]

			[else]
				[if random!]
					// Handling for many other dates, can use [=call_whodate()] to place name of the character you are dating with
					
				[else if mem_date_tang]

				[else if mem_date_marz]

				[else if mem_date_tammy]

				[else if mem_date_rex]

				[else if mem_date_nomi]

				[end]
		
			[end]
			
		[end]
		
	[end]`),
		file: `${project.folderName}_jobs`,
		category: `${job.name} - Job`,
		order: 8
	}
}

const jobRepeat = (job: Job, project: ModProject) => {
	const id = crypto.randomUUID()
	return {
		id,
		projectId: job.projectId,
		dbId: id,
		name: `${job.id}Repeat`,
		content: spacesToTabs(`	~if job = low_${job.id}
	~if repeat

	// A lot of code block placeholders here, can be removed or added as needed
	
	[if random]
  
	[else]
  
	[else]
  
	[else]
  
	[else]
  
	[else]
  
	[else]
  
	[else]
  
	[else if age < 15]
  
	[else if age < 15]
  
	[else if season == pollen]
  
	[else if season == wet]
  
	[else if season == dust]
  
	[else if season == glow]
  
	[else if season == quiet]
  
	[else if !mem_dead_dad]
  
	[else if call_dating]
		
		[if mem_date_sym]
  
		[else if mem_date_dys && mem_dysLeft]
  
		[else]
			[if random!]
		// Handling for many other dates, can use [=call_whodate()] to place name of the character you are dating with
		
			[else if mem_date_tang]
  
			[else if mem_date_marz]
  
			[else if mem_date_tammy]
  
			[else if mem_date_rex]
  
			[else if mem_date_nomi]
  
			[end]
			
		[end]
		
	[end]`),
		file: `${project.folderName}_jobs`,
		category: `${job.name} - Job`,
		order: 8
	}
}

export const jobPresets = (job: Job, project: ModProject) => {
	const stories: Story[] = []

	const firstId = crypto.randomUUID()
	stories.push({
		id: firstId,
		projectId: job.projectId,
		dbId: firstId,
		name: `${job.id}Start`,
		content: `	~if job = high_${job.id}

	// Your code here, first time the job is being done`,
		file: `${project.folderName}_jobs`,
		category: `${job.name} - Job`,
		order: 1
	})

	for (let i = 1; i <= 5; i++) {
		stories.push(jobStory(job, i, project))
	}

	if (!job.isRelax) {
		stories.push(jobUltimate(job, project))
	}

	if (job.characters?.length) {
		stories.push(jobCharactersRepeat(job, project, job.characters[0]))
	} else {
		stories.push(jobRepeat(job, project))
	}

	return stories
}

export const jobStoryPatches = (job: Job): StoryPatch[] => {
	const patches: StoryPatch[] = []

	if (job.location) {
		patches.push({
			id: `job-${job.id}-location-patch`,
			dbId: `job-${job.id}-location-patch`,
			projectId: job.projectId,
			type: StoryPatchType.Insert,
			storyId: job.location,
			locationKey: '* Leave',
			locationIndex: 0,
			body: job.isRelax ? `	* ${job.name}
		~if mem_job_${job.id}
		~call job(${job.id})
	` : `	* ${job.name}
		~if mem_job_${job.id}
		~ifd status != stressed
		~call job(${job.id})
`,
			category: `Job buttons at ${job.location}`,
			order: 0
		})
	}

	return patches
}

export const endingPresets = (ending: Ending, project: ModProject) => {
	const stories: Story[] = []

	const id = crypto.randomUUID()

	if (ending.isSpecial) {
		stories.push({
			id: id,
			projectId: ending.projectId,
			dbId: id,
			name: `ending_special_${ending.id}`,
			content: `	~if location == none
	
	// preamble: ${ending.preamble}
	// title: ${ending.name}
	
	// Your code here
	// skips charas and ending_end straight to ending_oldsol`,
			file: `${project.folderName}_endings`,
			category: 'Endings - Special'
		})
	} else {
		stories.push({
			id: id,
			projectId: ending.projectId,
			dbId: id,
			name: `ending_${ending.id}`,
			content: `	~if location == none
	
	// preamble: ${ending.preamble}
	// title: ${ending.name}
	
	// Your code here
  	* Low rebellion option
		~ifd skill_rebellion <= 50
		
		// Your code here
	* High rebellion option
		~ifd skill_rebellion > 50
		
		// Your code here
	*= end
	
	// Your code here that's shared for both options`,
			file: `${project.folderName}_endings`,
			category: 'Endings - Default'
		})
	}

	return stories
}
