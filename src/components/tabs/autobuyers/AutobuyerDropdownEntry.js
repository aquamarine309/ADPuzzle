export default {
  name: "AutobuyerDropdownEntry",
  props: {
    autobuyer: {
      type: Object,
      required: true
    },
    modes: {
      type: Array,
      required: true
    },
    modeNameFn: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      mode: 0,
    };
  },
  methods: {
    update() {
      this.mode = this.autobuyer.mode;
    },
    changeMode(mode) {
      // eslint-disable-next-line vue/no-mutating-props
      this.autobuyer.mode = mode;
      this.mode = mode;
      this.$parent.openRequest = false;
    }
  },
  template: `
  <div>
    <div
      v-for="optionMode in modes"
      :key="optionMode"
      class="o-primary-btn c-autobuyer-box__mode-select l-autobuyer-choice"
      :value="optionMode"
      @click="changeMode(optionMode)"
      data-v-autobuyer-dropdown-entry
    >
      {{ modeNameFn(optionMode) }}
    </div>
  </div>
  `
};