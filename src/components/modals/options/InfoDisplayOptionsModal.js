import ModalOptionsToggleButton from "../../ModalOptionsToggleButton.js";
import ModalWrapperOptions from "./ModalWrapperOptions.js";

export default {
  name: "InfoDisplayOptionsModal",
  components: {
    ModalOptionsToggleButton,
    ModalWrapperOptions,
  },
  data() {
    return {
      infinityUnlocked: false,
      eternityUnlocked: false,
      realityUnlocked: false,
      alchemyUnlocked: false,
      showPercentage: false,
      achievements: false,
      achievementUnlockStates: false,
      challenges: false,
      studies: false,
      glyphEffectDots: false,
      realityUpgrades: false,
      logicUpgrades: false,
      perks: false,
      alchemy: false,
      exchange: false
    };
  },
  computed: {
    fullCompletion() {
      return player.records.fullGameCompletions > 0;
    }
  },
  watch: {
    showPercentage(newValue) {
      player.options.showHintText.showPercentage = newValue;
    },
    achievements(newValue) {
      player.options.showHintText.achievements = newValue;
    },
    achievementUnlockStates(newValue) {
      player.options.showHintText.achievementUnlockStates = newValue;
    },
    challenges(newValue) {
      player.options.showHintText.challenges = newValue;
    },
    studies(newValue) {
      player.options.showHintText.studies = newValue;
    },
    glyphEffectDots(newValue) {
      player.options.showHintText.glyphEffectDots = newValue;
    },
    realityUpgrades(newValue) {
      player.options.showHintText.realityUpgrades = newValue;
    },
    logicUpgrades(newValue) {
      player.options.showHintText.logicUpgrades = newValue;
    },
    perks(newValue) {
      player.options.showHintText.perks = newValue;
    },
    alchemy(newValue) {
      player.options.showHintText.alchemy = newValue;
    },
    exchange(newValue) {
      player.options.showHintText.resourceExchange = newValue;
    }
  },
  methods: {
    update() {
      const progress = PlayerProgress.current;
      this.infinityUnlocked = this.fullCompletion || progress.isInfinityUnlocked;
      this.eternityUnlocked = this.fullCompletion || progress.isEternityUnlocked;
      this.realityUnlocked = this.fullCompletion || progress.isRealityUnlocked;
      this.alchemyUnlocked = this.fullCompletion || Ra.unlocks.effarigUnlock.canBeApplied;

      const options = player.options.showHintText;
      this.showPercentage = options.showPercentage;
      this.achievements = options.achievements;
      this.achievementUnlockStates = options.achievementUnlockStates;
      this.challenges = options.challenges;
      this.studies = options.studies;
      this.glyphEffectDots = options.glyphEffectDots;
      this.realityUpgrades = options.realityUpgrades;
      this.logicUpgrades = options.logicUpgrades;
      this.perks = options.perks;
      this.alchemy = options.alchemy;
      this.exchange = options.resourceExchange;
    }
  },
  template: `
  <ModalWrapperOptions class="c-modal-options__large">
    <template #header>
      Info Display Options
    </template>
    <div class="c-modal-options__button-container">
      <ModalOptionsToggleButton
        v-model="showPercentage"
        text="Show % gain:"
      />
      <ModalOptionsToggleButton
        v-model="achievements"
        text="Achievement IDs:"
      />
      <ModalOptionsToggleButton
        v-model="achievementUnlockStates"
        text="Achievement unlock state indicators:"
      />
      <ModalOptionsToggleButton
        v-if="infinityUnlocked"
        v-model="logicUpgrades"
        text="Logic Upgrade names"
      />
      <ModalOptionsToggleButton
        v-if="infinityUnlocked"
        v-model="exchange"
        text="Exchange Resources:"
      />
      <ModalOptionsToggleButton
        v-if="infinityUnlocked"
        v-model="challenges"
        text="Challenge IDs:"
      />
      <ModalOptionsToggleButton
        v-if="eternityUnlocked"
        v-model="studies"
        text="Time Study IDs:"
      />
      <ModalOptionsToggleButton
        v-if="realityUnlocked"
        v-model="glyphEffectDots"
        text="Glyph effect dots:"
      />
      <ModalOptionsToggleButton
        v-if="realityUnlocked"
        v-model="realityUpgrades"
        text="Reality Upgrade names:"
      />
      <ModalOptionsToggleButton
        v-if="realityUnlocked"
        v-model="perks"
        text="Perk IDs:"
      />
      <ModalOptionsToggleButton
        v-if="alchemyUnlocked"
        v-model="alchemy"
        text="Alchemy resource amounts:"
      />
    </div>
    Note: All types of additional info above will always display when holding shift.
  </ModalWrapperOptions>
  `
};