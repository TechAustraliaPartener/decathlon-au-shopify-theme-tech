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
            v-text='store.title'
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
          <div v-if='(store.tooltip_hours === true)'>
            <p
              v-show='!(store.is_visual === true)'
              v-text='store.street2'
              class='de-u-spaceNone de-u-textDarkGray de-u-textShrink2 de-u-textMedium de-StoreTile-tooltipOpener'
            >
            </p>
            <div class='de-StoreTile-tooltip'>
              <ul class='tooltip-content' v-html='store.fullHours'></ul>
            </div>
          </div>
          <div v-else>
            <p
              v-show='!(store.is_visual === true)'
              v-text='store.street2'
              class='de-u-spaceNone de-u-textDarkGray de-u-textShrink2 de-u-textMedium'
            >
            </p>
          </div>
        </div>
        <div class='de-StoreTile-actions de-u-size2of6 de-u-textShrink2 de-u-flex'>
          <a
            v-if='!(store.is_visual === true)'
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
            v-bind:href="store.page_info_url"
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
