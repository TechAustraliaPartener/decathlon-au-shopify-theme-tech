import {
  setObjectInLocalStorage,
  removeItemFromLocalStorage,
  getObjectFromLocalStorage
} from '../../utilities/storage';
import fetchStores from '../utilities/fetch-stores';
import fetchUserLocation from '../utilities/fetch-user-location';
import getDistance from '../utilities/get-distance';
import getReverseGeocode from '../utilities/get-reverse-geocode';
import getUserGeolocation from '../utilities/get-user-geolocation';
import loadGoogleMaps from '../services/load-google-maps';
import formatStoreAddress from '../utilities/format-store-address';
import objectToParams from '../utilities/object-to-params';
import { searchForm } from './search-form';
import { map } from './map';
import { storeTile } from './store-tile';
import { noLocations } from './no-locations';

/**
 * Initialize Vue instance
 */
export const app = {
  name: 'app',
  template: `
    <div class='de-StoreFinder de-u-bgLightGray'>

      <div class='de-StoreController de-u-pad de-u-textSizeBase'>

        <h2 class='de-u-textBold de-u-textCapitalize de-u-textGrow de-u-spaceBottom06'>Store Finder</h2>
        <hr class='de-blue-hr de-u-bgBlue de-u-spaceNone'>

        <store-finder-search-form
          v-model.trim='searchInput'
          @blur='handleSearchFormBlur'
          @focus='handleSearchFormFocus'
          @form-submit='handleSearchFormSubmit'
          @clear-search-input='clearSearchInput'
          @get-user-geolocation='getUserGeolocation'
          :search-input='searchInput'
          :search-input-placeholder='searchInputPlaceholder'
          :geolocation-copy='geolocationCopy'
        ></store-finder-search-form>

        <section
          v-show='showStoreTiles'
          class='Section Section--unique'
        >
          <store-finder-store-tile
            v-for='(store, i) in stores'
            :key='store + i'
            @set-selected-store='setSelectedStore'
            @set-favorited-store='setFavoritedStore'
            @store-info-nav='goToStoreInfo'
            @store-direction-nav='goToStoreDirection'
            :store='store'
            :distance='store.distance'
            :is-favorited-store='isFavoritedStore'
            :class='{ "de-is-active": isSelectedStore && isSelectedStore.id === store.id }'
          ></store-finder-store-tile>
        </section>

        <store-finder-no-locations
          v-model.trim='emailInput'
          v-show='showNoLocations'
          @form-submit='handleEmailFormSubmit'
          @checkbox-toggle='handleEmailCheckboxToggle'
          :search-input='noLocationCopy'
          :search-input-placeholder='searchInputPlaceholder'
          :email-input-placeholder='emailInputPlaceholder'
        ></store-finder-no-locations>

        <div
          v-show='showLoader'
          :class='{ "de-u-flex": showLoader }'
          class='de-StoreController-loader de-u-flexAlignItemsCenter de-u-flexJustifyCenter'
        >
          <img
            class='de-StoreController-loaderImage'
            src='https://cdn.shopify.com/s/files/1/1752/4727/t/77/assets/ajax-loader.gif'
          >
        </div>
      </div>

      <store-finder-map
        v-if='stores.length > 0 && mapsInitialized && isStoresInitialized'
        @set-selected-store='setSelectedStore'
        :is-selected-store='isSelectedStore'
        :initialStores='stores'
        class='de-StoreMap'
      ></store-finder-map>
    </div>
  `,
  components: {
    'store-finder-search-form': searchForm,
    'store-finder-map': map,
    'store-finder-store-tile': storeTile,
    'store-finder-no-locations': noLocations
  },
  data() {
    return {
      isStoresInitialized: false,
      mapsInitialized: Boolean(window.google),
      stores: [],
      isStoreDistanceFetch: false,
      isFavoritedStore: null,
      isSelectedStore: null,
      isSearchInputFocused: false,
      isSearchInputCleared: false,
      searchInput: '',
      searchInputPlaceholder: '',
      searchInputPrevious: '',
      emailInput: '',
      emailInputPlaceholder: 'youremail@domain.com',
      isEmailCheckboxActive: false,
      userLocationZip: '',
      geolocationCopy: 'Use my location',
      noLocationCopy: '',
      outOfAreaThreshold: 100
    };
  },
  computed: {
    isStoresOutOfArea() {
      return this.stores.every(
        store => store.distanceFloat >= this.outOfAreaThreshold
      );
    },

    showStoreTiles() {
      return (
        this.isStoresInitialized &&
        !this.isStoreDistanceFetch &&
        !this.isStoresOutOfArea
      );
    },

    showLoader() {
      return !this.isStoresInitialized || this.isStoreDistanceFetch;
    },

    showNoLocations() {
      return (
        this.isStoresInitialized &&
        !this.isStoreDistanceFetch &&
        this.isStoresOutOfArea
      );
    }
  },
  beforeMount() {
    this.init();
  },
  methods: {
    async init() {
      try {
        await Promise.all([
          this.fetchStoreList(),
          this.fetchUserLocation(),
          this.loadGoogleMaps()
        ]);
        await this.getDistance(this.searchInputPlaceholder);
        this.getFavoritedStore();
        this.isStoresInitialized = true;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    async loadGoogleMaps() {
      try {
        if (!this.mapsInitialized) {
          await loadGoogleMaps();
          this.mapsInitialized = true;
        }
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    async fetchStoreList() {
      try {
        const stores = await fetchStores();
        this.stores = stores.map(store => ({
          ...store,
          distance: '',
          distanceInt: ''
        }));
      } catch (error) {
        console.error(error);
      }
    },

    async fetchUserLocation() {
      try {
        const userLocation = await fetchUserLocation();

        const { city, region_code: state } = userLocation;

        if (city && state) {
          this.searchInputPlaceholder = `${city}, ${state}`;
        }

        return { city, state };
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    async getUserGeolocation() {
      try {
        this.geolocationCopy = 'Location...';
        const userGeolocation = await getUserGeolocation();

        const latLng = {
          lat: userGeolocation.coords.latitude,
          lng: userGeolocation.coords.longitude
        };

        const res = await getReverseGeocode(latLng);

        let city = false;
        let state = false;

        res.address_components.forEach(component => {
          /* eslint-disable camelcase */
          const { types, short_name } = component;
          if (types.includes('locality')) {
            city = short_name;
          } else if (types.includes('administrative_area_level_1')) {
            state = short_name;
          }
          /* eslint-enable */
        });

        if (city && state) {
          this.searchInputPlaceholder = `${city}, ${state}`;
          this.noLocationCopy = `${city}, ${state}`;
          this.clearSearchInput();
          await this.getDistance(this.searchInputPlaceholder);
        }

        return { city, state };
      } catch (error) {
        console.error(error);
        throw error;
      } finally {
        this.geolocationCopy = 'Use my location';
      }
    },

    async getDistance(origin) {
      try {
        this.isStoreDistanceFetch = true;
        const destinations = this.stores.map(store =>
          formatStoreAddress(store)
        );
        const distances = await getDistance({ origin, destinations });
        if (distances.length > 0) {
          this.stores = this.stores
            .map((store, i) => ({
              ...store,
              distance: distances[i],
              distanceFloat: parseFloat(distances[i].replace(/,/g, ''), 10)
            }))
            .sort((a, b) => a.distanceFloat - b.distanceFloat);
        }
        return distances;
      } catch (error) {
        console.error(error);
      } finally {
        this.isStoreDistanceFetch = false;
      }
    },

    async handleSearchFormSubmit() {
      if (!this.searchInput) return;
      try {
        // Store input for the event of no distance results
        this.noLocationCopy = this.searchInput;
        this.searchInputPrevious = this.searchInput;
        const origin = this.searchInput;
        await this.getDistance(origin);
      } catch (error) {
        console.error(error);
      }
    },

    handleSearchFormBlur() {
      this.isSearchInputFocused = false;
      if (
        this.searchInput.length === 0 &&
        this.searchInput !== this.searchInputPrevious
      ) {
        this.getDistance(this.searchInputPlaceholder);
        this.noLocationCopy = this.searchInput;
        this.isSearchInputCleared = false;
      }
    },

    handleSearchFormFocus() {
      this.isSearchInputFocused = true;
      if (!this.isSearchInputCleared) {
        this.searchInputPrevious = this.searchInput;
      }
    },

    clearSearchInput() {
      this.isSearchInputCleared = true;
      this.searchInputPrevious = this.searchInput;
      this.searchInput = '';
    },

    async handleEmailFormSubmit() {
      const emailAddress = this.emailInput;
      const newsletterSubscribe = `${this.isEmailCheckboxActive}`;
      if (!emailAddress) return;

      try {
        this.emailInput = '';

        const url = 'https://decathlon-proxy.herokuapp.com/api/mailchimp';
        await fetch(url, {
          method: 'POST',
          body: JSON.stringify({
            emailAddress,
            newsletterSubscribe
          }),
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers':
              'Origin, X-Requested-With, Content-Type, Accept',
            'Content-Type': 'application/json'
          }
        });

        this.emailInputPlaceholder = 'Thank you for signing up!';
        setTimeout(() => {
          this.emailInputPlaceholder = 'youremail@domain.com';
        }, 3000);
      } catch (error) {
        console.error(error);
        this.emailInput = emailAddress;
      }
    },

    handleEmailCheckboxToggle(checkboxState) {
      this.isEmailCheckboxActive = checkboxState;
    },

    setSelectedStore(store) {
      this.isSelectedStore = store;
    },

    setFavoritedStore(store) {
      if (this.isFavoritedStore && this.isFavoritedStore.id === store.id) {
        this.deleteFavoritedStore();
      } else {
        this.isFavoritedStore = store;
        setObjectInLocalStorage('favoritedStore', store);
      }
    },

    getFavoritedStore() {
      const favoritedStore = getObjectFromLocalStorage('favoritedStore');
      if (
        favoritedStore &&
        this.stores.filter(store => store.id === favoritedStore.id)[0]
      ) {
        this.isFavoritedStore = favoritedStore;
      }
    },

    deleteFavoritedStore() {
      if (this.isFavoritedStore) {
        removeItemFromLocalStorage('favoritedStore');
        this.isFavoritedStore = null;
      }
    },

    goToStoreInfo(store) {
      const storeUrlMap = {
        adr_GezSSC9M: 'https://www.decathlon.com/pages/san-francisco',
        adr_K6s3Kaja: 'https://www.decathlon.com/pages/emeryville',
        adr_sfpotrero: 'https://www.decathlon.com/pages/sf-potrero-hill'
      };
      const { id } = store;
      const url = storeUrlMap[id];
      if (url) {
        window.location.href = url;
      }
    },

    goToStoreDirection(store) {
      const directions = {
        origin: this.searchInput || this.searchInputPlaceholder,
        destination: formatStoreAddress(store)
      };
      const url = `https://www.google.com/maps/dir/?api=1&${objectToParams(
        directions
      )}`;

      if (url) {
        window.location.href = url;
      }
    }
  }
};
