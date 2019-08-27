import { loadingOverlay, loadingImage } from '../ui-elements';
import { hideElements } from '../../utilities/element-utils';

const bindUI = () => {
  hideElements([loadingOverlay, loadingImage]);
};

export default {
  bindUI
};
