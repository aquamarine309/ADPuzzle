import PrimaryButton from "./PrimaryButton.js";
import PrimaryToggleButton from "./PrimaryToggleButton.js";

export default {
  name: "ChallengeTabHeader",
  components: {
    PrimaryButton,
    PrimaryToggleButton
  },
  data() {
    return {
      retryChallenge: false,
      isInChallenge: false,
      isShowAllVisible: false,
      isAutoECVisible: false,
      showAllChallenges: false,
      autoEC: false,
      lc3Completed: false
    };
  },
  watch: {
    retryChallenge(newValue) {
      player.options.retryChallenge = newValue;
    },
    autoEC(newValue) {
      player.reality.autoEC = newValue;
    },
    showAllChallenges(newValue) {
      player.options.showAllChallenges = newValue;
    },
  },
  methods: {
    update() {
      this.retryChallenge = player.options.retryChallenge;
      this.showAllChallenges = player.options.showAllChallenges;
      this.isInChallenge = Player.isInAnyChallenge;
      this.isShowAllVisible = PlayerProgress.eternityUnlocked();
      this.isAutoECVisible = Perk.autocompleteEC1.canBeApplied;
      this.autoEC = player.reality.autoEC;
      this.lc3Completed = (LC3.isCompleted || PlayerProgress.eternityUnlocked()) && !LC3.isRunning;
    },
    restartChallenge() {
      const current = Player.anyChallenge;
      if (Player.isInAnyChallenge) {
        current.exit(true);
        current.start();
      }
    },
    exitChallenge() {
      const current = Player.anyChallenge;
      if (Player.isInAnyChallenge) {
        current.exit(false);
      }
    },
    startGame() {
      Modal.lc3Help.show();
    }
  },
  template: `
  <div class="l-challenges-tab__header">
    <div class="c-subtab-option-container">
      <PrimaryToggleButton
        v-model="retryChallenge"
        class="o-primary-btn--subtab-option"
        label="Automatically retry challenges:"
      />
      <PrimaryToggleButton
        v-if="isShowAllVisible"
        v-model="showAllChallenges"
        class="o-primary-btn--subtab-option"
        label="Show all known challenges:"
      />
      <PrimaryToggleButton
        v-if="isAutoECVisible"
        v-model="autoEC"
        class="o-primary-btn--subtab-option"
        label="Auto Eternity Challenges:"
      />
      <PrimaryButton
        v-if="isInChallenge"
        class="o-primary-btn--subtab-option"
        @click="restartChallenge"
      >
        Restart Challenge
      </PrimaryButton>
      <PrimaryButton
        v-if="isInChallenge"
        class="o-primary-btn--subtab-option"
        @click="exitChallenge"
      >
        Exit Challenge
      </PrimaryButton>
      <PrimaryButton
        v-if="lc3Completed"
        class="o-primary-btn--subtab-option o-primary-btn--subtab-option--minigame"
        @click="startGame"
      >
        Start LC3 Mini-game
      </PrimaryButton>
    </div>
  </div>
  `
};