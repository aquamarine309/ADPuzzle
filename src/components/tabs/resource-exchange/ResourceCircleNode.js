import HintText from "../../HintText.js";

export default {
  name: "ResourceCircleNode",
  components: {
    HintText
  },
  props: {
    resource: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isUnlocked: false,
      hasUnlocked: false,
      isOpen: false
    }
  },
  computed: {
    classObject() {
      return {
        "o-resource-circle-node": true,
        "o-resource-circle-node--locked": !this.isUnlocked && !this.hasUnlocked,
        "o-resource-circle-node--seen": !this.isUnlocked && this.hasUnlocked,
        "o-resource-circle-node--open": this.isOpen,
        "o-resource-circle-node--locked-open": !this.isUnlocked && !this.hasUnlocked && this.isOpen,
        "o-resource-circle-node--seen-open": !this.isUnlocked && this.hasUnlocked && this.isOpen
      }
    },
    displayName() {
      return this.resource.shortName ?? this.resource.name;
    }
  },
  methods: {
    update() {
      this.isUnlocked = this.resource.isUnlocked;
      this.hasUnlocked = this.resource.hasUnlocked;
      this.isOpen = this.resource.id === player.logic.resourceExchange.lastOpenId;
    }
  },
  template: `
  <div :class="classObject">
    <HintText
      v-if="isUnlocked"
      type="resourceExchange"
      class="o-hint-text--resource-exchange l-hint-text--resource-exchange"
    >
      {{ displayName }}
    </HintText>
    {{ resource.symbol }}
  </div>
  `
}