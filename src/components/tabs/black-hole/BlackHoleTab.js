import { BlackHoleAnimation } from "./black-hole-animation.js";
import BlackHoleChargingSliders from "./BlackHoleChargingSliders.js";
import BlackHoleStateRow from "./BlackHoleStateRow.js";
import BlackHoleUnlockButton from "./BlackHoleUnlockButton.js";
import BlackHoleUpgradeRow from "./BlackHoleUpgradeRow.js";

export default {
  name: "BlackHoleTab",
  components: {
    BlackHoleUpgradeRow,
    BlackHoleStateRow,
    BlackHoleChargingSliders,
    BlackHoleUnlockButton
  },
  data() {
    return {
      isDoomed: false,
      isUnlocked: false,
      isPaused: false,
      isEnslaved: false,
      pauseMode: 0,
      detailedBH2: "",
      isPermanent: false,
      hasBH2: false,
      blackHoleUptime: [],
      stateChange: "",
    };
  },
  computed: {
    blackHoles: () => BlackHoles.list,
    pauseModeString() {
      switch (this.pauseMode) {
        case BLACK_HOLE_PAUSE_MODE.NO_PAUSE:
          return "Do not pause";
        case BLACK_HOLE_PAUSE_MODE.PAUSE_BEFORE_BH1:
          return this.hasBH2 ? "Before BH1" : "Before activation";
        case BLACK_HOLE_PAUSE_MODE.PAUSE_BEFORE_BH2:
          return "Before BH2";
        default:
          throw new Error("Unrecognized BH offline pausing mode");
      }
    },
  },
  mounted() {
    this.startAnimation();
  },
  destroyed() {
    if (this.animation) this.animation.unmount();
  },
  methods: {
    update() {
      this.isDoomed = Pelle.isDoomed;
      this.isUnlocked = BlackHoles.areUnlocked;
      this.isPaused = BlackHoles.arePaused;
      // If stop running enslaved, re-mount the black hole animation as it reappears
      if (this.isEnslaved && !Enslaved.isRunning) {
        if (this.animation) this.animation.unmount();
        this.startAnimation();
      }
      this.isEnslaved = Enslaved.isRunning;
      this.isPermanent = BlackHoles.arePermanent;
      this.pauseMode = player.blackHoleAutoPauseMode;
      this.hasBH2 = BlackHole(2).isUnlocked;
      this.blackHoleUptime = [BlackHole(1).duration.div(BlackHole(1).cycleLength),
        BlackHole(2).duration.div(BlackHole(2).cycleLength)];
      this.detailedBH2 = this.bh2Status();

      if (player.blackHoleNegative < 1) this.stateChange = this.isPaused ? "Uninvert" : "Invert";
      else this.stateChange = this.isPaused ? "Unpause" : "Pause";
    },
    bh2Status() {
      const bh1Remaining = BlackHole(1).timeWithPreviousActiveToNextStateChange;
      const bh2Remaining = BlackHole(2).timeWithPreviousActiveToNextStateChange;

      // Both BH active
      if (BlackHole(1).isActive && BlackHole(2).isActive) {
        const bh2Duration = Math.min(bh1Remaining, bh2Remaining);
        return `Black Hole 2 is active for the next ${TimeSpan.fromSeconds(bh2Duration).toStringShort()}!`;
      }

      // BH1 active, BH2 will trigger before BH1 runs out
      if (BlackHole(1).isActive && (bh2Remaining.lt(bh1Remaining))) {
        const bh2Duration = bh1Remaining.minus(bh2Remaining).min(BlackHole(2).duration);
        return `Black Hole 2 will activate before Black Hole 1 deactivates,
          for ${TimeSpan.fromSeconds(bh2Duration).toStringShort()}`;
      }

      // BH2 won't start yet next cycle
      if (BlackHole(1).isActive || (bh2Remaining.gt(BlackHole(1).duration))) {
        const cycleCount = BlackHole(1).isActive
          ? bh2Remaining.minus(bh1Remaining).div(BlackHole(1).duration).floor().add(1)
          : bh2Remaining.div(BlackHole(1).duration).floor();
        return `Black Hole 2 will activate after ${quantifyInt("more active cycle", cycleCount)} of Black Hole 1.`;
      }

      // BH1 inactive, BH2 ready to go when BH1 activates
      if (BlackHole(2).isCharged) {
        const bh2Duration = BE.min(BlackHole(1).duration, bh2Remaining);
        return `Black Hole 2 will activate with Black Hole 1,
          for ${TimeSpan.fromSeconds(bh2Duration).toStringShort()}.`;
      }

      // BH1 inactive, BH2 starts at some point after BH1 activates
      const bh2Duration = BE.min(BlackHole(1).duration.minus(bh2Remaining), BlackHole(2).duration);
      return `Black Hole 2 will activate ${TimeSpan.fromSeconds(bh2Remaining).toStringShort()} after
        Black Hole 1, for ${TimeSpan.fromSeconds(bh2Duration).toStringShort()}.`;
    },
    togglePause() {
      BlackHoles.togglePause();
      if (BlackHoles.arePaused) {
        player.celestials.enslaved.isAutoReleasing = false;
      }
      this.update();
    },
    changePauseMode() {
      let steps;
      switch (this.pauseMode) {
        case BLACK_HOLE_PAUSE_MODE.NO_PAUSE:
          // Note: We don't need to check for permanent BH2 because the button disappears at that point
          steps = BlackHole(1).isPermanent ? 2 : 1;
          break;
        case BLACK_HOLE_PAUSE_MODE.PAUSE_BEFORE_BH1:
          steps = this.hasBH2 ? 1 : 2;
          break;
        case BLACK_HOLE_PAUSE_MODE.PAUSE_BEFORE_BH2:
          steps = 1;
          break;
        default:
          throw new Error("Unrecognized BH offline pausing mode");
      }
      player.blackHoleAutoPauseMode = (this.pauseMode + steps) % Object.values(BLACK_HOLE_PAUSE_MODE).length;
    },
    startAnimation() {
      setTimeout(() => {
        if (this.$refs.canvas) {
          this.animation = new BlackHoleAnimation(this.$refs.canvas.getContext("2d"));
        }
      }, 1);
    },
    gridStyle() {
      return this.isPermanent ? "l-black-hole-upgrade-permanent" : "l-black-hole-upgrade-grid";
    },
  },
  template: `
  <div class="l-black-hole-tab">
    <div
      v-if="isEnslaved || isDoomed"
      class="c-black-hole-disabled-description"
      data-v-black-hole-tab
    >
      <i v-if="isEnslaved">
        You must... seek... other methods...
        <br>
      </i>
      The physics of this Reality do not allow the existence of Black Holes.
    </div>
    <div
      v-else-if="!isUnlocked"
      class="l-pre-unlock-text"
      data-v-black-hole-tab
    >
      <BlackHoleUnlockButton @blackholeunlock="startAnimation" />
      The Black Hole makes the entire game run significantly faster for a short period of time.
      <br>
      Starts at {{ formatX(180) }} faster for {{ formatInt(10) }} seconds, once per hour.
      <br>
      <br>
      Unlocking the Black Hole also gives {{ formatInt(10) }} Automator Points.
    </div>
    <template v-else>
      <div class="c-subtab-option-container">
        <button
          class="o-primary-btn o-primary-btn--subtab-option"
          @click="togglePause"
        >
          {{ stateChange }} Black Hole
        </button>
        <button
          v-if="!isPermanent"
          class="o-primary-btn o-primary-btn--subtab-option l-auto-pause-button"
          @click="changePauseMode"
          data-v-black-hole-tab
        >
          Auto-pause: {{ pauseModeString }}
        </button>
      </div>
      <canvas
        ref="canvas"
        class="c-black-hole-canvas"
        width="400"
        height="400"
      />
      <div class="l-black-hole-upgrade-grid">
        <BlackHoleStateRow
          v-for="(blackHole, i) in blackHoles"
          :key="'state' + i"
          :black-hole="blackHole"
        />
        <span v-if="hasBH2 && !isPermanent">
          <b>{{ detailedBH2 }}</b>
          <br>
          The timer for Black Hole 2 only advances while Black Hole 1 is active.
          <br>
          Upgrades affect the internal timer; the header shows real time until next activation.
        </span>
        <br>
        <div v-if="!isPermanent">
          Black holes become permanently active when they are active for more than {{ formatPercents(0.9999, 2) }}
          of the time.
          <br>
          Active time percent: {{ formatPercents(blackHoleUptime[0], 3) }}
          <span v-if="hasBH2">and {{ formatPercents(blackHoleUptime[1], 3) }}</span>
        </div>
        <BlackHoleChargingSliders class="l-enslaved-shop-container" />
      </div>
      <div :class="gridStyle()">
        <BlackHoleUpgradeRow
          v-for="(blackHole, i) in blackHoles"
          :key="'upgrades' + i"
          :black-hole="blackHole"
        />
      </div>
    </template>
  </div>
  `
};