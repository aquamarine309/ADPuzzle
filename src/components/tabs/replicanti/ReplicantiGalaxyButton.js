import PrimaryButton from "../../PrimaryButton.js";
import PrimaryToggleButton from "../../PrimaryToggleButton.js";

export default {
  name: "ReplicantiGalaxyButton",
  components: {
    PrimaryButton,
    PrimaryToggleButton
  },
  data() {
    return {
      isAvailable: false,
      isAutoUnlocked: false,
      isAutoActive: false,
      isAutoEnabled: false,
      isDivideUnlocked: false,
      boughtGalaxies: new BE(0),
      extraGalaxies: new BE(0),
      autoreplicateUnlocked: false
    };
  },
  computed: {
    resetActionDisplay() {
      return this.isDivideUnlocked && !Pelle.isDoomed
        ? `Divide Replicanti by ${format(Number.MAX_VALUE, 1, 1)}`
        : "Reset Replicanti amount";
    },
    galaxyCountDisplay() {
      const bought = this.boughtGalaxies;
      const extra = this.extraGalaxies;
      const galaxyCount = extra.gt(0) ? `${formatInt(bought)}+${formatInt(extra)}` : formatInt(bought);
      return `Currently: ${galaxyCount}`;
    },
    autobuyer() {
      return Autobuyer.replicantiGalaxy;
    },
    autobuyerTextDisplay() {
      const auto = this.isAutoActive;
      const disabled = !this.isAutoEnabled;
      return `Auto Galaxy ${auto ? "ON" : "OFF"}${disabled ? " (disabled)" : ""}`;
    },
    btnClass() {
      return {
        "o-primary-btn--replicanti-galaxy": true,
        "l-replicanti-upgrade-button": !this.autoreplicateUnlocked,
        "l-rg-btn-big": this.autoreplicateUnlocked
      }
    }
  },
  methods: {
    update() {
      const rg = Replicanti.galaxies;
      this.isAvailable = rg.canBuyMore;
      this.boughtGalaxies.copyFrom(rg.bought);
      this.extraGalaxies = rg.extra;
      this.isDivideUnlocked = Achievement(126).isUnlocked;
      const auto = Autobuyer.replicantiGalaxy;
      this.isAutoUnlocked = auto.isUnlocked;
      this.isAutoActive = auto.isActive;
      this.isAutoEnabled = auto.isEnabled;
      this.autoreplicateUnlocked = Replicanti.autoreplicateUnlocked;
    },
    handleAutoToggle(value) {
      Autobuyer.replicantiGalaxy.isActive = value;
      this.update();
    },
    handleClick() {
      replicantiGalaxyRequest();
    },
    setHoldingR(value) {
      if (value === true) {
        replicantiGalaxyRequest();
      }
      setHoldingR(value);
    }
  },
  template: `
  <div class="l-spoon-btn-group">
    <PrimaryButton
      :enabled="isAvailable"
      :class="btnClass"
      @click="handleClick"
      @touchstart="setHoldingR(true)"
      @touchend="setHoldingR(false)"
    >
      {{ resetActionDisplay }} for a Replicanti Galaxy
      <br>
      {{ galaxyCountDisplay }}
    </PrimaryButton>
    <PrimaryToggleButton
      v-if="isAutoUnlocked"
      :value="isAutoActive"
      :on="autobuyerTextDisplay"
      :off="autobuyerTextDisplay"
      class="l--spoon-btn-group__little-spoon o-primary-btn--replicanti-galaxy-toggle"
      @input="handleAutoToggle"
    />
  </div>
  `
};