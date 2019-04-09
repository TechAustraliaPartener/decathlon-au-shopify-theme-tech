import './buybox';
import './carousel';
import SizeSwatches from './size-swatches';
import './videos';
import reviewsInit from './ratings-reviews';

reviewsInit();

// This is only an example of how you can bind to the sizeSwatches "select"
// event to retrieve currently selected option
// @todo Remove this example if not used in production
const $sizeSwatches = SizeSwatches.init();
$sizeSwatches.on('SizeSwatches:select', (e, sizeSwatchesData) => {
  console.log('SELECTED:', sizeSwatchesData.value);
});
