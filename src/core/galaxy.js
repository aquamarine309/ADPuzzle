import { BEC } from "./constants.js";

export const GALAXY_TYPE = {
  NORMAL: 0,
  DISTANT: 1,
  REMOTE: 2
};

class GalaxyRequirement {
  constructor(tier, amount) {
    this.tier = tier;
    this.amount = amount;
  }

  get isSatisfied() {
    const dimension = AntimatterDimension(this.tier);
    return dimension.totalAmount.gte(this.amount);
  }
}

export class Galaxy {
  static get remoteStart() {
    return RealityUpgrade(21).effectOrDefault(800);
  }

  static get requirement() {
    return this.requirementAt(player.galaxies);
  }

  /**
   * Figure out what galaxy number we can buy up to
   * @param {number} currency Either dim 8 or dim 6, depends on current challenge
   * @returns {number} Max number of galaxies (total)
   */
  static buyableGalaxies(currency) {
    const bulk = bulkBuyBinarySearch(new BE(currency), {
      costFunction: x => this.requirementAt(x).amount,
      cumulative: false,
    }, player.galaxies);
    if (!bulk) throw new Error("Unexpected failure to calculate galaxy purchase");
    return player.galaxies.plus(bulk.quantity);
  }

  static requirementAt(galaxies) {
    let amount = galaxies.times(Galaxy.costMult).plus(Galaxy.baseCost);

    const type = Galaxy.typeAt(galaxies);

    if (type === GALAXY_TYPE.DISTANT && EternityChallenge(5).isRunning) {
      amount = amount.plus(galaxies.pow(2)).plus(galaxies);
    } else if (type === GALAXY_TYPE.DISTANT || type === GALAXY_TYPE.REMOTE) {
      const galaxyCostScalingStart = this.costScalingStart;
      const galaxiesBeforeDistant = BE.clampMin(galaxies.minus(galaxyCostScalingStart).plus(1), 0);
      amount = amount.plus(galaxiesBeforeDistant.pow(2)).plus(galaxiesBeforeDistant);
    }

    if (type === GALAXY_TYPE.REMOTE) {
      amount = amount.times(BE.pow(1.002, galaxies.minus(Galaxy.remoteStart - 1)));
    }

    amount = amount.minus(Effects.sum(InfinityUpgrade.resetBoost));
    if (InfinityChallenge(5).isCompleted) amount = amount.minus(1);

    if (GlyphAlteration.isAdded("power")) amount = amount.times(getSecondaryGlyphEffect("powerpow"));

    amount = amount.floor();
    const tier = Galaxy.requiredTier;
    return new GalaxyRequirement(tier, amount);
  }

  static get costMult() {
    if (LogicChallenge(6).isRunning) {
      return 10;
    }
    const base = Effects.min(NormalChallenge(10).isRunning ? 90 : 60, TimeStudy(42));
    if (Puzzle.maxTier !== 8 && !LogicChallenge(2).isCompleted) {
      return base.times(2.5).floor();
    }
    return base;
  }

  static get baseCost() {
    return NormalChallenge(10).isRunning ? 99 : 80;
  }

  static get requiredTier() {
    const base = NormalChallenge(10).isRunning ? 6 : 8;
    if (LogicChallenge(1).isCompleted) return Math.min(base, Puzzle.maxTier);
    return base;
  }

  static get canBeBought() {
    if (EternityChallenge(6).isRunning && !Enslaved.isRunning) return false;
    if (LogicChallenge(2).isRunning) return false;
    if (NormalChallenge(8).isRunning || InfinityChallenge(7).isRunning) return false;
    if (player.records.thisInfinity.maxAM.gt(Player.infinityGoal) &&
       (!player.break || Player.isInAntimatterChallenge)) return false;
    return true;
  }

  static get lockText() {
    if (this.canBeBought) return null;
    if (LogicChallenge(2).isRunning) return "Locked (Logic Challenge 2)";
    if (EternityChallenge(6).isRunning) return "Locked (Eternity Challenge 6)";
    if (InfinityChallenge(7).isRunning) return "Locked (Infinity Challenge 7)";
    if (InfinityChallenge(1).isRunning) return "Locked (Infinity Challenge 1)";
    if (NormalChallenge(8).isRunning) return "Locked (8th Antimatter Dimension Autobuyer Challenge)";
    return null;
  }

  static get costScalingStart() {
    return 100 + TimeStudy(302).effectOrDefault(0) + Effects.sum(
      TimeStudy(223),
      TimeStudy(224),
      EternityChallenge(5).reward,
      GlyphSacrifice.power
    ).toNumber();
  }

  static get type() {
    return this.typeAt(player.galaxies);
  }

  static typeAt(galaxies) {
    if (galaxies.gte(Galaxy.remoteStart)) {
      return GALAXY_TYPE.REMOTE;
    }
    if (EternityChallenge(5).isRunning || galaxies.gte(this.costScalingStart)) {
      return GALAXY_TYPE.DISTANT;
    }
    return GALAXY_TYPE.NORMAL;
  }
}

function galaxyReset() {
  EventHub.dispatch(GAME_EVENT.GALAXY_RESET_BEFORE);
  player.galaxies = player.galaxies.plus(1);
  if (!Achievement(143).isUnlocked || (Pelle.isDoomed && !PelleUpgrade.galaxyNoResetDimboost.canBeApplied)) {
    player.dimensionBoosts = BEC.D0;
  }
  softReset(0);
  if (Notations.current === Notation.emoji) player.requirementChecks.permanent.emojiGalaxies = player.requirementChecks.permanent.emojiGalaxies.add(1);
  // This is specifically reset here because the check is actually per-galaxy and not per-infinity
  player.requirementChecks.infinity.noSacrifice = true;
  EventHub.dispatch(GAME_EVENT.GALAXY_RESET_AFTER);
}

export function manualRequestGalaxyReset(bulk, requiresChall = true) {
  if (!Galaxy.canBeBought || !Galaxy.requirement.isSatisfied) return;
  if (requiresChall && !NormalChallenge(11).isCompleted) return;
  if (GameEnd.creditsEverClosed) return;
  if (RealityUpgrade(7).isLockingMechanics && player.galaxies.gt(0)) {
    RealityUpgrade(7).tryShowWarningModal();
    return;
  }
  if (player.options.confirmations.antimatterGalaxy) {
    Modal.antimatterGalaxy.show({ bulk: bulk && EternityMilestone.autobuyMaxGalaxies.isReached });
    return;
  }
  requestGalaxyReset(bulk);
}

// All galaxy reset requests, both automatic and manual, eventually go through this function; therefore it suffices
// to restrict galaxy count for RUPG7's requirement here and nowhere else
export function requestGalaxyReset(bulk, limit = Number.MAX_VALUE) {
  const restrictedLimit = RealityUpgrade(7).isLockingMechanics ? 1 : limit;
  if (EternityMilestone.autobuyMaxGalaxies.isReached && bulk) return maxBuyGalaxies(restrictedLimit);
  if (player.galaxies.gte(restrictedLimit) || !Galaxy.canBeBought || !Galaxy.requirement.isSatisfied) return false;
  Tutorial.turnOffEffect(TUTORIAL_STATE.GALAXY);
  galaxyReset();
  return true;
}

function maxBuyGalaxies(limit = Number.MAX_VALUE) {
  if (player.galaxies.gte(limit) || !Galaxy.canBeBought) return false;
  // Check for ability to buy one galaxy (which is pretty efficient)
  const req = Galaxy.requirement;
  if (!req.isSatisfied) return false;
  const dim = AntimatterDimension(req.tier);
  const newGalaxies = BE.clampMax(
    Galaxy.buyableGalaxies(BE.round(dim.totalAmount)),
    limit);
  if (Notations.current === Notation.emoji) {
    player.requirementChecks.permanent.emojiGalaxies = player.requirementChecks.permanent.emojiGalaxies.plus(newGalaxies).minus(player.galaxies);
  }
  // Galaxy count is incremented by galaxyReset(), so add one less than we should:
  player.galaxies = newGalaxies.minus(1);
  galaxyReset();
  if (Enslaved.isRunning && player.galaxies.gt(1)) EnslavedProgress.c10.giveProgress();
  Tutorial.turnOffEffect(TUTORIAL_STATE.GALAXY);
  return true;
}
