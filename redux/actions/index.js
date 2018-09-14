/**
 * Redux actions
 * 
 */

export const PaintingActionIds = {
  UPDATE_ANCHORS_INFO: "UPDATE_ANCHORS_INFO",
  CHECK_IF_PAINTING_ALLOWED: "CHECK_IF_PAINTING_ALLOWED",
  SET_CURRENT_ANCHOR: "SET_CURRENT_ANCHOR",
  SET_PAINTING_POSITION: "SET_PAINTING_POSITION",
  SWITCH_PREVIEW: "SWITCH_PREVIEW",
  SHOW_PREVIEW: "SHOW_PREVIEW",
  HIDE_PREVIEW: "HIDE_PREVIEW",
  SET_ACTIVE_IMAGE: "SET_ACTIVE_IMAGE"
};

export const PaintingActionCreators = {
  updateAnchorsInfo(anchors) {
    return {
      type: PaintingActionIds.UPDATE_ANCHORS_INFO,
      anchors
    };
  },

  checkIfPaintingAllowed(canHangAPainting) {
    return {
      type: PaintingActionIds.CHECK_IF_PAINTING_ALLOWED,
      canHangAPainting
    };
  },

  setCurrentAnchor(anchor) {
    return {
      type: PaintingActionIds.SET_CURRENT_ANCHOR,
      anchor
    };
  },

  setPaintingPosition(paintingPosition) {
    return {
      type: PaintingActionIds.SET_PAINTING_POSITION,
      paintingPosition
    }
  },

  switchPreview() {
    return {
      type: PaintingActionIds.SWITCH_PREVIEW
    };
  },

  showPreview() {
    return {
      type: PaintingActionIds.SHOW_PREVIEW
    };
  },

  hidePreview() {
    return {
      type: PaintingActionIds.HIDE_PREVIEW
    };
  },

  setActiveImage(image) {
    return {
      type: PaintingActionIds.SET_ACTIVE_IMAGE,
      image
    }
  }
};