import './buybox';
import './carousel';
import ColorSwatches from './color-swatches';
import SizeSwatches from './size-swatches';
import './videos';
import reviewsInit from './ratings-reviews';
import { updateOptionStates } from './option-states';

reviewsInit();

// This is only an example of how you can bind to the sizeSwatches "select"
// event to retrieve currently selected option
// @todo Remove this example if not used in production
const $sizeSwatches = SizeSwatches.init();
$sizeSwatches.on('SizeSwatches:select', (e, sizeSwatchesData) => {
  console.log('SELECTED:', sizeSwatchesData.value);
});

const $colorSwatches = ColorSwatches.init();
$colorSwatches.on('ColorSwatches:select', (e, colorSwatchesData) => {
  console.log('SELECTED:', colorSwatchesData.value);
});

updateOptionStates();
