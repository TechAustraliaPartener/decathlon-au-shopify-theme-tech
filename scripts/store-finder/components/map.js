import getGeocode from '../utilities/get-geocode';
import mapStyle from '../data/map-style';

export const map = {
  props: ['initialStores', 'isSelectedStore'],
  template: `
    <div></div>
  `,
  data() {
    return {
      map: null,
      stores: this.initialStores,
      storeMarkers: []
    };
  },
  computed: {
    markerIcon() {
      const iconConfig = { size: new google.maps.Size(40, 40) };
      const active = { ...iconConfig, url: window.mapMarkerActiveIcon };
      const inactive = { ...iconConfig, url: window.mapMarkerInactiveIcon };
      return { active, inactive };
    }
  },
  watch: {
    isSelectedStore(store) {
      const marker = this.storeMarkers.filter(
        marker => marker.store.id === store.id
      )[0];
      this.storeMarkers.forEach(m => m.setIcon(this.markerIcon.inactive));
      if (marker) {
        marker.setIcon(this.markerIcon.active);
        this.map.panTo(marker.getPosition());
      }
    }
  },
  mounted() {
    this.initMap();
  },
  methods: {
    async initMap() {
      try {
        const config = {
          zoomControl: !('ontouchend' in document),
          mapTypeControl: false,
          scaleControl: false,
          streetViewControl: false,
          rotateControl: false,
          fullscreenControl: false,
          styles: mapStyle,
          gestureHandling: 'greedy',
          draggable: !('ontouchend' in document)
        };

        this.map = new google.maps.Map(this.$el, config);

        const storeGeocodeResults = await getGeocode(this.stores);
        this.map.setCenter(storeGeocodeResults[0].geometry.location);
        this.map.fitBounds(storeGeocodeResults[0].geometry.viewport);
        this.map.setZoom(12);
        this.initStoreMarkers(storeGeocodeResults);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    initStoreMarkers(storeGeocodeResults) {
      const locations = storeGeocodeResults.map(storeGeocode => {
        return { position: storeGeocode.geometry.location };
      });

      const markers = locations.map((x, i) => {
        return new google.maps.Marker({
          ...x,
          map: this.map,
          icon: this.markerIcon.inactive,
          store: this.stores[i]
        });
      });

      this.storeMarkers = markers;

      markers.forEach(marker => {
        marker.addListener('click', e =>
          this.$emit('set-selected-store', marker.store)
        );
      });
    }
  }
};
