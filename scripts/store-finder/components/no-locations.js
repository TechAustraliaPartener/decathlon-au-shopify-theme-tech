import { checkmark } from '../data/icons';

export const noLocations = {
  inheritAttrs: false,
  props: [
    'search-input',
    'search-input-placeholder',
    'email-input-placeholder'
  ],
  template: `
    <section class='de-StoreNoLocations de-u-textSizeBase de-u-spaceTop'>
      <p class='de-u-textDarkGray de-u-spaceBottom de-u-textShrink1'>We currently don't have a store in <span class='de-u-textBold de-u-textShrink1'>{{ searchInput || searchInputPlaceholder }}</span>, but we're planning to grow! Enter your email below to let us know you are interested in having a Decathlon near you.</p>
      <p class='de-u-textDarkGray de-u-spaceBottom de-u-textShrink1'>In the meantime, shop all our products online and enjoy free shipping over $50.</p>
      <form
        @submit.prevent='$emit("form-submit")'
        class='de-SingleInputForm'
      >
        <p class='de-u-textDarkGray de-u-spaceNone de-u-textShrink1'>Enter an email address</p>
        <div class='de-StoreNoLocations-inputWrapper de-u-spaceEnds03 de-u-flex de-u-bgSilver'>
          <input
            v-bind='$attrs'
            v-on='listeners'
            @blur='isFocused = false'
            @focus='isFocused = true'
            :placeholder='emailInputPlaceholder'
            type='email'
            required='true'
            class='de-Input de-SingleInputForm-input de-u-textShrink1 de-u-bgSilver de-StoreNoLocations-input'
          >
          <button
            class='de-SingleInputForm-action de-StoreNoLocations-submit de-u-textBold de-u-textShrink1 de-u-bgBlue de-u-textUpper'
          >Submit</button>
        </div>
        <div class='de-u-flex de-u-flexAlignItemsCenter'>
          <div
            @click='isCheckboxActive = !isCheckboxActive'
            :class='{ "de-u-bgBlue": isCheckboxActive }'
            class='de-StoreNoLocations-checkbox de-u-flex de-u-flexAlignItemsCenter de-u-flexJustifyCenter de-u-spaceRight06 de-u-cursorPointer'
          >
            <input
              v-model='isCheckboxActive'
              type='checkbox'
              class='de-u-hiddenVisually'
            >
            <span
              v-show='isCheckboxActive'
              v-html='icons.checkmark'
              class='de-u-flex'
            ></span>
          </div>
          <p class='de-u-spaceNone de-u-textShrink1'>Subscribe to newsletter</p>
        </div>
      </form>
    </section>
  `,
  data() {
    return {
      icons: {
        checkmark
      },
      input: '',
      isFocused: false,
      isCheckboxActive: false
    };
  },
  computed: {
    listeners() {
      return {
        ...this.$listeners,
        input: event => this.$emit('input', event.target.value)
      };
    }
  },
  watch: {
    isCheckboxActive(isCheckboxActive) {
      this.$emit('checkbox-toggle', isCheckboxActive);
    }
  }
};
