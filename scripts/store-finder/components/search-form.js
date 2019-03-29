import { clear, geolocation, search } from '../data/icons';

export const searchForm = {
  inheritAttrs: false,
  props: ['search-input', 'search-input-placeholder', 'geolocation-copy'],
  template: `
    <form
      @submit.prevent='$emit("form-submit")'
      class='de-SingleInputForm de-u-spaceEnds06 de-StoreSearch'
    >
      <p class='de-u-textDarkGrasy de-u-spaceBottom06 de-u-textShrink1'>Search by city or zipcode</p>
      <div
        :class='{ isFocused: isFocused }'
        class='de-u-flex de-u-bgSilver de-StoreSearch-inputWrapper'
      >
        <input
          v-bind='$attrs'
          v-on='listeners'
          :placeholder='"Your location: " + searchInputPlaceholder'
          @blur='isFocused = false'
          @focus='isFocused = true'
          ref='searchInput'
          class='de-Input de-SingleInputForm-input de-u-textShrink1 de-u-bgSilver de-StoreSearch-input'
        >
        <a
          v-show='searchInput.length > 0'
          @click='clearInput'
          :class='{ "de-u-flex": searchInput.length > 0 }'
          class='de-StoreSearch-clear de-u-flexAlignItemsCenter de-u-flexJustifyCenter de-u-cursorPointer'
        >
          <span
            v-html='icons.clear'
            class='de-u-flex'
          ></span>
        </a>
        <button
          :class='{ isFocused: isFocused }'
          class='de-StoreSearch-submit de-u-flex de-u-flexAlignItemsCenter de-u-flexJustifyCenter de-SingleInputForm-action'
        >
          <span
            v-html='icons.search'
            class='de-u-flex'
          ></span>
        </button>
      </div>
      <a
        @click='$emit("get-user-geolocation")'
        class='de-u-flex de-u-spaceTop06 de-u-cursorPointer'
      >
        <span
          v-html='icons.geolocation'
          class='de-u-flex de-u-flexAlignItemsCenter de-u-flexJustifyCenter'
        ></span>
        <span
          v-text='geolocationCopy'
          class='de-u-spaceLeft07 de-u-textShrink1 de-u-textMedium'
        ></span>
      </a>
    </form>
 `,
  data() {
    return {
      input: '',
      icons: {
        clear,
        geolocation,
        search
      },
      isFocused: false
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
  methods: {
    clearInput() {
      this.$emit('clear-search-input');
      this.$refs.searchInput.focus();
    }
  }
};
