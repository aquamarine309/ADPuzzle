import AntimatterDimensionProgressBar from "./AntimatterDimensionProgressBar.js";
import AntimatterDimensionRow from "./ModernAntimatterDimensionRow.js";
import AntimatterGalaxyRow from "./ModernAntimatterGalaxyRow.js";
import DimensionBoostRow from "./ModernDimensionBoostRow.js";
import PrimaryButton from "../../PrimaryButton.js";
import TickspeedRow from "./TickspeedRow.js";

export default {
  name: "ModernAntimatterDimensionsTab",
  components: {
    PrimaryButton,
    AntimatterDimensionProgressBar,
    AntimatterDimensionRow,
    AntimatterGalaxyRow,
    DimensionBoostRow,
    TickspeedRow
  },
  data() {
    return {
      hasDimensionBoosts: false,
      buyUntil10: true,
      isSacrificeUnlocked: false,
      isSacrificeAffordable: false,
      buy10Mult: new BE(0),
      currentSacrifice: new BE(0),
      sacrificeBoost: new BE(0),
      disabledCondition: "",
      isQuickResetAvailable: false,
      hasContinuum: false,
      isContinuumActive: false,
      multiplierText: "",
      randomDimOrder: false,
      vertigo: false,
      lockTimeString: ""
      
    };
  },
  computed: {
    sacrificeTooltip() {
      if (Puzzle.maxTier < Sacrifice.requiredDimensionTier) return `Maybe you had ${Sacrifice.requiredDimension.shortDisplayName} Antimatter Dimension before.`;
      return `Boosts 8th Antimatter Dimension by ${formatX(this.sacrificeBoost, 2, 2)}`;
    },
    range() {
      const base = Array.range(1, 8);
      if (this.randomDimOrder) return base.sort(() => Math.random() - 0.5);
      return base;
    }
  },
  methods: {
    maxAll() {
      maxAll();
    },
    sacrifice() {
      sacrificeBtnClick();
    },
    // Toggle single/10 without Continuum, otherwise cycle through all 3 if it's unlocked
    changeBuyMode() {
      if (!this.hasContinuum) {
        player.buyUntil10 = !player.buyUntil10;
        return;
      }
      // "Continuum" => "Until 10" => "Buy 1" => "Continuum"
      if (this.isContinuumActive) {
        Laitela.setContinuum(false);
        player.buyUntil10 = true;
      } else if (player.buyUntil10) {
        player.buyUntil10 = false;
      } else {
        if (ImaginaryUpgrade(21).isLockingMechanics && player.auto.disableContinuum) {
          ImaginaryUpgrade(21).tryShowWarningModal();
          return;
        }
        Laitela.setContinuum(true);
      }
    },
    getUntil10Display() {
      if (this.isContinuumActive) return "Continuum";
      return this.buyUntil10 ? "Until 10" : "Buy 1";
    },
    update() {
      this.hasDimensionBoosts = player.dimensionBoosts.gt(0);
      this.buyUntil10 = player.buyUntil10;
      this.hasContinuum = Laitela.continuumUnlocked;
      this.isContinuumActive = Laitela.continuumActive;
      this.isQuickResetAvailable = Player.isInAntimatterChallenge && Player.antimatterChallenge.isQuickResettable;

      const isSacrificeUnlocked = Sacrifice.isVisible;
      this.isSacrificeUnlocked = isSacrificeUnlocked;

      this.buy10Mult.copyFrom(AntimatterDimensions.buyTenMultiplier);

      this.multiplierText = `Buy 10 Dimension purchase multiplier: ${formatX(this.buy10Mult, 2, 2)}`;
      this.randomDimOrder = Puzzle.randomDimOrder;
      this.vertigo = GameElements.isActive("vertigo");
      if (this.vertigo) {
        this.lockTimeString = timeDisplayShort(GameElements.getElement("vertigo").time);
      }
      if (!isSacrificeUnlocked) return;
      this.isSacrificeAffordable = Sacrifice.canSacrifice;
      this.currentSacrifice.copyFrom(Sacrifice.totalBoost);
      this.sacrificeBoost.copyFrom(Sacrifice.nextBoost);
      this.disabledCondition = Sacrifice.disabledCondition;
      const sacText = this.isSacrificeUnlocked
        ? ` | Dimensional Sacrifice multiplier: ${formatX(this.currentSacrifice, 2, 2)}`
        : "";
      this.multiplierText += sacText;
    }
  },
  template: `
  <div class="l-antimatter-dim-tab">
    <div class="modes-container">
      <button
        class="o-primary-btn l-button-container"
        @click="changeBuyMode"
        data-v-modern-antimatter-dimensions-tab
      >
        {{ getUntil10Display() }}
      </button>
      <PrimaryButton
        v-show="isSacrificeUnlocked"
        v-tooltip="sacrificeTooltip"
        :enabled="isSacrificeAffordable"
        class="o-primary-btn--sacrifice"
        @click="sacrifice"
      >
        <span v-if="isSacrificeAffordable">Dimensional Sacrifice ({{ formatX(sacrificeBoost, 2, 2) }})</span>
        <span v-else>Dimensional Sacrifice Disabled ({{ disabledCondition }})</span>
      </PrimaryButton>
      <button
        class="o-primary-btn l-button-container"
        @click="maxAll"
        data-v-modern-antimatter-dimensions-tab
      >
        Max All (M)
      </button>
    </div>
    <span>{{ multiplierText }}</span>
    <TickspeedRow />
    <div
      v-if="vertigo"
      class="c-vertigo"
    >
      <i class="fas fa-lock" />
      Connot buy any Antimatter Dimensions.
      (<i class="fas fa-clock" /> {{ lockTimeString }})
    </div>
    <div class="l-dimensions-container">
      <AntimatterDimensionRow
        v-for="tier in range"
        :key="tier"
        :tier="tier"
      />
    </div>
    <div class="resets-container">
      <DimensionBoostRow />
      <PrimaryButton
        v-if="isQuickResetAvailable"
        class="o-primary-btn--quick-reset"
        onclick="softReset(-1, true, true)"
      >
        Perform a Dimension Boost reset
        <span v-if="hasDimensionBoosts"> but lose a Dimension Boost</span>
        <span v-else> for no gain</span>
      </PrimaryButton>
      <AntimatterGalaxyRow />
    </div>
    <AntimatterDimensionProgressBar />
  </div>
  `
};