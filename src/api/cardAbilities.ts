export const cardAbilities = [
  {
    "id": "gemsWild",
    "name": "Gems are wild",
    "category": "global",
    "text": "Cards with gems are wild",
    "tooltip": "All cards with gems become every suit",
    "tooltipNegative": "",
    "tooltipGearCollectibleCondition": ""
  },
  {
    "id": "setSuitRight",
    "name": "Set Suit Right",
    "category": "positional",
    "text": "Card to right becomes [suit]",
    "tooltip": "",
    "tooltipNegative": "",
    "tooltipGearCollectibleCondition": ""
  },
  {
    "id": "setSuitNeighbors",
    "name": "Set Suit Neighbors",
    "category": "positional",
    "text": "Neighbors become [suit]",
    "tooltip": "",
    "tooltipNegative": "",
    "tooltipGearCollectibleCondition": ""
  },
  {
    "id": "setSuitAllRight",
    "name": "Set Suit All Right",
    "category": "positional",
    "text": "All cards to right become [suit]",
    "tooltip": "",
    "tooltipNegative": "",
    "tooltipGearCollectibleCondition": ""
  },
  {
    "id": "collectiblePlusSuit",
    "name": "Plus Value and Change Suit",
    "category": "self",
    "text": "[+x] to a card\\nChange suit to [suit]",
    "tooltip": "[+x] and change suit to [suit] (from a one-use collectible item)",
    "tooltipNegative": "",
    "tooltipGearCollectibleCondition": "[+x] to a card and change suit to [suit]. Drop on card to use. One-use."
  },
  // {
  //   "id": "paneSuit",
  //   "name": "Suit Slot",
  //   "category": "pane",
  //   "text": "Card becomes [suit]",
  //   "tooltip": "Change the suit of the card in this slot to [x]",
  //   "tooltipNegative": "",
  //   "tooltipGearCollectibleCondition": "One slot will turn cards [suit]"
  // },
  {
    "id": "firstToLast",
    "name": "First to Last",
    "category": "global",
    "text": "First card gets [-x]\\nLast card gets [+x]",
    "tooltip": "First card gets [-x]\\nLast card gets [+x]",
    "tooltipNegative": "",
    "tooltipGearCollectibleCondition": ""
  },
  {
    "id": "plusFirst",
    "name": "Plus First",
    "category": "global",
    "text": "[+x] to first [suit] card",
    "tooltip": "[+x] to [suit] card in leftmost pane",
    "tooltipNegative": "",
    "tooltipGearCollectibleCondition": ""
  },
  {
    "id": "plusLast",
    "name": "Plus Last",
    "category": "global",
    "text": "[+x] to last [suit] card",
    "tooltip": "[+x] to [suit] card in rightmost pane",
    "tooltipNegative": "",
    "tooltipGearCollectibleCondition": ""
  },
  {
    "id": "plusAll",
    "name": "Plus All",
    "category": "global",
    "text": "[+x] to [suit] cards",
    "tooltip": "[+x] to [suit] cards",
    "tooltipNegative": "",
    "tooltipGearCollectibleCondition": ""
  },
  {
    "id": "plusNotSuit",
    "name": "Plus All Not Suit",
    "category": "global",
    "text": "[+x] to non-[suit] cards",
    "tooltip": "[+x] to cards that are not [suit]",
    "tooltipNegative": "",
    "tooltipGearCollectibleCondition": ""
  },
  {
    "id": "plusToGems",
    "name": "Plus To Gems",
    "category": "global",
    "text": "[+x] to cards with gems",
    "tooltip": "[+x] to cards with gem icon at bottom-left of card",
    "tooltipNegative": "",
    "tooltipGearCollectibleCondition": ""
  },
  {
    "id": "allWildNumber",
    "name": "Set All Wild Number",
    "category": "global",
    "text": "All [suit] card values become wild",
    "tooltip": "Wildcard values match as all pairs or straights",
    "tooltipNegative": "",
    "tooltipGearCollectibleCondition": ""
  },
  {
    "id": "ifLeftSuit",
    "name": "If Left Suit",
    "category": "positional",
    "text": "[+x] if left card is [suit]",
    "tooltip": "",
    "tooltipNegative": "",
    "tooltipGearCollectibleCondition": ""
  },
  {
    "id": "ifRightSuit",
    "name": "If Right Suit",
    "category": "positional",
    "text": "[+x] if right card is [suit]",
    "tooltip": "",
    "tooltipNegative": "",
    "tooltipGearCollectibleCondition": ""
  },
  {
    "id": "ifOnlySuit",
    "name": "If Only Suit",
    "category": "positional",
    "text": "[+x] if this is the only [suit] card",
    "tooltip": "",
    "tooltipNegative": "",
    "tooltipGearCollectibleCondition": ""
  },
  {
    "id": "plusForPosition",
    "name": "Plus For Position",
    "category": "positional",
    "text": "[+x] for every [suit] card to left",
    "tooltip": "",
    "tooltipNegative": "",
    "tooltipGearCollectibleCondition": ""
  },
  {
    "id": "plusForEdge",
    "name": "Plus in Edge Panes",
    "category": "positional",
    "text": "[+x] if in the first or last pane",
    "tooltip": "",
    "tooltipNegative": "",
    "tooltipGearCollectibleCondition": ""
  },
  {
    "id": "plusIfSuitBattle",
    "name": "Plus If Suit Challenge",
    "category": "positional",
    "text": "[+x] during [suit] challenges",
    "tooltip": "",
    "tooltipNegative": "",
    "tooltipGearCollectibleCondition": ""
  },
  {
    "id": "plusForGems",
    "name": "Plus For Gems",
    "category": "positional",
    "text": "[+x] for each gem on other [suit] cards",
    "tooltip": "",
    "tooltipNegative": "",
    "tooltipGearCollectibleCondition": ""
  },
  {
    "id": "plusLastStage",
    "name": "Plus on Third Stage",
    "category": "self",
    "text": "[+x] on third stage of challenges",
    "tooltip": "Only takes effect on three round challenges",
    "tooltipNegative": "",
    "tooltipGearCollectibleCondition": ""
  },
  {
    "id": "plusForHighStress",
    "name": "Plus for High Stress",
    "category": "self",
    "text": "[+x] if stress over 50",
    "tooltip": "",
    "tooltipNegative": "",
    "tooltipGearCollectibleCondition": ""
  },
  {
    "id": "plusUnplayedCards",
    "name": "Plus for Unplayed Cards",
    "category": "positional",
    "text": "[+x] for each unplayed card",
    "tooltip": "",
    "tooltipNegative": "",
    "tooltipGearCollectibleCondition": ""
  },
  {
    "id": "forEachNeighbor",
    "name": "For Each Neighbor",
    "category": "positional",
    "text": "[+x] if left card is [suit]\\n[+x] if right card is [suit]",
    "tooltip": "",
    "tooltipNegative": "",
    "tooltipGearCollectibleCondition": ""
  },
  {
    "id": "wildNumber",
    "name": "Wildcard Number",
    "category": "self",
    "text": "Value is Wild",
    "tooltip": "Wildcard values match as all pairs or straights",
    "tooltipNegative": "",
    "tooltipGearCollectibleCondition": ""
  },
  {
    "id": "collectiblePlus",
    "name": "Plus Value",
    "category": "self",
    "text": "[+x] to a card",
    "tooltip": "[+x] to a card (from a one-use collectible item)",
    "tooltipNegative": "",
    "tooltipGearCollectibleCondition": "[+x] to a card. Drop on card to use. One-use."
  },
  {
    "id": "plusForSuit",
    "name": "Plus For Suit",
    "category": "positional",
    "text": "[+x] for every other [suit] card",
    "tooltip": "",
    "tooltipNegative": "",
    "tooltipGearCollectibleCondition": ""
  },
  {
    "id": "plusToAndFrom",
    "name": "Plus To And From Suit",
    "category": "positional",
    "text": "[+x] to and from other [suit] cards",
    "tooltip": "[+x] to every other [suit] card, and [+x] to this card for every other [suit] card",
    "tooltipNegative": "",
    "tooltipGearCollectibleCondition": ""
  },
  // {
  //   "id": "paneSet",
  //   "name": "Set-value slot",
  //   "category": "pane",
  //   "text": "Card becomes [x]",
  //   "tooltip": "Change card value to [x]",
  //   "tooltipNegative": "",
  //   "tooltipGearCollectibleCondition": "One slot card becomes value [x]"
  // },
  // {
  //   "id": "panePlus",
  //   "name": "Plus to Slot",
  //   "category": "pane",
  //   "text": "Card gets [+x]",
  //   "tooltip": "Card in this slot gets [+x]",
  //   "tooltipNegative": "",
  //   "tooltipGearCollectibleCondition": "One slot card gets [+x]"
  // },
  // {
  //   "id": "paneCardLocked",
  //   "name": "Locked Slot",
  //   "category": "pane",
  //   "text": "Card locked",
  //   "tooltip": "One card is already played for you and can't be changed",
  //   "tooltipNegative": "",
  //   "tooltipGearCollectibleCondition": "Random card locked in one slot"
  // },
  {
    "id": "plusLeft",
    "name": "Plus Left",
    "category": "positional",
    "text": "[+x] to [suit] card to left",
    "tooltip": "",
    "tooltipNegative": "",
    "tooltipGearCollectibleCondition": ""
  },
  {
    "id": "plusRight",
    "name": "Plus Right",
    "category": "positional",
    "text": "[+x] to [suit] card to right",
    "tooltip": "",
    "tooltipNegative": "",
    "tooltipGearCollectibleCondition": ""
  },
  {
    "id": "plusNeighbors",
    "name": "Plus Neighbors",
    "category": "positional",
    "text": "[+x] to neighboring [suit] cards",
    "tooltip": "",
    "tooltipNegative": "",
    "tooltipGearCollectibleCondition": ""
  },
  {
    "id": "plusNonSuitNeighbors",
    "name": "Plus Non Suit Neighbors",
    "category": "positional",
    "text": "[+x] to non-[suit] neighbors",
    "tooltip": "[+x] to adjacent cards that are not [suit]",
    "tooltipNegative": "",
    "tooltipGearCollectibleCondition": ""
  },
  {
    "id": "plusOthers",
    "name": "Plus All Other",
    "category": "positional",
    "text": "[+x] to all other [suit] cards",
    "tooltip": "",
    "tooltipNegative": "",
    "tooltipGearCollectibleCondition": ""
  },
  {
    "id": "plusAllLeft",
    "name": "Plus All Left",
    "category": "positional",
    "text": "[+x] to all [suit] cards to left",
    "tooltip": "",
    "tooltipNegative": "",
    "tooltipGearCollectibleCondition": ""
  },
  {
    "id": "plusAllRight",
    "name": "Plus All Right",
    "category": "positional",
    "text": "[+x] to all [suit] cards to right",
    "tooltip": "",
    "tooltipNegative": "",
    "tooltipGearCollectibleCondition": ""
  },
  {
    "id": "plusToAndFromGems",
    "name": "Plus To And From Gems",
    "category": "positional",
    "text": "[+x] to and from gem cards",
    "tooltip": "[+x] to every gem card, and [+x] to this card for the number of gem cards",
    "tooltipNegative": "",
    "tooltipGearCollectibleCondition": ""
  },
  {
    "id": "plusThisAndRight",
    "name": "Plus To This And Right",
    "category": "positional",
    "text": "if card to right is [suit], [+x] to both",
    "tooltip": "",
    "tooltipNegative": "",
    "tooltipGearCollectibleCondition": ""
  },
  {
    "id": "setRight",
    "name": "Set Right",
    "category": "positional",
    "text": "[Suit] Card to right becomes [x]",
    "tooltip": "",
    "tooltipNegative": "",
    "tooltipGearCollectibleCondition": ""
  },
  {
    "id": "setNeighbors",
    "name": "Set Neighbors",
    "category": "positional",
    "text": "Set [suit] neighbors to [x]",
    "tooltip": "",
    "tooltipNegative": "",
    "tooltipGearCollectibleCondition": ""
  },
  {
    "id": "setAllRight",
    "name": "Set All Right",
    "category": "positional",
    "text": "All [suit] cards to right become [x]",
    "tooltip": "",
    "tooltipNegative": "",
    "tooltipGearCollectibleCondition": ""
  },
  {
    "id": "setAll",
    "name": "Set All",
    "category": "global",
    "text": "All [suit] cards become [x]",
    "tooltip": "All [suit] card values are set to [x]",
    "tooltipNegative": "",
    "tooltipGearCollectibleCondition": ""
  },
  {
    "id": "setUpTo",
    "name": "Set Up To",
    "category": "global",
    "text": "All [suit] cards under [x] become [x]",
    "tooltip": "All [suit] cards with values lower than [x] are increased to [x]",
    "tooltipNegative": "",
    "tooltipGearCollectibleCondition": ""
  },
  {
    "id": "plusForOdd",
    "name": "Plus For Odd",
    "category": "positional",
    "text": "[+x] for every other odd [suit] card",
    "tooltip": "",
    "tooltipNegative": "",
    "tooltipGearCollectibleCondition": ""
  },
  {
    "id": "plusLower",
    "name": "Plus Lower",
    "category": "positional",
    "text": "[+x] to [suit] cards with lower values",
    "tooltip": "Lower values than this card when calculated from left to right",
    "tooltipNegative": "",
    "tooltipGearCollectibleCondition": ""
  },
  {
    "id": "plusHigher",
    "name": "Plus Higher",
    "category": "positional",
    "text": "[+x] to [suit] cards with higher values",
    "tooltip": "Higher values than this card when calculated from left to right",
    "tooltipNegative": "",
    "tooltipGearCollectibleCondition": ""
  },
  {
    "id": "plusIfHighest",
    "name": "Plus If Highest",
    "category": "positional",
    "text": "[+x] if this has the highest value",
    "tooltip": "[+x] if this has the highest value at end, no ties.",
    "tooltipNegative": "",
    "tooltipGearCollectibleCondition": ""
  },
  {
    "id": "multIfHighest",
    "name": "Mult If Highest",
    "category": "positional",
    "text": "x[x] if this has the highest value",
    "tooltip": "x[x] if this has the highest value at end, no ties.",
    "tooltipNegative": "",
    "tooltipGearCollectibleCondition": ""
  },
  // {
  //   "id": "paneDoubled",
  //   "name": "Double Slot",
  //   "category": "pane",
  //   "text": "Double card value",
  //   "tooltip": "The final value of the card in this slot is doubled",
  //   "tooltipNegative": "",
  //   "tooltipGearCollectibleCondition": "Double card value in one slot"
  // },
  {
    "id": "doubleRight",
    "name": "Double Right",
    "category": "positional",
    "text": "Double [suit] card to right",
    "tooltip": "The final value of the [suit] card to the right is doubled",
    "tooltipNegative": "",
    "tooltipGearCollectibleCondition": ""
  },
  {
    "id": "setNeighborsSame",
    "name": "Set Neighbors to Same",
    "category": "positional",
    "text": "Set [suit] neighbors to this value",
    "tooltip": "Includes bonus values applied to this card.",
    "tooltipNegative": "",
    "tooltipGearCollectibleCondition": ""
  },
  {
    "id": "unchangeable",
    "name": "Unchangeable",
    "category": "status",
    "text": "Unchangeable",
    "tooltip": "This card's value and suit can't be modified",
    "tooltipNegative": "",
    "tooltipGearCollectibleCondition": ""
  },
  {
    "id": "pet",
    "name": "Pet",
    "category": "status",
    "text": "",
    "tooltip": "Pets follow you and may appear in events",
    "tooltipNegative": "",
    "tooltipGearCollectibleCondition": ""
  },
  {
    "id": "gem",
    "name": "Gem",
    "category": "status",
    "text": "",
    "tooltip": "Gems matter for other cards",
    "tooltipNegative": "",
    "tooltipGearCollectibleCondition": ""
  },
  {
    "id": "locked",
    "name": "Locked",
    "category": "status",
    "text": "Locked",
    "tooltip": "Can't move locked cards",
    "tooltipNegative": "",
    "tooltipGearCollectibleCondition": ""
  },
  {
    "id": "keep",
    "name": "Keep",
    "category": "status",
    "text": "Keep Between Rounds",
    "tooltip": "Returns to hand after played in multi-round challenges",
    "tooltipNegative": "",
    "tooltipGearCollectibleCondition": ""
  },
  {
    "id": "straightsBonusThis",
    "name": "Straights Bonus for this card",
    "category": "status",
    "text": "[+x] to [suit] straights with this card",
    "tooltip": "",
    "tooltipNegative": "",
    "tooltipGearCollectibleCondition": ""
  },
  {
    "id": "pairsBonusThis",
    "name": "Pairs Bonus for this card",
    "category": "status",
    "text": "[+x] to [suit] pairs+ with this card",
    "tooltip": "Includes pairs, 3 of a kind, 4 of a kind, 5 of a kind",
    "tooltipNegative": "",
    "tooltipGearCollectibleCondition": ""
  },
  {
    "id": "flushesBonusThis",
    "name": "Flushes Bonus for this card",
    "category": "status",
    "text": "[+x] to [suit] flushes with this card",
    "tooltip": "",
    "tooltipNegative": "",
    "tooltipGearCollectibleCondition": ""
  },
  {
    "id": "draw",
    "name": "Draw Card",
    "category": "status",
    "text": "[x] extra card[s] when drawn",
    "tooltip": "Extra card[s] drawn when this card is first drawn",
    "tooltipNegative": "",
    "tooltipGearCollectibleCondition": ""
  },
  {
    "id": "duplicate",
    "name": "Duplicate Card",
    "category": "status",
    "text": "[x] duplicate[s] when drawn",
    "tooltip": "Cloned card[s] created when this card is first drawn",
    "tooltipNegative": "",
    "tooltipGearCollectibleCondition": ""
  },
  {
    "id": "kudos",
    "name": "Gain Kudos",
    "category": "status",
    "text": "[+x] Kudos",
    "tooltip": "[+x] Kudos at end of round if this card was played, even if you lose",
    "tooltipNegative": "",
    "tooltipGearCollectibleCondition": ""
  },
  {
    "id": "stress",
    "name": "Gain Stress",
    "category": "status",
    "text": "[+x] Stress",
    "tooltip": "[+x] Stress at end of round.",
    "tooltipNegative": "[+x] Stress at end of round. Doesn't work if you're at 100 stress.",
    "tooltipGearCollectibleCondition": ""
  },
  {
    "id": "collectibleDraw",
    "name": "Draw a Card",
    "category": "status",
    "text": "Draw a Card",
    "tooltip": "Instantly draw one card",
    "tooltipNegative": "",
    "tooltipGearCollectibleCondition": "Draw one card. Drop on board to use. One-use."
  },
  {
    "id": "collectibleNewHand",
    "name": "Redraw Hand",
    "category": "status",
    "text": "Redraw Hand",
    "tooltip": "Discard and Redraw Hand",
    "tooltipNegative": "",
    "tooltipGearCollectibleCondition": "Discard and Redraw Hand. Drop on board to use. One-use."
  },
  {
    "id": "straightsBonus",
    "name": "Straights Bonus",
    "category": "status",
    "text": "[+x] bonus to [suit] straights",
    "tooltip": "[+x] to [suit] straights of three or more cards",
    "tooltipNegative": "",
    "tooltipGearCollectibleCondition": ""
  },
  {
    "id": "pairsBonus",
    "name": "Pairs Bonus",
    "category": "status",
    "text": "[+x] bonus to [suit] pairs",
    "tooltip": "[+x] to [suit] pairs, 3 of a kind, 4 of a kind, 5 of a kind",
    "tooltipNegative": "",
    "tooltipGearCollectibleCondition": ""
  },
  {
    "id": "flushesBonus",
    "name": "Flushes Bonus",
    "category": "status",
    "text": "[+x] to all [suit] flushes",
    "tooltip": "[+x] to [suit] flushes of two or more cards",
    "tooltipNegative": "",
    "tooltipGearCollectibleCondition": ""
  },
  {
    "id": "straightsDoubled",
    "name": "Straight bonuses doubled",
    "category": "status",
    "text": "2x bonus for [suit] straights",
    "tooltip": "Twice the usual bonus for straights of 3, 4, or 5 cards",
    "tooltipNegative": "",
    "tooltipGearCollectibleCondition": ""
  },
  {
    "id": "pairsDoubled",
    "name": "Pair bonuses doubled",
    "category": "status",
    "text": "2x bonus for [suit] pairs",
    "tooltip": "Includes neighboring pairs, 3, 4, or 5 of a kind",
    "tooltipNegative": "",
    "tooltipGearCollectibleCondition": ""
  },
  {
    "id": "flushesDoubled",
    "name": "Flush bonuses doubled",
    "category": "status",
    "text": "2x bonus for [suit] flushes",
    "tooltip": "Twice the usual bonus for 2-5 cards of the same color",
    "tooltipNegative": "",
    "tooltipGearCollectibleCondition": ""
  },
  {
    "id": "tripletsTripled",
    "name": "Three of a kind bonus tripled",
    "category": "status",
    "text": "3x bonus for [suit] 3 of a kind",
    "tooltip": "Exactly 3 of the same number in a row gets triple the bonus",
    "tooltipNegative": "",
    "tooltipGearCollectibleCondition": ""
  },
  {
    "id": "pairsZeroed",
    "name": "Pairs worth nothing",
    "category": "status",
    "text": "All pairs worth zero",
    "tooltip": "Pairs are worth no points",
    "tooltipNegative": "",
    "tooltipGearCollectibleCondition": ""
  },
  {
    "id": "straightsZeroed",
    "name": "Straights worth nothing",
    "category": "status",
    "text": "All straights worth zero",
    "tooltip": "Straights are worth no points",
    "tooltipNegative": "",
    "tooltipGearCollectibleCondition": ""
  },
  {
    "id": "flushesZeroed",
    "name": "Fushes worth nothing",
    "category": "status",
    "text": "All flushes worth zero",
    "tooltip": "Flushes are worth no points",
    "tooltipNegative": "",
    "tooltipGearCollectibleCondition": ""
  },
  {
    "id": "exactRewardKudos",
    "name": "Kudos reward for exact total",
    "category": "status",
    "text": "[x] Kudos if total equals goal",
    "tooltip": "Kudos rewarded after win if total is exactly equal to the goal value",
    "tooltipNegative": "",
    "tooltipGearCollectibleCondition": ""
  },
  {
    "id": "globalBonusGear",
    "name": "Global Bonus",
    "category": "status",
    "text": "[+x] to [suit] challenges",
    "tooltip": "Total gets [+x] on the first round of [suit] challenges",
    "tooltipNegative": "",
    "tooltipGearCollectibleCondition": ""
  },
  {
    "id": "freeCollectible",
    "name": "One Free One Use card",
    "category": "status",
    "text": "First collectible use is free",
    "tooltip": "Use any owned one-use item for free once per battle",
    "tooltipNegative": "",
    "tooltipGearCollectibleCondition": ""
  },
  {
    "id": "rainbowFlushes",
    "name": "Rainbow Flushes",
    "category": "status",
    "text": "[+x] for Rainbow Flushes of 3",
    "tooltip": "Social, mental, and physical cards together in any order (no wildcards!)",
    "tooltipNegative": "",
    "tooltipGearCollectibleCondition": ""
  },
  {
    "id": "globalBonus",
    "name": "Global Bonus",
    "category": "status",
    "text": "[+x] to [suit] challenges",
    "tooltip": "Total gets [+x] during [suit] challenges",
    "tooltipNegative": "",
    "tooltipGearCollectibleCondition": ""
  },
  {
    "id": "autoplayOrder",
    "name": "Autoplay in draw order",
    "category": "status",
    "text": "Autoplay cards",
    "tooltip": "Cards auto played in order drawn and cannot be changed",
    "tooltipNegative": "",
    "tooltipGearCollectibleCondition": ""
  },
  {
    "id": "autoplayBest",
    "name": "Autoplay best hand",
    "category": "status",
    "text": "Autoplay best hand",
    "tooltip": "Best hand will always be played, then can be changed",
    "tooltipNegative": "",
    "tooltipGearCollectibleCondition": ""
  },
  {
    "id": "plusWinSkill",
    "name": "Plus Win Skill",
    "category": "status",
    "text": "[+x] skill on [suit] challenge win",
    "tooltip": "[+x] to skill reward at end of [suit] challenge, only if you win",
    "tooltipNegative": "",
    "tooltipGearCollectibleCondition": ""
  },
  {
    "id": "gearEmpathy",
    "name": "Empathy",
    "category": "external",
    "text": "[+x] Empathy",
    "tooltip": "No effect in challenges",
    "tooltipNegative": "",
    "tooltipGearCollectibleCondition": ""
  },
  {
    "id": "gearPersuasion",
    "name": "Persuasion",
    "category": "external",
    "text": "[+x] Persuasion",
    "tooltip": "No effect in challenges",
    "tooltipNegative": "",
    "tooltipGearCollectibleCondition": ""
  },
  {
    "id": "gearCreativity",
    "name": "Creativity",
    "category": "external",
    "text": "[+x] Creativity",
    "tooltip": "No effect in challenges",
    "tooltipNegative": "",
    "tooltipGearCollectibleCondition": ""
  },
  {
    "id": "gearBravery",
    "name": "Bravery",
    "category": "external",
    "text": "[+x] Bravery",
    "tooltip": "No effect in challenges",
    "tooltipNegative": "",
    "tooltipGearCollectibleCondition": ""
  },
  {
    "id": "gearReasoning",
    "name": "Reasoning",
    "category": "external",
    "text": "[+x] Reasoning",
    "tooltip": "No effect in challenges",
    "tooltipNegative": "",
    "tooltipGearCollectibleCondition": ""
  },
  {
    "id": "gearOrganization",
    "name": "Organization",
    "category": "external",
    "text": "[+x] Organization",
    "tooltip": "No effect in challenges",
    "tooltipNegative": "",
    "tooltipGearCollectibleCondition": ""
  },
  {
    "id": "gearEngineering",
    "name": "Engineering",
    "category": "external",
    "text": "[+x] Engineering",
    "tooltip": "No effect in challenges",
    "tooltipNegative": "",
    "tooltipGearCollectibleCondition": ""
  },
  {
    "id": "gearBiology",
    "name": "Biology",
    "category": "external",
    "text": "[+x] Biology",
    "tooltip": "No effect in challenges",
    "tooltipNegative": "",
    "tooltipGearCollectibleCondition": ""
  },
  {
    "id": "gearToughness",
    "name": "Toughness",
    "category": "external",
    "text": "[+x] Toughness",
    "tooltip": "No effect in challenges",
    "tooltipNegative": "",
    "tooltipGearCollectibleCondition": ""
  },
  {
    "id": "gearPerception",
    "name": "Perception",
    "category": "external",
    "text": "[+x] Perception",
    "tooltip": "No effect in challenges",
    "tooltipNegative": "",
    "tooltipGearCollectibleCondition": ""
  },
  {
    "id": "gearCombat",
    "name": "Combat",
    "category": "external",
    "text": "[+x] Combat",
    "tooltip": "No effect in challenges",
    "tooltipNegative": "",
    "tooltipGearCollectibleCondition": ""
  },
  {
    "id": "gearAnimals",
    "name": "Animals",
    "category": "external",
    "text": "[+x] Animals",
    "tooltip": "No effect in challenges",
    "tooltipNegative": "",
    "tooltipGearCollectibleCondition": ""
  },
  {
    "id": "perkPerceptionAnimals",
    "name": "Bonus Perception and Animals Skills",
    "category": "external",
    "text": "[+x] when you gain Perception or Animals",
    "tooltip": "No effect in challenges",
    "tooltipNegative": "",
    "tooltipGearCollectibleCondition": ""
  },
  {
    "id": "perkCreativityOrganization",
    "name": "Bonus Creativity and Organization Skills",
    "category": "external",
    "text": "[+x] when you gain Creativity or Organization",
    "tooltip": "No effect in challenges",
    "tooltipNegative": "",
    "tooltipGearCollectibleCondition": ""
  },
  {
    "id": "perkBiologyEngineering",
    "name": "Bonus Biology and Engineering Skills",
    "category": "external",
    "text": "[+x] when you gain Biology or Engineering",
    "tooltip": "No effect in challenges",
    "tooltipNegative": "",
    "tooltipGearCollectibleCondition": ""
  },
  {
    "id": "perkToughnessCombat",
    "name": "Bonus Toughness and Combat Skills",
    "category": "external",
    "text": "[+x] when you gain Toughness or Combat",
    "tooltip": "No effect in challenges",
    "tooltipNegative": "",
    "tooltipGearCollectibleCondition": ""
  },
  {
    "id": "gearDraw",
    "name": "Draw Card Gear",
    "category": "external",
    "text": "Draw [x] extra card[s]",
    "tooltip": "Extra card[s] drawn at battle start",
    "tooltipNegative": "",
    "tooltipGearCollectibleCondition": ""
  },
  {
    "id": "gearAllSkills",
    "name": "All Skills",
    "category": "external",
    "text": "[+x] to all [suit] skills",
    "tooltip": "No effect in challenges",
    "tooltipNegative": "",
    "tooltipGearCollectibleCondition": ""
  },
  {
    "id": "gearReduceStress",
    "name": "Reduce Stress",
    "category": "external",
    "text": "Gain [x] less Stress",
    "tooltip": "Reduce stress by up to [x] any time it increases",
    "tooltipNegative": "Increase stress by an extra [-x] any time it increases",
    "tooltipGearCollectibleCondition": ""
  },
  {
    "id": "extraKudos",
    "name": "Extra Kudos",
    "category": "external",
    "text": "[+x] Kudos when you gain kudos",
    "tooltip": "No effect in challenges",
    "tooltipNegative": "",
    "tooltipGearCollectibleCondition": ""
  },
  {
    "id": "multiplyRebellion",
    "name": "Multiply rebellion increases",
    "category": "external",
    "text": "[+x]% more rebellion increases",
    "tooltip": "No effect in challenges",
    "tooltipNegative": "",
    "tooltipGearCollectibleCondition": ""
  },
  {
    "id": "multiplyKudos",
    "name": "Multiply Kudos gained",
    "category": "external",
    "text": "[+x]% more Kudos",
    "tooltip": "No effect in challenges",
    "tooltipNegative": "",
    "tooltipGearCollectibleCondition": ""
  },
  {
    "id": "plusSkill",
    "name": "Bonus skill increases",
    "category": "external",
    "text": "[+x] when gaining [suit] skills",
    "tooltip": "No effect in challenges",
    "tooltipNegative": "",
    "tooltipGearCollectibleCondition": ""
  },
  {
    "id": "plusSkillChance",
    "name": "Chance to gain an extra skill",
    "category": "external",
    "text": "[+x]% chance of gaining 1 extra skill",
    "tooltip": "No effect in challenges",
    "tooltipNegative": "",
    "tooltipGearCollectibleCondition": ""
  }
].sort((a, b) => {
  // order first by category, then by name
  if (a.category === b.category) {
    return a.name.localeCompare(b.name)
  }
  return a.category.localeCompare(b.category)
})
