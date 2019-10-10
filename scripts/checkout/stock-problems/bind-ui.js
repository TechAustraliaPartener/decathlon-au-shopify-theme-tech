import { loadingOverlay, loadingImage } from './ui-elements';
import { hideElements } from '../ui-helpers';

const bindUI = () => {
  hideElements([loadingOverlay, loadingImage]);
};

export default {
  bindUI
};
