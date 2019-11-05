import { information, star, starSolid } from '../data/icons';

export const storeTile = {
  props: ['store', 'distance', 'isFavoritedStore'],
  template: `
    <div
      @click='$emit("set-selected-store", store)'
      class='de-StoreTile de-u-pad03 de-u-padEnds de-u-cursorPointer'
    >
      <div class='de-Grid de-u-textSizeBase'>
        <div class='de-StoreTile-info de-u-size4of6 de-u-padRight06'>
          <h3
            v-text='store.cityWithSuffix'
            class='de-StoreTile-name de-u-textGrow de-u-spaceNone de-u-textBold'
          ></h3>
          <div class='de-StoreTile-address de-u-flex'>
            <p
              v-text='store.street1'
              class='de-u-spaceNone de-u-textShrink1 de-u-textDarkGray'
              ></p>
            <a
              v-text='distance'
              @click='$emit("store-direction-nav", store)'
              class='de-u-spaceLeft06 de-u-textShrink1 de-u-textBlue de-u-textMedium'
            ></a>
          </div>
          <p
            v-show='!(store.city === "Moorabbin")'
            v-text='store.street2'
            class='de-u-spaceNone de-u-textDarkGray de-u-textShrink2 de-u-textMedium'
          ></p>
        </div>
        <div class='de-StoreTile-actions de-u-size2of6 de-u-textShrink2 de-u-flex'>
          <a
            v-if='!(store.city === "Moorabbin")'
            @click='$emit("set-favorited-store", store)'
            class='de-StoreTile-actionsButton de-u-flex de-u-flexCol de-u-flexAlignItemsCenter de-u-flexJustifyCenter de-u-spaceRight03'
          >
            <span
              v-html='icons.star'
               class='de-u-iconContainer'
              v-show='!(isFavoritedStore && isFavoritedStore.id === store.id)'
            ></span>
            <span
              v-html='icons.starSolid'
                class='de-u-iconContainer'
              v-show='isFavoritedStore && isFavoritedStore.id === store.id'
            ></span>
            <span class='de-u-textBlue de-u-textMedium de-u-textShrink1'>Favorite</span>
          </a>
          <a
            @click='$emit("store-info-nav", store)'
            class='de-StoreTile-actionsButton de-u-flex de-u-flexCol de-u-flexAlignItemsCenter de-u-flexJustifyCenter'
          >
            <span
              v-html='icons.information'
               class='de-u-iconContainer'
            ></span>
            <span class='de-u-textBlue de-u-textMedium de-u-textShrink1'>Info</span>
          </a>
        </div>
      </div>
    </div>
  `,
  data() {
    return { icons: { information, star, starSolid } };
  }
};
