import LC3UpgradeButton from "./LC3UpgradeButton.js";

export default {
  name: "LC3Container",
  components: {
    LC3UpgradeButton
  },
  data() {
    return {
      challengePower: new BE(0),
      cpPerSecond: new BE(0),
      isVisible: true,
      showHelp: true
    }
  },
  computed: {
    upgrades: () => LC3Upgrade.all
  },
  methods: {
    update() {
      this.isVisible = LC3.isRunning;
      if (!this.isVisible) return;
      this.challengePower.copyFrom(Currency.challengePower);
      this.cpPerSecond = LC3.cpPerSecond;
      this.showHelp = player.records.thisInfinity.maxAM.gte(LC3.helpThreshold) && LC3.game.isRunning;
    }
  },
  template: `
  <div
    v-if="isVisible"
    class="c-lc3-container"
  >
    <div>
      You have <span class="c-cp-amount">{{ format(challengePower, 2, 3) }}</span> Challenge Power. ({{ formatX(cpPerSecond, 2, 3) }}/s)
    </div>
    <div class="c-lc3-upgrades-container">
      <LC3UpgradeButton
        v-for="upgrade in upgrades"
        :key="upgrade.id"
        :upgrade="upgrade"
      />
    </div>
    <div
      v-if="showHelp"
      class="o-lc3-help"
      onclick="Modal.lc3Help.show()"
    >
      Are you in trouble? Complete a mini-game to gain bonus!
    </div>
  </div>
  `
}