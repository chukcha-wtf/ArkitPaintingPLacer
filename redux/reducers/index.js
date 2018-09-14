import { PaintingActionIds } from '../actions';

const initialState = {
  canHangAPainting: false,
  showRegularPreview: true,
  showAlternativePreview: false,
  currentAnchor: null,
  paintingPosition: null,
  anchors: {},
  activeImage: null
};

export default function arAppState(state = initialState, action) {
  let updates;
  
  switch (action.type) {
    case PaintingActionIds.UPDATE_ANCHORS_INFO:
      updates = {
        anchors: action.anchors
      };
      break;
    case PaintingActionIds.CHECK_IF_PAINTING_ALLOWED:
      updates = {
        canHangAPainting: action.canHangAPainting
      };
      break;
    case PaintingActionIds.SET_CURRENT_ANCHOR:
      updates = {
        currentAnchor: action.anchor
      };
      break;
    case PaintingActionIds.SET_PAINTING_POSITION:
      updates = {
        paintingPosition: action.paintingPosition
      };
      break;
    case PaintingActionIds.SWITCH_PREVIEW:
      updates = {
        showRegularPreview: !state.showRegularPreview,
        showAlternativePreview: !state.showAlternativePreview
      };
      break;
    case PaintingActionIds.SHOW_PREVIEW:
      updates = {
        showAlternativePreview: false,
        showRegularPreview: true,
        currentAnchor: null,
        paintingPosition: null
      };
      break;
    case PaintingActionIds.HIDE_PREVIEW:
      updates = {
        showAlternativePreview: false,
        showRegularPreview: false
      };
      break;
    case PaintingActionIds.SET_ACTIVE_IMAGE:
      updates = {
        activeImage: action.image
      }
      break;
    default:
      return state;
  }

  return Object.assign({}, state, updates);
};

export const selectCanHangAPainting = ({ arAppState }) => arAppState.canHangAPainting;
export const selectShouldShowRegularPreview = ({ arAppState }) => arAppState.showRegularPreview;
export const selectShouldShowAlternativePreview = ({ arAppState }) => arAppState.showAlternativePreview;
export const selectCurrentAnchor = ({ arAppState }) => arAppState.currentAnchor;
export const selectPaintingPosition = ({ arAppState }) => arAppState.paintingPosition;
export const selectAnchors = ({arAppState}) => arAppState.anchors;
export const selectActiveImage = ({ arAppState }) => arAppState.activeImage;
